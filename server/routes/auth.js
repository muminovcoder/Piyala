// SECURE: Authentication routes — logout, refresh, me
const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { z } = require('zod');
const { query } = require('../config/db');
const {
  authenticate,
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
  clearAuthCookies,
} = require('../middleware/auth');
const { authLimiter, csrfProtection } = require('../middleware/security');

const router = express.Router();

// SECURE: Zod validation schemalari
const loginSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
});

const registerSchema = z.object({
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_-]+$/, 'Username must be 3-50 alphanumeric characters, hyphens, or underscores'),
  email: z.string().email('Valid email required'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
});

// SECURE: POST /api/auth/login (with account lockout)
router.post('/login', authLimiter, async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({ error: 'Validation failed', details: parsed.error.flatten().fieldErrors });
    }

    const { email, password } = parsed.data;

    const userResult = await query(
      'SELECT id, username, email, password_hash, failed_attempts, locked_until, is_active FROM users WHERE email = $1 LIMIT 1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = userResult.rows[0];

    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      const remainingMin = Math.ceil((new Date(user.locked_until) - new Date()) / 60000);
      return res.status(423).json({ error: `Account locked. Try again in ${remainingMin} minute(s).` });
    }

    if (!user.is_active) {
      return res.status(403).json({ error: 'Account has been deactivated' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      const newAttempts = (user.failed_attempts || 0) + 1;
      if (newAttempts >= 5) {
        await query(
          'UPDATE users SET failed_attempts = $1, locked_until = NOW() + INTERVAL \'15 minutes\' WHERE id = $2',
          [newAttempts, user.id]
        );
        return res.status(423).json({ error: 'Account locked for 15 minutes due to too many failed attempts' });
      }
      await query('UPDATE users SET failed_attempts = $1 WHERE id = $2', [newAttempts, user.id]);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    await query(
      'UPDATE users SET failed_attempts = 0, locked_until = NULL, last_login_at = NOW() WHERE id = $1',
      [user.id]
    );

    const userData = { id: user.id, username: user.username, email: user.email };
    const accessToken = generateAccessToken(userData);
    const refreshToken = generateRefreshToken(userData);

    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await query(
      'INSERT INTO refresh_tokens (user_id, token_hash, ip_address, expires_at) VALUES ($1, $2, $3::inet, $4)',
      [user.id, tokenHash, req.ip || '0.0.0.0', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
    ).catch(() => {});

    const csrfToken = setAuthCookies(res, accessToken, refreshToken);

    res.json({
      message: 'Login successful',
      user: { id: user.id, username: user.username, email: user.email },
      csrfToken,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// SECURE: POST /api/auth/register (with account lockout)
router.post('/register', authLimiter, async (req, res) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({ error: 'Validation failed', details: parsed.error.flatten().fieldErrors });
    }

    const { username, email, password } = parsed.data;

    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1 OR username = $2 LIMIT 1',
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'User with this email or username already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 14);

    const result = await query(
      `INSERT INTO users (username, email, password_hash, display_name, is_verified, is_active)
       VALUES ($1, $2, $3, $4, FALSE, TRUE)
       RETURNING id, username, email`,
      [username, email, passwordHash, username]
    );

    const user = result.rows[0];

    await query('INSERT INTO user_stats (user_id) VALUES ($1)', [user.id]);

    const userData = { id: user.id, username: user.username, email: user.email };
    const accessToken = generateAccessToken(userData);
    const refreshToken = generateRefreshToken(userData);

    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await query(
      'INSERT INTO refresh_tokens (user_id, token_hash, ip_address, expires_at) VALUES ($1, $2, $3::inet, $4)',
      [user.id, tokenHash, req.ip || '0.0.0.0', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
    ).catch(() => {});

    const csrfToken = setAuthCookies(res, accessToken, refreshToken);

    res.status(201).json({
      message: 'Registration successful',
      user: { id: user.id, username: user.username, email: user.email },
      csrfToken,
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// SECURE: Hash a refresh token for storage
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// SECURE: POST /api/auth/logout
router.post('/logout', authenticate, async (req, res) => {
  try {
    // Blacklist the access token
    await query(
      'INSERT INTO token_blacklist (token_jti, user_id, expires_at, reason) VALUES ($1, $2, NOW() + INTERVAL \'15 minutes\', $3)',
      [req.tokenJti, req.user.id, 'logout']
    );

    // Revoke all refresh tokens for this user
    await query(
      'UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = $1 AND revoked_at IS NULL',
      [req.user.id]
    );

    clearAuthCookies(res);

    res.json({ message: 'Logout successful' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// SECURE: POST /api/auth/refresh
router.post('/refresh', authLimiter, async (req, res) => {
  const refreshToken = req.cookies?.refresh_token;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token required' });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, {
      algorithms: ['HS256'],
      issuer: 'vocabmaster-ai',
    });

    const tokenHash = hashToken(refreshToken);
    const stored = await query(
      `SELECT id, user_id, revoked_at, replaced_by, is_compromised
       FROM refresh_tokens
       WHERE token_hash = $1 AND expires_at > NOW()
       LIMIT 1`,
      [tokenHash]
    );

    if (stored.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const storedToken = stored.rows[0];

    // SECURE: Token reuse detection
    if (storedToken.revoked_at || storedToken.is_compromised) {
      // This token has been reused — possible token theft
      // Revoke ALL tokens for this user
      await query(
        'UPDATE refresh_tokens SET revoked_at = NOW(), is_compromised = TRUE WHERE user_id = $1',
        [storedToken.user_id]
      );
      clearAuthCookies(res);
      return res.status(401).json({ error: 'Token reuse detected. All sessions revoked for security.' });
    }

    // Get user
    const userResult = await query(
      'SELECT id, username, email FROM users WHERE id = $1 AND is_active = TRUE LIMIT 1',
      [storedToken.user_id]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // Revoke old refresh token (token rotation)
    await query(
      'UPDATE refresh_tokens SET revoked_at = NOW(), replaced_by = $1 WHERE id = $2',
      [decoded.jti, storedToken.id]
    );

    // Update last_login_at so user stays "online" in speaking/leaderboard
    await query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);

    // Generate new tokens
    const userData = { id: user.id, username: user.username, email: user.email };
    const newAccessToken = generateAccessToken(userData);
    const newRefreshToken = generateRefreshToken(userData);

    // Store new hashed refresh token
    const newTokenHash = hashToken(newRefreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await query(
      `INSERT INTO refresh_tokens (user_id, token_hash, ip_address, expires_at)
       VALUES ($1, $2, $3::inet, $4)`,
      [user.id, newTokenHash, req.ip || '0.0.0.0', expiresAt]
    );

    // Set new cookies
    const csrfToken = setAuthCookies(res, newAccessToken, newRefreshToken);

    res.json({
      message: 'Token refreshed',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      csrfToken,
    });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      clearAuthCookies(res);
      return res.status(401).json({ error: 'Refresh token expired. Please login again.' });
    }
    console.error('Refresh error:', err);
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// SECURE: GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
  try {
    // Heartbeat: update last_login_at so user stays "online"
    await query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [req.user.id]);

    const result = await query(
      `SELECT id, username, email, display_name, avatar_url, created_at, last_login_at
       FROM users WHERE id = $1 LIMIT 1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

module.exports = router;
