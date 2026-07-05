// SECURE: Profile routes — get, update profile, change password
const express = require('express');
const bcrypt = require('bcrypt');
const { z } = require('zod');
const { query } = require('../config/db');
const { authenticate } = require('../middleware/auth');
const { csrfProtection } = require('../middleware/security');

const router = express.Router();
const SALT_ROUNDS = 14;

// SECURE: Zod validation schemalari
const updateProfileSchema = z.object({
  displayName: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(200).optional(),
  website: z.string().url().optional().or(z.literal('')),
  nativeLanguage: z.string().max(50).optional(),
  targetLanguage: z.string().max(50).optional(),
  dailyWordGoal: z.number().int().min(1).max(200).optional(),
  studyGoal: z.enum(['casual', 'regular', 'intensive', 'hardcore']).optional(),
  avatarUrl: z.string().url().optional().or(z.literal('')),
  theme: z.enum(['dark', 'light', 'auto']).optional(),
  notifications: z.object({
    email: z.boolean().optional(),
    streak_reminder: z.boolean().optional(),
    achievement: z.boolean().optional(),
  }).optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number')
    .regex(/[^A-Za-z0-9]/, 'Must contain a special character'),
});

// SECURE: GET /api/profile
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT
        u.id, u.username, u.email, u.phone, u.created_at, u.last_login_at,
        u.first_name, u.last_name, u.telegram_username, u.telegram_id, u.profile_photo,
        u.telegram_password_hash, u.premium_tier, u.premium_granted_at,
        up.display_name, up.avatar_url, up.bio, up.location, up.website,
        up.native_language, up.target_language, up.daily_word_goal, up.study_goal,
        up.notification_preferences, up.theme
      FROM users u
      LEFT JOIN user_profiles up ON up.user_id = u.id
      WHERE u.id = $1 LIMIT 1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const row = result.rows[0];

    res.json({
      profile: {
        id: row.id,
        username: row.username,
        email: row.email,
        phone: row.phone || '',
        displayName: row.display_name || row.username,
        avatarUrl: row.avatar_url || '',
        bio: row.bio || '',
        location: row.location || '',
        website: row.website || '',
        nativeLanguage: row.native_language || '',
        targetLanguage: row.target_language || 'English',
        dailyWordGoal: row.daily_word_goal || 10,
        studyGoal: row.study_goal || 'casual',
        notifications: row.notification_preferences || { email: true, streak_reminder: true, achievement: true },
        theme: row.theme || 'dark',
        createdAt: row.created_at,
        lastLoginAt: row.last_login_at,
        // Telegram info
        telegram: row.telegram_username ? {
          username: row.telegram_username,
          firstName: row.first_name,
          lastName: row.last_name,
          telegramId: row.telegram_id,
          profilePhoto: row.profile_photo,
          phone: row.phone || '',
          hasPassword: !!(row.telegram_password_hash),
        } : null,
        premium: {
          tier: row.premium_tier || 'Free',
          grantedAt: row.premium_granted_at,
          expiresAt: row.premium_expires_at,
        },
      }
    });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Failed to load profile' });
  }
});
// SECURE: PUT /api/profile
router.put('/', authenticate, csrfProtection, async (req, res) => {
  const parsed = updateProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({ error: 'Validation failed', details: parsed.error.flatten().fieldErrors });
  }

  try {
    const {
      displayName, bio, location, website,
      nativeLanguage, targetLanguage, dailyWordGoal, studyGoal,
      avatarUrl, theme, notifications
    } = parsed.data;

    // Upsert profile
    const upsertFields = [
      req.user.id,
      displayName || null,
      avatarUrl || null,
      bio || null,
      location || null,
      website || null,
      nativeLanguage || null,
      targetLanguage || null,
      dailyWordGoal || 10,
      studyGoal || 'casual',
      JSON.stringify(notifications || { email: true, streak_reminder: true, achievement: true }),
      theme || 'dark',
    ];

    await query(
      `INSERT INTO user_profiles (user_id, display_name, avatar_url, bio, location, website,
        native_language, target_language, daily_word_goal, study_goal,
        notification_preferences, theme)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb, $12)
      ON CONFLICT (user_id) DO UPDATE SET
        display_name = COALESCE(EXCLUDED.display_name, user_profiles.display_name),
        avatar_url = COALESCE(EXCLUDED.avatar_url, user_profiles.avatar_url),
        bio = COALESCE(EXCLUDED.bio, user_profiles.bio),
        location = COALESCE(EXCLUDED.location, user_profiles.location),
        website = COALESCE(EXCLUDED.website, user_profiles.website),
        native_language = COALESCE(EXCLUDED.native_language, user_profiles.native_language),
        target_language = COALESCE(EXCLUDED.target_language, user_profiles.target_language),
        daily_word_goal = COALESCE(EXCLUDED.daily_word_goal, user_profiles.daily_word_goal),
        study_goal = COALESCE(EXCLUDED.study_goal, user_profiles.study_goal),
        notification_preferences = COALESCE(EXCLUDED.notification_preferences, user_profiles.notification_preferences),
        theme = COALESCE(EXCLUDED.theme, user_profiles.theme)`,
      upsertFields
    );

    // Update display_name on users table too
    if (displayName) {
      await query('UPDATE users SET display_name = $1 WHERE id = $2', [displayName, req.user.id]);
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// SECURE: PUT /api/profile/password
router.put('/password', authenticate, csrfProtection, async (req, res) => {
  const parsed = changePasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({ error: 'Validation failed', details: parsed.error.flatten().fieldErrors });
  }
  const { currentPassword, newPassword } = parsed.data;

  try {

    const userResult = await query(
      'SELECT password_hash FROM users WHERE id = $1 LIMIT 1',
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isValid = await bcrypt.compare(currentPassword, userResult.rows[0].password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const newHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await query('UPDATE users SET password_hash = $1 WHERE id = $2', [newHash, req.user.id]);

    // Revoke all refresh tokens (force re-login)
    await query(
      'UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = $1 AND revoked_at IS NULL',
      [req.user.id]
    );

    const { clearAuthCookies } = require('../middleware/auth');
    clearAuthCookies(res);

    res.json({ message: 'Password changed. Please login again.' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

module.exports = router;
