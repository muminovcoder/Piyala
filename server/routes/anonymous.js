const express = require('express');
const { query } = require('../config/db');
const { anonLimiter } = require('../middleware/security');

const router = express.Router();

router.post('/sync', anonLimiter, async (req, res) => {
  try {
    const { deviceId, stats, favorites, recentWords, grammar } = req.body;
    if (!deviceId || deviceId.length < 8) {
      return res.status(400).json({ error: 'Invalid device ID' });
    }
    const existing = await query('SELECT device_id FROM device_sessions WHERE device_id = $1 LIMIT 1', [deviceId]);
    if (existing.rows.length > 0) {
      await query(
        `UPDATE device_sessions SET
          stats = $1::jsonb, favorites = $2::jsonb,
          recent_words = $3::jsonb, grammar = $4::jsonb
        WHERE device_id = $5`,
        [
          JSON.stringify(stats || {}),
          JSON.stringify(favorites || []),
          JSON.stringify(recentWords || []),
          JSON.stringify(grammar || {}),
          deviceId,
        ]
      );
    } else {
      await query(
        `INSERT INTO device_sessions (device_id, stats, favorites, recent_words, grammar)
         VALUES ($1, $2::jsonb, $3::jsonb, $4::jsonb, $5::jsonb)`,
        [
          deviceId,
          JSON.stringify(stats || {}),
          JSON.stringify(favorites || []),
          JSON.stringify(recentWords || []),
          JSON.stringify(grammar || {}),
        ]
      );
    }
    res.json({ message: 'Anonymous data synced' });
  } catch (err) {
    console.error('Anonymous sync error:', err);
    res.status(500).json({ error: 'Sync failed' });
  }
});

router.get('/load', anonLimiter, async (req, res) => {
  try {
    const deviceId = req.query.deviceId;
    if (!deviceId || deviceId.length < 8) {
      return res.status(400).json({ error: 'Invalid device ID' });
    }
    const result = await query('SELECT stats, favorites, recent_words, grammar FROM device_sessions WHERE device_id = $1 LIMIT 1', [deviceId]);
    if (result.rows.length > 0) {
      const row = result.rows[0];
      res.json({
        stats: row.stats || null,
        favorites: row.favorites || [],
        recentWords: row.recent_words || [],
        grammar: row.grammar || null,
      });
    } else {
      res.json({ stats: null, favorites: [], recentWords: [], grammar: null });
    }
  } catch (err) {
    console.error('Anonymous load error:', err);
    res.status(500).json({ error: 'Failed to load data' });
  }
});

module.exports = router;
