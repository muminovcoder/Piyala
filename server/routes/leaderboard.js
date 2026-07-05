const express = require('express');
const { query } = require('../config/db');

const router = express.Router();

// GET /api/leaderboard?period=all&search=&page=1&limit=30
router.get('/', async (req, res) => {
  try {
    const period = req.query.period || 'all';
    const search = (req.query.search || '').trim();
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 30));
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE u.is_active = TRUE';
    const params = [];
    let paramIdx = 1;

    if (search) {
      whereClause += ` AND (u.username ILIKE $${paramIdx} OR u.display_name ILIKE $${paramIdx})`;
      params.push(`%${search}%`);
      paramIdx++;
    }

    let orderClause;
    if (period === 'weekly') {
      // Weekly: use weekly_data JSONB, summing for the last 7 days
      orderClause = `
        ORDER BY COALESCE(
          (us.weekly_data->>(TO_CHAR(CURRENT_DATE, 'YYYY-MM-DD')))::int, 0
        ) + COALESCE(
          (us.weekly_data->>(TO_CHAR(CURRENT_DATE - INTERVAL '1 day', 'YYYY-MM-DD')))::int, 0
        ) + COALESCE(
          (us.weekly_data->>(TO_CHAR(CURRENT_DATE - INTERVAL '2 days', 'YYYY-MM-DD')))::int, 0
        ) + COALESCE(
          (us.weekly_data->>(TO_CHAR(CURRENT_DATE - INTERVAL '3 days', 'YYYY-MM-DD')))::int, 0
        ) + COALESCE(
          (us.weekly_data->>(TO_CHAR(CURRENT_DATE - INTERVAL '4 days', 'YYYY-MM-DD')))::int, 0
        ) + COALESCE(
          (us.weekly_data->>(TO_CHAR(CURRENT_DATE - INTERVAL '5 days', 'YYYY-MM-DD')))::int, 0
        ) + COALESCE(
          (us.weekly_data->>(TO_CHAR(CURRENT_DATE - INTERVAL '6 days', 'YYYY-MM-DD')))::int, 0
        ) DESC
      `;
    } else if (period === 'monthly') {
      // Monthly: sum from the last 30 days
      const dateClauses = [];
      for (let i = 0; i < 30; i++) {
        dateClauses.push(
          `COALESCE((us.weekly_data->>(TO_CHAR(CURRENT_DATE - INTERVAL '${i} days', 'YYYY-MM-DD')))::int, 0)`
        );
      }
      orderClause = `ORDER BY (${dateClauses.join(' + ')}) DESC`;
    } else {
      // All time
      orderClause = 'ORDER BY us.total_xp DESC';
    }

    // Count total users
    const countResult = await query(
      `SELECT COUNT(*)::int as total FROM users u
       JOIN user_stats us ON us.user_id = u.id
       ${whereClause}`,
      params
    );
    const total = countResult.rows[0].total;

    // Fetch users with period-specific XP calculation
    let periodXpSelect;
    if (period === 'weekly') {
      periodXpSelect = `
        COALESCE(
          (us.weekly_data->>(TO_CHAR(CURRENT_DATE, 'YYYY-MM-DD')))::int, 0
        ) + COALESCE(
          (us.weekly_data->>(TO_CHAR(CURRENT_DATE - INTERVAL '1 day', 'YYYY-MM-DD')))::int, 0
        ) + COALESCE(
          (us.weekly_data->>(TO_CHAR(CURRENT_DATE - INTERVAL '2 days', 'YYYY-MM-DD')))::int, 0
        ) + COALESCE(
          (us.weekly_data->>(TO_CHAR(CURRENT_DATE - INTERVAL '3 days', 'YYYY-MM-DD')))::int, 0
        ) + COALESCE(
          (us.weekly_data->>(TO_CHAR(CURRENT_DATE - INTERVAL '4 days', 'YYYY-MM-DD')))::int, 0
        ) + COALESCE(
          (us.weekly_data->>(TO_CHAR(CURRENT_DATE - INTERVAL '5 days', 'YYYY-MM-DD')))::int, 0
        ) + COALESCE(
          (us.weekly_data->>(TO_CHAR(CURRENT_DATE - INTERVAL '6 days', 'YYYY-MM-DD')))::int, 0
        ) AS period_xp
      `;
    } else if (period === 'monthly') {
      const dateClauses = [];
      for (let i = 0; i < 30; i++) {
        dateClauses.push(
          `COALESCE((us.weekly_data->>(TO_CHAR(CURRENT_DATE - INTERVAL '${i} days', 'YYYY-MM-DD')))::int, 0)`
        );
      }
      periodXpSelect = `(${dateClauses.join(' + ')}) AS period_xp`;
    } else {
      periodXpSelect = 'us.total_xp AS period_xp';
    }

    // For rank change: get previous period total from the past week's data
    let prevPeriodXpSelect;
    if (period !== 'all') {
      const prevDateClauses = [];
      for (let i = 7; i < 14; i++) {
        prevDateClauses.push(
          `COALESCE((us.weekly_data->>(TO_CHAR(CURRENT_DATE - INTERVAL '${i} days', 'YYYY-MM-DD')))::int, 0)`
        );
      }
      prevPeriodXpSelect = `(${prevDateClauses.join(' + ')}) AS prev_period_xp`;
    } else {
      prevPeriodXpSelect = 'us.total_xp AS prev_period_xp';
    }

    const result = await query(
      `SELECT u.id, u.username, u.display_name,
              us.total_xp, us.level, us.words_learned, us.streak,
              COALESCE(array_length(us.achievements, 1), 0) as achievement_count,
              ${periodXpSelect},
              ${prevPeriodXpSelect}
       FROM users u
       JOIN user_stats us ON us.user_id = u.id
       ${whereClause}
       ${orderClause}
       LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
      [...params, limit, offset]
    );

    // Get rank changes by comparing with previous period ordering
    // We compute a dummy rank from prev_period_xp ordering
    let prevRankMap = {};
    if (result.rows.length > 0 && period !== 'all') {
      const prevResult = await query(
        `SELECT u.id,
                ${prevPeriodXpSelect}
         FROM users u
         JOIN user_stats us ON us.user_id = u.id
         WHERE u.is_active = TRUE
         ORDER BY prev_period_xp DESC
         LIMIT 200`,
        []
      );
      prevResult.rows.forEach((u, idx) => {
        prevRankMap[u.id] = idx + 1;
      });
    }

    const users = result.rows.map(u => ({
      id: u.id,
      username: u.username,
      displayName: u.display_name || u.username,
      totalXp: u.total_xp,
      level: u.level || 1,
      wordsLearned: u.words_learned || 0,
      streak: u.streak || 0,
      achievementCount: parseInt(u.achievement_count) || 0,
      periodXp: parseInt(u.period_xp) || 0,
      prevPeriodXp: parseInt(u.prev_period_xp) || 0,
    }));

    res.json({
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      period,
    });
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ error: 'Failed to load leaderboard' });
  }
});

router.get('/user/:id', async (req, res) => {
  try {
    const result = await query(
      `SELECT u.id, u.username, u.display_name, u.created_at,
              us.total_xp, us.level, us.words_learned, us.streak,
              COALESCE(array_length(us.achievements, 1), 0) as achievement_count,
              us.cards_reviewed, us.study_minutes, us.correct_answers, us.total_questions,
              up.bio, up.location, up.native_language, up.target_language
       FROM users u
       JOIN user_stats us ON us.user_id = u.id
       LEFT JOIN user_profiles up ON up.user_id = u.id
       WHERE u.id = $1 AND u.is_active = TRUE
       LIMIT 1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const u = result.rows[0];
    const accuracy = u.total_questions > 0
      ? Math.round((u.correct_answers / u.total_questions) * 100)
      : 0;

    res.json({
      id: u.id,
      username: u.username,
      displayName: u.display_name || u.username,
      totalXP: u.total_xp || 0,
      level: u.level || 1,
      wordsLearned: u.words_learned || 0,
      streak: u.streak || 0,
      achievements: u.achievement_count || 0,
      cardsReviewed: u.cards_reviewed || 0,
      studyMinutes: u.study_minutes || 0,
      accuracy,
      bio: u.bio || '',
      location: u.location || '',
      nativeLanguage: u.native_language || '',
      targetLanguage: u.target_language || 'English',
      joinedAt: u.created_at,
    });
  } catch (err) {
    console.error('User details error:', err);
    res.status(500).json({ error: 'Failed to load user details' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await query('SELECT COUNT(*)::int as count FROM users WHERE is_active = TRUE');
    let onlineNow = 0;
    try {
      const online = await query(
        `SELECT COUNT(*)::int as count FROM users
         WHERE is_active = TRUE AND last_login_at > NOW() - INTERVAL '15 minutes'`
      );
      onlineNow = online.rows[0].count;
    } catch (_) {
      onlineNow = totalUsers.rows[0].count;
    }
    res.json({
      totalUsers: totalUsers.rows[0].count,
      onlineNow,
    });
  } catch (err) {
    console.error('Leaderboard stats error:', err);
    res.status(500).json({ error: 'Failed to load stats' });
  }
});

module.exports = router;
