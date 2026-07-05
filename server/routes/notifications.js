const express = require('express');
const { query } = require('../config/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const ADMIN_TELEGRAM_ID = '5684720948';

async function isAdmin(userId) {
  try {
    const result = await query(
      'SELECT telegram_id FROM users WHERE id = $1 LIMIT 1',
      [userId]
    );
    return result.rows.length > 0 && result.rows[0].telegram_id === ADMIN_TELEGRAM_ID;
  } catch {
    return false;
  }
}

// POST /api/notifications/broadcast — admin only
router.post('/broadcast', authenticate, async (req, res) => {
  try {
    if (!(await isAdmin(req.user.id))) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    const { title, message, expiresIn } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const validDays = [1, 2, 3, 7, 14, 30];
    var days = parseInt(expiresIn) || 7;
    if (validDays.indexOf(days) === -1) days = 7;

    var expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    const notif = await query(
      `INSERT INTO notifications (title, message, created_by, expires_at)
       VALUES ($1, $2, $3, $4)
       RETURNING id, title, message, created_at, expires_at`,
      [title || 'Admin Announcement', message, req.user.id, expiresAt]
    );

    res.json({
      success: true,
      notification: notif.rows[0],
    });
  } catch (err) {
    console.error('Broadcast error:', err.message);
    res.status(500).json({ error: 'Failed to broadcast' });
  }
});

// POST /api/notifications/bot-broadcast — called by Telegram bot (no auth)
router.post('/bot-broadcast', async (req, res) => {
  try {
    const { title, message, expiresIn } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const validDays = [1, 2, 3, 7, 14, 30];
    var days = parseInt(expiresIn) || 7;
    if (validDays.indexOf(days) === -1) days = 7;

    var expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    const notif = await query(
      `INSERT INTO notifications (title, message, created_by, expires_at)
       VALUES ($1, $2, $3, $4)
       RETURNING id, title, message, created_at, expires_at`,
      [title || 'Admin Announcement', message, null, expiresAt]
    );

    res.json({
      success: true,
      notification: notif.rows[0],
    });
  } catch (err) {
    console.error('Bot broadcast error:', err.message);
    res.status(500).json({ error: 'Failed to broadcast' });
  }
});

// GET /api/notifications/public — active broadcasts, no auth needed
router.get('/public', async (req, res) => {
  try {
    const notifs = await query(
      `SELECT id, title, message, created_at, expires_at
       FROM notifications
       WHERE expires_at IS NULL OR expires_at > NOW()
       ORDER BY created_at DESC
       LIMIT 20`
    );
    res.json({ notifications: notifs.rows });
  } catch (err) {
    console.error('Public notifications error:', err.message);
    res.status(500).json({ error: 'Failed to load notifications' });
  }
});

// GET /api/notifications — user's notifications (non-expired)
router.get('/', authenticate, async (req, res) => {
  try {
    const notifs = await query(
      `SELECT n.id, n.title, n.message, n.created_by, n.created_at, n.expires_at,
              nr.read_at IS NOT NULL AS is_read, nr.read_at
       FROM notifications n
       LEFT JOIN notification_reads nr ON nr.notification_id = n.id AND nr.user_id = $1
       WHERE n.expires_at IS NULL OR n.expires_at > NOW()
       ORDER BY n.created_at DESC
       LIMIT 50`,
      [req.user.id]
    );
    res.json({ notifications: notifs.rows });
  } catch (err) {
    console.error('Get notifications error:', err.message);
    res.status(500).json({ error: 'Failed to load notifications' });
  }
});

// GET /api/notifications/unread-count
router.get('/unread-count', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT COUNT(*) AS count
       FROM notifications n
       LEFT JOIN notification_reads nr ON nr.notification_id = n.id AND nr.user_id = $1
       WHERE nr.read_at IS NULL AND (n.expires_at IS NULL OR n.expires_at > NOW())`,
      [req.user.id]
    );
    res.json({ count: parseInt(result.rows[0].count) || 0 });
  } catch (err) {
    console.error('Unread count error:', err.message);
    res.json({ count: 0 });
  }
});

// POST /api/notifications/read — mark as read
router.post('/read', authenticate, async (req, res) => {
  try {
    const { notificationId } = req.body;
    if (notificationId) {
      await query(
        `INSERT INTO notification_reads (user_id, notification_id)
         VALUES ($1, $2)
         ON CONFLICT (user_id, notification_id) DO NOTHING`,
        [req.user.id, notificationId]
      );
    } else {
      await query(
        `INSERT INTO notification_reads (user_id, notification_id)
         SELECT $1, id FROM notifications
         WHERE id NOT IN (
           SELECT notification_id FROM notification_reads WHERE user_id = $1
         )
         ON CONFLICT (user_id, notification_id) DO NOTHING`,
        [req.user.id]
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Mark read error:', err.message);
    res.status(500).json({ error: 'Failed to mark as read' });
  }
});

// Cleanup expired notifications every hour
setInterval(async () => {
  try {
    await query("DELETE FROM notification_reads WHERE notification_id IN (SELECT id FROM notifications WHERE expires_at IS NOT NULL AND expires_at <= NOW())");
    await query("DELETE FROM notifications WHERE expires_at IS NOT NULL AND expires_at <= NOW()");
  } catch (_) {}
}, 3600000);

module.exports = router;
