// SECURE: User progress and data sync routes
const express = require('express');
const { query } = require('../config/db');
const { authenticate } = require('../middleware/auth');
const { csrfProtection } = require('../middleware/security');

const router = express.Router();

const VALID_DIFFICULTIES = new Set(['beginner', 'intermediate', 'advanced', 'academic', 'sat']);

function normalizeDifficulty(value) {
  if (typeof value !== 'string') return 'intermediate';
  const normalized = value.trim().toLowerCase();
  return VALID_DIFFICULTIES.has(normalized) ? normalized : 'intermediate';
}

// All progress routes require authentication + CSRF

// SECURE: Sync full user state (save from client)
router.post('/sync', authenticate, csrfProtection, async (req, res) => {
  try {
    const { stats, favorites, recentWords, grammar } = req.body;
    const userId = req.user.id;

    // Update stats
    if (stats) {
      const existingStats = await query(
        'SELECT id FROM user_stats WHERE user_id = $1 LIMIT 1',
        [userId]
      );

      if (existingStats.rows.length > 0) {
        await query(
          `UPDATE user_stats SET
            total_xp = GREATEST(total_xp, $1),
            level = $2,
            words_learned = GREATEST(words_learned, $3),
            correct_answers = GREATEST(correct_answers, $4),
            total_questions = GREATEST(total_questions, $5),
            games_played = GREATEST(games_played, $6),
            cards_reviewed = GREATEST(cards_reviewed, $7),
            study_minutes = GREATEST(study_minutes, $8),
            streak = GREATEST(streak, $9),
            last_active_date = $10::date,
            heatmap = $11::jsonb, weekly_data = $12::jsonb,
            achievements = $13::text[]
          WHERE user_id = $14`,
          [
            stats.totalXP || 0, stats.level || 1, stats.wordsLearned || 0,
            stats.correctAnswers || 0, stats.totalQuestions || 0,
            stats.gamesPlayed || 0, stats.cardsReviewed || 0,
            stats.studyMinutes || 0, stats.streak || 0,
            stats.lastDate || null,
            JSON.stringify(stats.heatmap || {}),
            JSON.stringify(stats.weeklyData || {}),
            stats.achievements || [],
            userId,
          ]
        );
      } else {
        await query(
          `INSERT INTO user_stats (
            user_id, total_xp, level, words_learned,
            correct_answers, total_questions, games_played,
            cards_reviewed, study_minutes, streak,
            last_active_date, heatmap, weekly_data, achievements
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::date, $12::jsonb, $13::jsonb, $14::text[])`,
          [
            userId,
            stats.totalXP || 0, stats.level || 1, stats.wordsLearned || 0,
            stats.correctAnswers || 0, stats.totalQuestions || 0,
            stats.gamesPlayed || 0, stats.cardsReviewed || 0,
            stats.studyMinutes || 0, stats.streak || 0,
            stats.lastDate || null,
            JSON.stringify(stats.heatmap || {}),
            JSON.stringify(stats.weeklyData || {}),
            stats.achievements || [],
          ]
        );
      }
    }

    // Sync favorites / word progress
    // CRITICAL: Only process if non-empty to prevent empty array wiping all favorites
    if (Array.isArray(favorites) && favorites.length > 0) {
      // UPSERT each favorite — no DELETE to avoid data loss
      for (const fav of favorites) {
        await query(
          `INSERT INTO user_progress (user_id, word, status, difficulty, is_favorite, last_reviewed_at)
           VALUES ($1, $2, 'learning', $3, TRUE, NOW())
           ON CONFLICT (user_id, word) DO UPDATE SET is_favorite = TRUE, updated_at = NOW()`,
          [userId, fav.word, fav.difficulty || 'intermediate']
        );
      }
    }

    // Sync grammar data
    if (grammar) {
      await query(
        `UPDATE user_stats SET
          grammar_xp = $1, grammar_level = $2, grammar_rank = $3,
          grammar_total_lessons = $4, grammar_completed_lessons = $5::text[],
          grammar_lesson_progress = $6::jsonb,
          grammar_quiz_score = $7, grammar_total_quizzes = $8,
          grammar_total_correct = $9, grammar_total_questions = $10,
          grammar_streak = $11, grammar_achievements = $12::text[],
          grammar_heatmap = $13::jsonb, grammar_weekly_data = $14::jsonb
        WHERE user_id = $15`,
        [
          grammar.xp || 0, grammar.level || 1, grammar.rank || 'Beginner',
          grammar.totalLessons || 0, grammar.completedLessons || [],
          JSON.stringify(grammar.lessonProgress || {}),
          grammar.quizScore || 0, grammar.totalQuizzes || 0,
          grammar.totalCorrect || 0, grammar.totalQuestions || 0,
          grammar.streak || 0, grammar.achievements || [],
          JSON.stringify(grammar.heatmap || {}),
          JSON.stringify(grammar.weeklyData || {}),
          userId,
        ]
      );
    }

    res.json({ message: 'Data synced successfully' });
  } catch (err) {
    console.error('Sync error:', err);
    res.status(500).json({ error: 'Sync failed' });
  }
});

