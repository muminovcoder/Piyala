// SECURE: JWT Authentication Middleware with token blacklisting
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

// SECURE: Verify access token from httpOnly cookie or Authorization header
async function authenticate(req, res, next) {
  // Prefer httpOnly cookie
  const token = req.cookies?.access_token || req.headers?.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {
      algorithms: ['HS256'],
      issuer: 'vocabmaster-ai',
      maxAge: '15m',
    });

    // SECURE: Check token blacklist (skip if DB unavailable)
    try {
      const blacklisted = await query(
        'SELECT 1 FROM token_blacklist WHERE token_jti = $1 AND expires_at > NOW() LIMIT 1',
        [decoded.jti]
      );
      if (blacklisted.rows.length > 0) {
        return res.status(401).json({ error: 'Token has been revoked' });
      }
    } catch (_) {
      // DB unavailable — skip blacklist check
    }

    req.user = {
      id: decoded.sub,
      username: decoded.username,
      email: decoded.email,
    };
    req.tokenJti = decoded.jti;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// SECURE: Optional auth — doesn't fail if no token, but sets req.user if valid
async function optionalAuth(req, res, next) {
  const token = req.cookies?.access_token || req.headers?.authorization?.replace('Bearer ', '');
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {
      algorithms: ['HS256'],
      issuer: 'vocabmaster-ai',
    });
    try {
      const blacklisted = await query(
        'SELECT 1 FROM token_blacklist WHERE token_jti = $1 AND expires_at > NOW() LIMIT 1',
        [decoded.jti]
      );
      if (blacklisted.rows.length === 0) {
        req.user = {
          id: decoded.sub,
          username: decoded.username,
          email: decoded.email,
        };
      }
    } catch (_) {
      // DB unavailable — proceed without blacklist check
      req.user = {
        id: decoded.sub,
        username: decoded.username,
        email: decoded.email,
      };
    }
  } catch {
    // Token invalid — proceed without user
  }
  next();
}

// SECURE: Generate access token (short-lived)
function generateAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      username: user.username,
      email: user.email,
      jti: require('crypto').randomUUID(),
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      algorithm: 'HS256',
      issuer: 'vocabmaster-ai',
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m',
    }
  );
}

// SECURE: Generate refresh token (long-lived)
function generateRefreshToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      type: 'refresh',
      jti: require('crypto').randomUUID(),
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      algorithm: 'HS256',
      issuer: 'vocabmaster-ai',
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d',
    }
  );
}

// SECURE: Set auth cookies on response
function setAuthCookies(res, accessToken, refreshToken) {
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    path: '/',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    path: '/api/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // CSRF token
  const csrfToken = require('crypto').randomBytes(32).toString('hex');
  res.cookie('csrf_token', csrfToken, {
    httpOnly: false, // Must be accessible to JS
    secure: isProduction,
    sameSite: 'strict',
    path: '/',
    maxAge: 15 * 60 * 1000,
  });

  return csrfToken;
}

// SECURE: Clear auth cookies
function clearAuthCookies(res) {
  res.clearCookie('access_token', { path: '/' });
  res.clearCookie('refresh_token', { path: '/api/auth' });
  res.clearCookie('csrf_token', { path: '/' });
}

module.exports = {
  authenticate,
  optionalAuth,
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
  clearAuthCookies,
};