// SECURE: Load user data from server
router.get('/load', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    let statsResult, favoritesResult;
    try {
      statsResult = await query('SELECT * FROM user_stats WHERE user_id = $1 LIMIT 1', [userId]);
      favoritesResult = await query(
        'SELECT word, difficulty, times_viewed, times_correct, times_wrong FROM user_progress WHERE user_id = $1 AND is_favorite = TRUE ORDER BY updated_at DESC',
        [userId]
      );
    } catch (err) {
      // Table missing (42P01 = undefined_table) — data was deleted at schema level
      if (err.code === '42P01') {
        return res.json({ code: 'DATA_DELETED' });
      }
      throw err;
    }

    const stats = statsResult.rows[0] || null;
    const favorites = favoritesResult.rows || [];

    // Transform stats to frontend format
    const frontendStats = stats ? {
      wordsLearned: stats.words_learned,
      totalXP: stats.total_xp,
      streak: stats.streak,
      level: stats.level,
      correctAnswers: stats.correct_answers,
      totalQuestions: stats.total_questions,
      gamesPlayed: stats.games_played,
      cardsReviewed: stats.cards_reviewed,
      studyMinutes: stats.study_minutes,
      lastDate: stats.last_active_date,
      heatmap: stats.heatmap || {},
      weeklyData: stats.weekly_data || {},
      achievements: stats.achievements || [],
      accuracy: stats.total_questions > 0
        ? Math.round((stats.correct_answers / stats.total_questions) * 100)
        : 0,
      xpInLevel: 0,
      wordsToday: 0,
    } : null;

    // If no stats found for authenticated user, data was deleted — signal client
    if (!stats) {
      return res.json({ code: 'DATA_DELETED' });
    }

    const grammar = {
      xp: stats.grammar_xp,
      level: stats.grammar_level,
      rank: stats.grammar_rank,
      totalLessons: stats.grammar_total_lessons,
      completedLessons: stats.grammar_completed_lessons || [],
      lessonProgress: stats.grammar_lesson_progress || {},
      quizScore: stats.grammar_quiz_score,
      totalQuizzes: stats.grammar_total_quizzes,
      totalCorrect: stats.grammar_total_correct,
      totalQuestions: stats.grammar_total_questions,
      streak: stats.grammar_streak,
      achievements: stats.grammar_achievements || [],
      strongestTopic: stats.grammar_strongest_topic || '',
      weakestTopic: stats.grammar_weakest_topic || '',
      heatmap: stats.grammar_heatmap || {},
      weeklyData: stats.grammar_weekly_data || {},
    };

    res.json({
      stats: frontendStats,
      favorites,
      grammar,
    });
  } catch (err) {
    console.error('Load error:', err);
    res.status(500).json({ error: 'Failed to load data' });
  }
});

// SECURE: Record word interaction
router.post('/word', authenticate, csrfProtection, async (req, res) => {
  try {
    const { word, action, difficulty } = req.body;
    const userId = req.user.id;

    const validActions = ['view', 'correct', 'wrong', 'favorite', 'unfavorite'];
    if (!validActions.includes(action)) {
      return res.status(400).json({ error: 'Invalid action' });
    }

    const existing = await query(
      'SELECT id, times_viewed, times_correct, times_wrong FROM user_progress WHERE user_id = $1 AND word = $2 LIMIT 1',
      [userId, word]
    );

    if (existing.rows.length > 0) {
      const updates = {};
      if (action === 'view') updates.times_viewed = 'times_viewed + 1';
      if (action === 'correct') updates.times_correct = 'times_correct + 1';
      if (action === 'wrong') updates.times_wrong = 'times_wrong + 1';
      if (action === 'favorite') updates.is_favorite = 'TRUE';
      if (action === 'unfavorite') updates.is_favorite = 'FALSE';

      const setClauses = Object.entries(updates).map(([k, v]) => `${k} = ${v}`);
      setClauses.push('last_reviewed_at = NOW()');

      await query(
        `UPDATE user_progress SET ${setClauses.join(', ')} WHERE id = $1`,
        [existing.rows[0].id]
      );
    } else {
      await query(
        `INSERT INTO user_progress (user_id, word, status, difficulty, is_favorite, times_viewed, last_reviewed_at)
         VALUES ($1, $2, 'new', $3, $4, 1, NOW())`,
        [userId, word, difficulty || 'intermediate', action === 'favorite']
      );
    }

    res.json({ message: 'Word progress updated' });
  } catch (err) {
    console.error('Word progress error:', err);
    res.status(500).json({ error: 'Failed to update word progress' });
  }
});

module.exports = router;
