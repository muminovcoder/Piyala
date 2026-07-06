const express = require('express');
const crypto = require('crypto');
const https = require('https');
const bcrypt = require('bcrypt');

const { query, transaction, pool } = require('../config/db');
const {
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
} = require('../middleware/auth');
const { authLimiter } = require('../middleware/security');

const router = express.Router();

const pendingAuths = new Map();
const AUTH_TTL = 10 * 60 * 1000;

setInterval(() => {
  const now = Date.now();
  for (const [sessionId, data] of pendingAuths) {
    if (now - data.createdAt > AUTH_TTL) pendingAuths.delete(sessionId);
  }
}, 120000);

function getBotToken() { return process.env.TELEGRAM_BOT_TOKEN; }
function getBotUsername() { return process.env.TELEGRAM_BOT_USERNAME; }
function generateSessionId() { return crypto.randomBytes(16).toString('hex'); }
function generateCode() { return String(Math.floor(100000 + Math.random() * 900000)); }

function tgApi(method, payload) {
  return new Promise((resolve) => {
    const token = getBotToken();
    if (!token) { resolve(null); return; }
    const data = JSON.stringify(payload);
    const opts = {
      hostname: 'api.telegram.org',
      path: `/bot${token}/${method}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
    };
    const req = https.request(opts, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => { try { resolve(JSON.parse(body)); } catch { resolve(null); } });
    });
    req.on('error', () => resolve(null));
    req.write(data);
    req.end();
  });
}

// Maps Telegram username -> chatId (in-memory cache from bot interactions)
const usernameChatMap = new Map();

// Helper: resolve short ID or UUID to actual user UUID
async function resolveUserId(input) {
  // Try exact UUID first
  const uuidResult = await query('SELECT id FROM users WHERE id = $1 LIMIT 1', [input]).catch(() => null);
  if (uuidResult && uuidResult.rows.length > 0) return uuidResult.rows[0].id;
  // Try short ID match
  const allUsers = await query('SELECT id FROM users').catch(() => null);
  if (allUsers) {
    for (const row of allUsers.rows) {
      const h = row.id.replace(/-/g, '');
      let n = 0;
      for (let i = 0; i < h.length; i++) n = (n * 31 + parseInt(h[i], 16)) % 100000000;
      if (String(n).padStart(8, '0') === input) return row.id;
    }
  }
  return null;
}

// ============================================================
// POST /api/auth/telegram/send-code
// Step 1: User enters Telegram username -> generate + send code
// ============================================================
router.post('/send-code', authLimiter, async (req, res) => {
  try {
    if (!getBotToken() || !getBotUsername()) {
      return res.status(503).json({ error: 'Telegram bot not configured' });
    }

    let { telegram_username } = req.body;
    if (!telegram_username) {
      return res.status(400).json({ error: 'Telegram username is required' });
    }

    telegram_username = telegram_username.replace(/^@/, '').trim().toLowerCase();
    if (telegram_username.length < 3) {
      return res.status(400).json({ error: 'Invalid Telegram username' });
    }

    // Generate 6-digit code and session ID
    const code = generateCode();
    const sessionId = generateSessionId();

    pendingAuths.set(sessionId, {
      telegram_username,
      code,
      verified: false,
      userId: null,
      firstName: null,
      chatId: null,
      codeSent: false,
      createdAt: Date.now(),
    });

    // Try to send code directly if we know this user's chatId
    const knownChatId = usernameChatMap.get(telegram_username);
    let sentViaBot = false;

    if (knownChatId) {
      const result = await tgApi('sendMessage', {
        chat_id: knownChatId,
        text: `🔐 *Piyala Verification*\n\nYour verification code is:\n\n\`${code}\`\n\nEnter this code on the website to complete registration.\n\nCode expires in 10 minutes.`,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[
            { text: '✅ Go to Website', url: 'https://vocabmasterai.site' }
          ]],
        },
      });
      if (result && result.ok) {
        pendingAuths.get(sessionId).chatId = knownChatId;
        pendingAuths.get(sessionId).codeSent = true;
        sentViaBot = true;
      }
    }

    res.json({
      success: true,
      sessionId,
      sentViaBot,
      message: sentViaBot
        ? 'Verification code sent to your Telegram!'
        : 'Please message @' + getBotUsername() + ' on Telegram to receive your code.',
    });
  } catch (err) {
    console.error('Telegram send-code error:', err);
    res.status(500).json({ error: 'Failed to send verification code' });
  }
});

// ============================================================
// POST /api/auth/telegram/register
// Step 1-3: Enter phone, telegram username, password -> get code via bot
// ============================================================
router.post('/register', authLimiter, async (req, res) => {
  try {
    if (!getBotToken() || !getBotUsername()) {
      return res.status(503).json({ error: 'Telegram bot not configured' });
    }

    let { phone, telegram_username, password } = req.body;
    if (!phone || !telegram_username || !password) {
      return res.status(400).json({ error: 'Phone, Telegram username, and password are required' });
    }

    telegram_username = telegram_username.replace(/^@/, '').trim().toLowerCase();
    phone = phone.trim().replace(/[^0-9+]/g, '');

    if (telegram_username.length < 3) {
      return res.status(400).json({ error: 'Invalid Telegram username' });
    }
    if (phone.length < 7) {
      return res.status(400).json({ error: 'Invalid phone number' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Check if telegram username already taken
    const existing = await query(
      'SELECT id FROM users WHERE telegram_username = $1 LIMIT 1',
      [telegram_username]
    ).catch(() => null);
    if (existing && existing.rows.length > 0) {
      return res.status(409).json({ error: 'This Telegram account is already registered. Please login.' });
    }

    const passwordHash = await bcrypt.hash(password, 14);
    const code = generateCode();
    const sessionId = generateSessionId();

    pendingAuths.set(sessionId, {
      phone,
      telegram_username,
      passwordHash,
      code,
      verified: false,
      userId: null,
      firstName: null,
      chatId: null,
      codeSent: false,
      createdAt: Date.now(),
    });

    // Try to send code via bot if chatId known
    const knownChatId = usernameChatMap.get(telegram_username);
    let sentViaBot = false;

    if (knownChatId) {
      const result = await tgApi('sendMessage', {
        chat_id: knownChatId,
        text: `🔐 *Piyala Registration*\n\nYour verification code is:\n\n\`${code}\`\n\nEnter this code on the website to complete registration.\n\nCode expires in 10 minutes.`,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[
            { text: '✅ Go to Website', url: 'https://vocabmasterai.site' }
          ]],
        },
      });
      if (result && result.ok) {
        pendingAuths.get(sessionId).chatId = knownChatId;
        pendingAuths.get(sessionId).codeSent = true;
        sentViaBot = true;
      }
    }

    res.json({
      success: true,
      sessionId,
      sentViaBot,
      message: sentViaBot
        ? 'Verification code sent to your Telegram!'
        : 'Please message @' + getBotUsername() + ' on Telegram to receive your code.',
    });
  } catch (err) {
    console.error('Telegram register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// ============================================================
// POST /api/auth/telegram/verify-code
// Step 4: User enters the code from Telegram -> verify + create account
// ============================================================
router.post('/verify-code', authLimiter, async (req, res) => {
  try {
    const { code, sessionId } = req.body;
    if (!sessionId || !code) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const authData = pendingAuths.get(sessionId);
    if (!authData) {
      return res.status(400).json({ error: 'Session expired. Please start again.' });
    }

    if (authData.verified) {
      return res.status(400).json({ error: 'Already verified. Please log in.' });
    }

    if (code !== authData.code) {
      return res.status(400).json({ error: 'Invalid verification code. Please try again.' });
    }

    // Code is valid! Create user with all stored data
    authData.verified = true;
    const { telegram_username, phone, passwordHash } = authData;
    let dbUser = null;

    try {
      // Double-check user doesn't already exist
      let user = await query(
        `SELECT id, username, email, display_name FROM users WHERE telegram_username = $1 LIMIT 1`,
        [telegram_username]
      );

      if (user.rows.length > 0) {
        dbUser = user.rows[0];
        // Update with phone and password hash if not set
        await query(
          `UPDATE users SET last_login_at = NOW(), failed_attempts = 0, locked_until = NULL,
           phone = COALESCE(NULLIF($2, ''), phone),
           telegram_password_hash = COALESCE(NULLIF($3, ''), telegram_password_hash)
           WHERE id = $1`,
          [dbUser.id, phone, passwordHash]
        );
      } else {
        // Create new user with phone, telegram, and password
        const safeName = 'tg_' + telegram_username;
        const generatedEmail = `telegram_${telegram_username}@vocabmaster.ai`;

        dbUser = await transaction(async (client) => {
          const u = await client.query(
            `INSERT INTO users (username, email, display_name, telegram_username, phone, telegram_password_hash, is_verified, is_active)
             VALUES ($1, $2, $3, $4, $5, $6, TRUE, TRUE)
             RETURNING id, username, email, display_name`,
            [safeName, generatedEmail, telegram_username, telegram_username, phone, passwordHash]
          );
          await client.query(`INSERT INTO user_stats (user_id) VALUES ($1)`, [u.rows[0].id]);
          return u.rows[0];
        });
      }
    } catch (dbErr) {
      console.error('DB error during verify-code:', dbErr.message);
      return res.status(500).json({ error: 'Database error. Please try again.' });
    }

    if (!dbUser) {
      return res.status(500).json({ error: 'Failed to create user account.' });
    }

    pendingAuths.delete(sessionId);

    // Generate JWT tokens
    const userData = { id: dbUser.id, username: dbUser.username, email: dbUser.email };
    const accessToken = generateAccessToken(userData);
    const refreshToken = generateRefreshToken(userData);

    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await query(
      `INSERT INTO refresh_tokens (user_id, token_hash, ip_address, expires_at) VALUES ($1, $2, $3::inet, $4)`,
      [dbUser.id, tokenHash, req.ip || '0.0.0.0', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
    ).catch(() => {});

    const csrfToken = setAuthCookies(res, accessToken, refreshToken);

    // Notify the user on Telegram
    if (authData.chatId) {
      tgApi('sendMessage', {
        chat_id: authData.chatId,
        text: `✅ *Registration successful!*\n\nYou are now logged in to Piyala. Happy learning! 🎉`,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[
            { text: '🚀 Open Piyala', url: 'https://vocabmasterai.site' }
          ]],
        },
      }).catch(() => {});
    }

    res.json({
      success: true,
      user: {
        id: dbUser.id,
        username: dbUser.username,
        email: dbUser.email,
        displayName: dbUser.display_name,
      },
      csrfToken,
    });
  } catch (err) {
    console.error('Telegram verify-code error:', err);
    res.status(500).json({ error: 'Failed to verify code' });
  }
});

// ============================================================
// POST /api/auth/telegram/login
// Login with telegram username + password
// ============================================================
router.post('/login', authLimiter, async (req, res) => {
  try {
    let { telegram_username, password } = req.body;
    if (!telegram_username || !password) {
      return res.status(400).json({ error: 'Telegram username and password are required' });
    }

    telegram_username = telegram_username.replace(/^@/, '').trim().toLowerCase();

    const userResult = await query(
      `SELECT id, username, email, display_name, telegram_password_hash,
              failed_attempts, locked_until, is_active
       FROM users WHERE telegram_username = $1 LIMIT 1`,
      [telegram_username]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid Telegram username or password' });
    }

    const user = userResult.rows[0];

    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      const remainingMin = Math.ceil((new Date(user.locked_until) - new Date()) / 60000);
      return res.status(423).json({ error: `Account locked. Try again in ${remainingMin} minute(s).` });
    }

    if (!user.is_active) {
      return res.status(403).json({ error: 'Account has been deactivated' });
    }

    if (!user.telegram_password_hash) {
      return res.status(401).json({ error: 'No password set. Please register via Continue with Telegram Bot.' });
    }

    const validPassword = await bcrypt.compare(password, user.telegram_password_hash);
    if (!validPassword) {
      const newAttempts = (user.failed_attempts || 0) + 1;
      if (newAttempts >= 5) {
        await query(
          `UPDATE users SET failed_attempts = $1, locked_until = NOW() + INTERVAL '15 minutes' WHERE id = $2`,
          [newAttempts, user.id]
        );
        return res.status(423).json({ error: 'Account locked for 15 minutes due to too many failed attempts' });
      }
      await query('UPDATE users SET failed_attempts = $1 WHERE id = $2', [newAttempts, user.id]);
      return res.status(401).json({ error: 'Invalid Telegram username or password' });
    }

    await query(
      `UPDATE users SET failed_attempts = 0, locked_until = NULL, last_login_at = NOW() WHERE id = $1`,
      [user.id]
    );

    const userData = { id: user.id, username: user.username, email: user.email };
    const accessToken = generateAccessToken(userData);
    const refreshToken = generateRefreshToken(userData);

    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await query(
      `INSERT INTO refresh_tokens (user_id, token_hash, ip_address, expires_at) VALUES ($1, $2, $3::inet, $4)`,
      [user.id, tokenHash, req.ip || '0.0.0.0', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
    ).catch(() => {});

    const csrfToken = setAuthCookies(res, accessToken, refreshToken);

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.display_name,
      },
      csrfToken,
    });
  } catch (err) {
    console.error('Telegram login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ============================================================
// POST /api/auth/telegram/tg-webhook
// Bot forwards messages here when user interacts with the bot
// ============================================================
router.post('/tg-webhook', async (req, res) => {
  res.sendStatus(200);

  try {
    const { message } = req.body;
    if (!message || !message.from || !message.text) return;

    const chatId = message.chat.id;
    const from = message.from;
    const telegramUsername = (from.username || '').toLowerCase();
    const firstName = from.first_name || 'User';

    // Store username -> chatId mapping for future code delivery
    if (telegramUsername) {
      usernameChatMap.set(telegramUsername, chatId);
    }

    const text = message.text.trim().toLowerCase();

    // Handle /start command
    if (text.startsWith('/start')) {
      // Check if this user has a pending code
      if (telegramUsername) {
        let foundSession = null;
        for (const [sid, data] of pendingAuths) {
          if (data.telegram_username === telegramUsername && !data.verified && !data.codeSent) {
            foundSession = { sid, data };
            break;
          }
        }

        if (foundSession) {
          const code = foundSession.data.code;
          foundSession.data.chatId = chatId;
          foundSession.data.codeSent = true;
          foundSession.data.firstName = firstName;

          await tgApi('sendMessage', {
            chat_id: chatId,
            text: `🔐 *Piyala Verification*\n\nHey ${firstName}! Your verification code is:\n\n\`${code}\`\n\nEnter this code on the website to complete registration.\n\nCode expires in 10 minutes.`,
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [[
                { text: '✅ Go to Website', url: 'https://vocabmasterai.site' }
              ]],
            },
          });
          return;
        }
      }

      await tgApi('sendMessage', {
        chat_id: chatId,
        text: `🎯 *Welcome to Piyala, ${firstName}!* 🎯\n\nTo get started:\n1️⃣ Go to the website\n2️⃣ Click \"Continue with Telegram Bot\"\n3️⃣ Enter your phone number, Telegram username, and create a password\n4️⃣ Come back here and send /start to get your verification code\n\nAlready registered? Just login with your username and password on the website.\n\nLet's master vocabulary together! 🚀`,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[
            { text: '🌐 Open Website', url: 'https://vocabmasterai.site' }
          ]],
        },
      });
      return;
    }

    // Any other message - check for pending code
    if (telegramUsername) {
      let foundSession = null;
      for (const [sid, data] of pendingAuths) {
        if (data.telegram_username === telegramUsername && !data.verified && !data.codeSent) {
          foundSession = { sid, data };
          break;
        }
      }

      if (foundSession) {
        const code = foundSession.data.code;
        foundSession.data.chatId = chatId;
        foundSession.data.codeSent = true;
        foundSession.data.firstName = firstName;

        await tgApi('sendMessage', {
          chat_id: chatId,
          text: `🔐 *Piyala Verification*\n\nHey ${firstName}! Your verification code is:\n\n\`${code}\`\n\nEnter this code on the website to complete registration.`,
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [[
              { text: '✅ Go to Website', url: 'https://vocabmasterai.site' }
            ]],
          },
        });
        return;
      }
    }

    // No pending code
    await tgApi('sendMessage', {
      chat_id: chatId,
      text: `Hi ${firstName}! 👋\n\nI'm the Piyala bot. To get a verification code:\n\n1. Go to vocabmasterai.site\n2. Click "Continue with Telegram Bot"\n3. Enter your phone number, Telegram username, and create a password\n4. Come back here and send /start`,
      reply_markup: {
        inline_keyboard: [[
          { text: '🚀 Open Piyala', url: 'https://vocabmasterai.site' }
        ]],
      },
    });
  } catch (err) {
    console.error('tg-webhook error:', err.message);
  }
});

// ============================================================
// GET /api/auth/telegram/bot-info
// Returns bot configuration
// ============================================================
router.get('/bot-info', (req, res) => {
  if (!getBotUsername()) {
    return res.json({ configured: false });
  }
  res.json({
    configured: true,
    botUsername: getBotUsername(),
    deepLink: `https://t.me/${getBotUsername()}`,
  });
});

// ============================================================
// POST /api/auth/telegram/bot/register-user
// Store/update bot user interaction
// ============================================================
router.post('/bot/register-user', async (req, res) => {
  try {
    const { user, chatId, isAdmin } = req.body;
    if (!user || !chatId) return res.json({ success: false });

    const { id: telegramId, username, first_name, last_name } = user;

    // Check if user already exists in telegram_bot_users
    const existing = await query(
      'SELECT id FROM telegram_bot_users WHERE telegram_id = $1 LIMIT 1',
      [telegramId]
    ).catch(() => null);

    if (existing && existing.rows.length > 0) {
      await query(
        `UPDATE telegram_bot_users SET username = $1, first_name = $2, last_name = $3, 
         chat_id = $4, last_interaction_at = NOW(), is_admin = $5
         WHERE telegram_id = $6`,
        [username || null, first_name || null, last_name || null, chatId, !!isAdmin, telegramId]
      ).catch(() => {});
    } else {
      await query(
        `INSERT INTO telegram_bot_users (telegram_id, username, first_name, last_name, chat_id, is_admin)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (telegram_id) DO UPDATE SET
         username = EXCLUDED.username, first_name = EXCLUDED.first_name,
         last_name = EXCLUDED.last_name, chat_id = EXCLUDED.chat_id,
         last_interaction_at = NOW()`,
        [telegramId, username || null, first_name || null, last_name || null, chatId, !!isAdmin]
      ).catch(() => {});
    }

    // Also update telegram_chat_id in users table if this telegram user is linked
    await query(
      `UPDATE users SET telegram_chat_id = $1 WHERE telegram_id = $2 AND (telegram_chat_id IS NULL OR telegram_chat_id != $1)`,
      [String(chatId), String(telegramId)]
    ).catch(() => {});

    res.json({ success: true });
  } catch (err) {
    console.error('register-bot-user error:', err.message);
    res.json({ success: false });
  }
});

// ============================================================
// GET /api/auth/telegram/admin/stats
// Returns website & bot stats (protected by admin check)
// ============================================================
router.get('/admin/stats', async (req, res) => {
  try {
    const websiteUsers = await query('SELECT COUNT(*) as count FROM users').catch(() => ({ rows: [{ count: 0 }] }));
    const botUsers = await query('SELECT COUNT(*) as count FROM telegram_bot_users').catch(() => ({ rows: [{ count: 0 }] }));
    const premiumUsers = await query("SELECT COUNT(*) as count FROM users WHERE premium_tier != 'Free'").catch(() => ({ rows: [{ count: 0 }] }));
    const premiumGrants = await query('SELECT COUNT(*) as count FROM premium_grants').catch(() => ({ rows: [{ count: 0 }] }));

    res.json({
      websiteUsers: parseInt(websiteUsers.rows[0].count) || 0,
      botUsers: parseInt(botUsers.rows[0].count) || 0,
      premiumUsers: parseInt(premiumUsers.rows[0].count) || 0,
      premiumGrants: parseInt(premiumGrants.rows[0].count) || 0,
    });
  } catch (err) {
    console.error('admin stats error:', err.message);
    res.json({ websiteUsers: 0, botUsers: 0, premiumUsers: 0, premiumGrants: 0 });
  }
});

// ============================================================
// POST /api/auth/telegram/admin/give-premium
// Grant premium to a user (admin only)
// ============================================================
router.post('/admin/give-premium', async (req, res) => {
  try {
    const { userId, tier, grantedByAdminId } = req.body;
    if (!userId || !tier || !grantedByAdminId) {
      return res.json({ success: false, error: 'Missing fields' });
    }

    if (!['Basic', 'Premium', 'Premium Ultra'].includes(tier)) {
      return res.json({ success: false, error: 'Invalid tier' });
    }

    // Find the user by short ID or UUID
    let targetUser = null;
    
    // Try exact UUID first
    const uuidResult = await query(
      'SELECT id, username, display_name, telegram_chat_id, telegram_id FROM users WHERE id = $1 LIMIT 1',
      [userId]
    ).catch(() => null);

    if (uuidResult && uuidResult.rows.length > 0) {
      targetUser = uuidResult.rows[0];
    } else {
      // Try matching by short ID (last 8 chars of UUID converted to numeric ID)
      const allUsers = await query('SELECT id, username, display_name, telegram_chat_id, telegram_id FROM users').catch(() => null);
      if (allUsers) {
        for (const row of allUsers.rows) {
          const h = row.id.replace(/-/g, '');
          let n = 0;
          for (let i = 0; i < h.length; i++) {
            n = (n * 31 + parseInt(h[i], 16)) % 100000000;
          }
          const shortId = String(n).padStart(8, '0');
          if (shortId === userId) {
            targetUser = row;
            break;
          }
        }
      }
    }

    if (!targetUser) {
      return res.json({ success: false, error: 'User not found' });
    }

    // Find admin UUID from telegram_bot_users or users table
    let adminUuid = null;
    const adminUser = await query(
      'SELECT id FROM users WHERE telegram_id = $1 LIMIT 1',
      [String(grantedByAdminId)]
    ).catch(() => null);
    if (adminUser && adminUser.rows.length > 0) {
      adminUuid = adminUser.rows[0].id;
    }
    if (!adminUuid) {
      // Try telegram_bot_users — lookup by telegram_id, then find user by username
      const botUser = await query(
        'SELECT user_id FROM telegram_bot_users WHERE telegram_id = $1 LIMIT 1',
        [String(grantedByAdminId)]
      ).catch(() => null);
      if (botUser && botUser.rows.length > 0 && botUser.rows[0].user_id) {
        adminUuid = botUser.rows[0].user_id;
      }
    }

    // Grant premium
    await query(
      `UPDATE users SET premium_tier = $1, premium_granted_at = NOW(), premium_granted_by = $2
       WHERE id = $3`,
      [tier, adminUuid, targetUser.id]
    );

    // Record in premium_grants table
    await query(
      `INSERT INTO premium_grants (user_id, tier, granted_by) VALUES ($1, $2, $3)`,
      [targetUser.id, tier, adminUuid]
    ).catch(() => {});

    res.json({
      success: true,
      userChatId: targetUser.telegram_chat_id,
      userDisplayName: targetUser.display_name || targetUser.username,
    });
  } catch (err) {
    console.error('give-premium error:', err.message);
    res.json({ success: false, error: 'Failed to grant premium' });
  }
});

// ============================================================
// GET /api/auth/telegram/admin/premium-users
// List all premium users
// ============================================================
router.get('/admin/premium-users', async (req, res) => {
  try {
    const result = await query(
      `SELECT id, username, display_name, premium_tier, premium_granted_at
       FROM users WHERE premium_tier != 'Free'
       ORDER BY premium_granted_at DESC`
    ).catch(() => ({ rows: [] }));

    const users = result.rows.map(row => {
      const h = row.id.replace(/-/g, '');
      let n = 0;
      for (let i = 0; i < h.length; i++) {
        n = (n * 31 + parseInt(h[i], 16)) % 100000000;
      }
      return {
        id: row.id,
        short_id: String(n).padStart(8, '0'),
        display_name: row.display_name || row.username,
        tier: row.premium_tier,
        granted_at: row.premium_granted_at,
      };
    });

    res.json({ users });
  } catch (err) {
    console.error('premium-users error:', err.message);
    res.json({ users: [] });
  }
});

// ============================================================
// GET /api/auth/telegram/premium/:userId
// Get user premium info
// ============================================================
router.get('/premium/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await query(
      'SELECT premium_tier, premium_granted_at, premium_expires_at FROM users WHERE id = $1 LIMIT 1',
      [userId]
    ).catch(() => null);

    if (!result || result.rows.length === 0) {
      return res.json({ premium: false, tier: 'Free' });
    }

    const row = result.rows[0];
    const isPremium = row.premium_tier !== 'Free';
    const isExpired = isPremium && row.premium_expires_at && new Date(row.premium_expires_at) <= new Date();

    res.json({
      premium: isPremium && !isExpired,
      tier: isExpired ? 'Free' : (row.premium_tier || 'Free'),
      grantedAt: row.premium_granted_at,
      expiresAt: row.premium_expires_at,
      expired: !!isExpired,
    });
  } catch (err) {
    console.error('premium info error:', err.message);
    res.json({ premium: false, tier: 'Free' });
  }
});

// ============================================================
// POST /api/auth/telegram/payment/request
// User submits a payment request
// ============================================================
router.post('/payment/request', async (req, res) => {
  try {
    const { userId, tier, period, cardType, cardNumber, phone, country } = req.body;
    if (!userId || !tier || !cardType || !cardNumber) {
      return res.json({ success: false, error: 'Missing required fields' });
    }

    if (!['Basic', 'Premium', 'Premium Ultra'].includes(tier)) {
      return res.json({ success: false, error: 'Invalid tier' });
    }

    // Check if user already has active premium (hasn't expired)
    const userPremium = await query(
      `SELECT premium_tier, premium_expires_at FROM users WHERE id = $1 LIMIT 1`,
      [userId]
    ).catch(() => null);

    if (userPremium && userPremium.rows.length > 0) {
      const u = userPremium.rows[0];
      if (u.premium_tier !== 'Free' && u.premium_expires_at && new Date(u.premium_expires_at) > new Date()) {
        return res.json({ success: false, error: 'You already have an active premium plan. Please wait until it expires before purchasing a new one.' });
      }
      // If premium_tier is set but expired, allow purchase and reset
    }

    // Insert payment request
    const result = await query(
      `INSERT INTO payment_requests (user_id, tier, period, card_type, card_number, phone, country, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
       RETURNING id, created_at`,
      [userId, tier, period || 'monthly', cardType, cardNumber, phone || null, country || null]
    );

    // Get user info for admin notification
    const userInfo = await query(
      `SELECT u.username, u.display_name, u.telegram_username, u.telegram_chat_id,
              u.telegram_id, u.email
       FROM users u WHERE u.id = $1 LIMIT 1`,
      [userId]
    );

    // Notify admin via bot webhook
    if (userInfo.rows.length > 0) {
      const u = userInfo.rows[0];
      const userChatId = u.telegram_chat_id;

      // Compute short ID
      const h = userId.replace(/-/g, '');
      let n = 0;
      for (let i = 0; i < h.length; i++) {
        n = (n * 31 + parseInt(h[i], 16)) % 100000000;
      }
      const shortId = String(n).padStart(8, '0');

      const phoneDisplay = phone ? `📞 *Phone:* \`+${phone}\`` : '';
      const countryDisplay = country ? `🌍 *Country:* ${country}` : '';

      // Compute price
      const PRICES = {
        'Basic': { monthly: '30,000 UZS', yearly: '18,000 UZS/mo', yearlyTotal: '216,000 UZS/year' },
        'Premium': { monthly: '62,000 UZS', yearly: '36,000 UZS/mo', yearlyTotal: '432,000 UZS/year' },
        'Premium Ultra': { monthly: '104,000 UZS', yearly: '63,000 UZS/mo', yearlyTotal: '756,000 UZS/year' },
      };
      const tierPrices = PRICES[tier];
      const priceDisplay = period === 'yearly'
        ? `${tierPrices.yearlyTotal} (${tierPrices.yearly})`
        : tierPrices.monthly;

      // Log payment for visibility
      console.log('');
      console.log('═══════════════════════════════════════════');
      console.log('🆕 NEW PAYMENT REQUEST');
      console.log(`   User: ${u.display_name || u.username}`);
      console.log(`   Web ID: ${shortId}`);
      console.log(`   TG: @${u.telegram_username || 'N/A'}`);
      console.log(`   Plan: ${tier} (${period || 'monthly'})`);
      console.log(`   Price: ${priceDisplay}`);
      console.log(`   Card: ${cardType} - ${cardNumber}`);
      console.log(`   Phone: ${phone || 'N/A'}`);
      console.log(`   Country: ${country || 'N/A'}`);
      console.log('═══════════════════════════════════════════');
      console.log('');

      // Try to notify admin via bot
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      if (botToken) {
        let adminChatId = null;
        const adminRecord = await query(
          'SELECT chat_id FROM telegram_bot_users WHERE telegram_id = $1 LIMIT 1',
          [5684720948]
        ).catch(() => null);
        if (adminRecord && adminRecord.rows.length > 0) {
          adminChatId = adminRecord.rows[0].chat_id;
        }

        const targetChatId = adminChatId || 5684720948;
        const payload = JSON.stringify({
          chat_id: targetChatId,
          text: `🆕 *New Payment Request*\n\n👤 *User:* ${u.display_name || u.username}\n🆔 *Web ID:* \`${shortId}\`\n🤖 *TG Username:* @${u.telegram_username || 'N/A'}\n📱 *TG ID:* \`${u.telegram_id || 'N/A'}\`\n👑 *Plan:* ${tier} (${period || 'monthly'})\n💰 *Price:* ${priceDisplay}\n💳 *Paid via:* ${cardType}\n🔢 *Card No:* \`${cardNumber}\`\n${phoneDisplay}\n${countryDisplay}\n🕐 *Time:* ${new Date(result.rows[0].created_at).toLocaleString()}`,
          parse_mode: 'Markdown',
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [[
              { text: '✅ Approve', callback_data: `payment_approve_${result.rows[0].id}` },
              { text: '❌ Reject', callback_data: `payment_reject_${result.rows[0].id}` }
            ]]
          }
        });
        try {
          const tgResult = await new Promise((resolve, reject) => {
            const req = https.request({
              hostname: 'api.telegram.org',
              path: `/bot${botToken}/sendMessage`,
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) },
            }, (res) => {
              let body = '';
              res.on('data', c => body += c);
              res.on('end', () => {
                try { resolve(JSON.parse(body)); } catch(e) { resolve(null); }
              });
            });
            req.on('error', reject);
            req.write(payload);
            req.end();
          });
          if (tgResult && tgResult.ok) {
            console.log('✅ Admin notified via Telegram');
          } else {
            console.error('❌ Admin notification failed:', tgResult?.description || 'Unknown error');
            console.log('ℹ️  Admin should message the bot at @' + (process.env.TELEGRAM_BOT_USERNAME || 'bot') + ' first');
          }
        } catch (e) {
          console.error('❌ Admin notification error:', e.message);
        }
      } else {
        console.log('ℹ️  TELEGRAM_BOT_TOKEN not set — admin will not be notified via Telegram');
        console.log('ℹ️  Set TELEGRAM_BOT_TOKEN in .env to enable notifications');
      }
    }

    res.json({ success: true, paymentId: result.rows[0].id });
  } catch (err) {
    console.error('payment request error:', err.message);
    res.json({ success: false, error: 'Failed to submit payment request' });
  }
});

// ============================================================
// POST /api/auth/telegram/payment/approve
// Admin approves a payment request
// ============================================================
router.post('/payment/approve', async (req, res) => {
  try {
    const { paymentId } = req.body;
    if (!paymentId) return res.json({ success: false, error: 'Missing payment ID' });

    const payment = await query(
      'SELECT user_id, tier, period FROM payment_requests WHERE id = $1 AND status = $2 LIMIT 1',
      [paymentId, 'pending']
    );

    if (payment.rows.length === 0) {
      return res.json({ success: false, error: 'Payment request not found or already processed' });
    }

    const { user_id, tier, period } = payment.rows[0];

    // Calculate expiry date based on period
    const expiresAt = period === 'yearly'
      ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Grant premium
    await query(
      `UPDATE users SET premium_tier = $1, premium_granted_at = NOW(), premium_granted_by = $2,
       premium_expires_at = $3
       WHERE id = $4`,
      [tier, null, expiresAt, user_id]
    );

    await query(
      `INSERT INTO premium_grants (user_id, tier, notes, expires_at) VALUES ($1, $2, $3, $4)`,
      [user_id, tier, 'Payment approved', expiresAt]
    );

    await query(
      `UPDATE payment_requests SET status = 'approved' WHERE id = $1`,
      [paymentId]
    );

    // Notify user
    const userInfo = await query(
      'SELECT telegram_chat_id, display_name, username FROM users WHERE id = $1 LIMIT 1',
      [user_id]
    );

    if (userInfo.rows.length > 0 && userInfo.rows[0].telegram_chat_id) {
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      if (botToken) {
        const https = require('https');
        const payload = JSON.stringify({
          chat_id: userInfo.rows[0].telegram_chat_id,
          text: `🎉 *Payment Approved!* 🎉\n\nYour *${tier}* premium subscription is now active!\n\nEnjoy all the premium features. Thank you for your support! 🙏\n\n[Open Piyala](https://vocabmasterai.site)`,
          parse_mode: 'Markdown',
          disable_web_page_preview: true,
        });
        const opts = {
          hostname: 'api.telegram.org',
          path: `/bot${botToken}/sendMessage`,
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) },
        };
        const req = https.request(opts, () => {});
        req.on('error', () => {});
        req.write(payload);
        req.end();
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error('payment approve error:', err.message);
    res.json({ success: false, error: 'Failed to approve payment' });
  }
});

// ============================================================
// POST /api/auth/telegram/payment/reject
// Admin rejects a payment request
// ============================================================
router.post('/payment/reject', async (req, res) => {
  try {
    const { paymentId, reason } = req.body;
    if (!paymentId) return res.json({ success: false, error: 'Missing payment ID' });

    await query(
      `UPDATE payment_requests SET status = 'rejected', admin_note = $1 WHERE id = $2`,
      [reason || 'Payment rejected', paymentId]
    );

    // Notify user
    const payment = await query(
      'SELECT user_id, tier FROM payment_requests WHERE id = $1 LIMIT 1',
      [paymentId]
    );

    if (payment.rows.length > 0) {
      const userInfo = await query(
        'SELECT telegram_chat_id, display_name, username FROM users WHERE id = $1 LIMIT 1',
        [payment.rows[0].user_id]
      );

      if (userInfo.rows.length > 0 && userInfo.rows[0].telegram_chat_id) {
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        if (botToken) {
          const rejectMsg = reason
            ? `Reason: ${reason}`
            : 'Please make sure you used the correct card details and try again.';
          const https = require('https');
          const payload = JSON.stringify({
            chat_id: userInfo.rows[0].telegram_chat_id,
            text: `❌ *Payment Rejected*\n\nYour payment for *${payment.rows[0].tier}* could not be verified.\n\n${rejectMsg}\n\nIf you believe this is a mistake, please contact support.`,
            parse_mode: 'Markdown',
          });
          const opts = {
            hostname: 'api.telegram.org',
            path: `/bot${botToken}/sendMessage`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) },
          };
          const req = https.request(opts, () => {});
          req.on('error', () => {});
          req.write(payload);
          req.end();
        }
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error('payment reject error:', err.message);
    res.json({ success: false, error: 'Failed to reject payment' });
  }
});

// ============================================================
// GET /api/auth/telegram/payment/history
// Returns payment history for a user
// ============================================================
router.get('/payment/history', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.json({ requests: [] });

    const result = await query(
      `SELECT id, tier, period, card_type, card_number, status, admin_note,
              phone, country, created_at, updated_at
       FROM payment_requests
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [userId]
    ).catch(() => ({ rows: [] }));

    res.json({ requests: result.rows });
  } catch (err) {
    console.error('payment history error:', err.message);
    res.json({ requests: [] });
  }
});

// ============================================================
// GET /api/auth/telegram/admin/pending-payments
// Returns all pending payment requests (admin only)
// ============================================================
router.get('/admin/pending-payments', async (req, res) => {
  try {
    const result = await query(
      `SELECT pr.id, pr.user_id, pr.tier, pr.period, pr.card_type, pr.card_number,
              pr.phone, pr.country, pr.status, pr.created_at,
              u.display_name, u.username, u.telegram_username, u.telegram_chat_id
       FROM payment_requests pr
       JOIN users u ON u.id = pr.user_id
       WHERE pr.status = 'pending'
       ORDER BY pr.created_at DESC
       LIMIT 50`
    ).catch(() => ({ rows: [] }));

    const requests = result.rows.map(row => {
      const h = row.user_id.replace(/-/g, '');
      let n = 0;
      for (let i = 0; i < h.length; i++) {
        n = (n * 31 + parseInt(h[i], 16)) % 100000000;
      }
      return { ...row, short_id: String(n).padStart(8, '0') };
    });

    res.json({ requests });
  } catch (err) {
    console.error('pending-payments error:', err.message);
    res.json({ requests: [] });
  }
});

// ============================================================
// POST /api/auth/telegram/admin/verify-premium
// Check all premium users for inconsistencies and fix them
// ============================================================
router.post('/admin/verify-premium', async (req, res) => {
  try {
    const result = await query(
      `SELECT id, username, display_name, premium_tier, premium_granted_at,
              premium_expires_at, premium_granted_by, telegram_chat_id
       FROM users WHERE premium_tier != 'Free'
       ORDER BY premium_granted_at DESC`
    ).catch(() => ({ rows: [] }));

    const fixes = [];
    const notified = [];

    for (const user of result.rows) {
      const userId = user.id;
      const tier = user.premium_tier;
      const isExpired = user.premium_expires_at && new Date(user.premium_expires_at) <= new Date();
      let fixed = false;

      // Check 1: expired premium → downgrade to Free
      if (isExpired) {
        await query(
          `UPDATE users SET premium_tier = 'Free', premium_granted_at = NULL,
           premium_granted_by = NULL, premium_expires_at = NULL
           WHERE id = $1`,
          [userId]
        );
        fixes.push({
          userId,
          displayName: user.display_name || user.username,
          tier,
          issue: 'expired',
          fix: 'downgraded to Free',
        });
        fixed = true;
      }

      // Check 2: premium_tier set but no premium_grants record
      if (!fixed) {
        const grantCheck = await query(
          'SELECT id FROM premium_grants WHERE user_id = $1 LIMIT 1',
          [userId]
        ).catch(() => ({ rows: [] }));

        if (grantCheck.rows.length === 0) {
          await query(
            `INSERT INTO premium_grants (user_id, tier, granted_by, notes)
             VALUES ($1, $2, $3, 'Auto-fixed by verify-premium')`,
            [userId, tier, user.premium_granted_by]
          ).catch(() => {});
          fixes.push({
            userId,
            displayName: user.display_name || user.username,
            tier,
            issue: 'missing grant record',
            fix: 'premium_grants entry created',
          });
        }
      }

      // Check 3: premium_tier set but premium_granted_at is null
      if (!fixed && !user.premium_granted_at) {
        await query(
          `UPDATE users SET premium_granted_at = NOW() WHERE id = $1`,
          [userId]
        );
        fixes.push({
          userId,
          displayName: user.display_name || user.username,
          tier,
          issue: 'missing granted_at',
          fix: 'premium_granted_at set to NOW()',
        });
      }

      // Notify the user if any fix was applied and they have a Telegram chat
      if (fixed && user.telegram_chat_id) {
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        if (botToken) {
          const https = require('https');
          const payload = JSON.stringify({
            chat_id: user.telegram_chat_id,
            text: `🔧 *Premium Status Fixed*\n\nYour premium account had an issue which has been automatically resolved.\n\nPlease refresh the website or re-login to activate your premium features.\n\n[Open Piyala](https://vocabmasterai.site)`,
            parse_mode: 'Markdown',
            disable_web_page_preview: true,
          });
          const opts = {
            hostname: 'api.telegram.org',
            path: `/bot${botToken}/sendMessage`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) },
          };
          const req = https.request(opts, () => {});
          req.on('error', () => {});
          req.write(payload);
          req.end();
          notified.push(userId);
        }
      }
    }

    // Check 4: reverse — premium_grants records where user's tier is 'Free'
    const orphanGrants = await query(
      `SELECT pg.id, pg.user_id, pg.tier, u.display_name, u.username
       FROM premium_grants pg
       JOIN users u ON u.id = pg.user_id
       WHERE u.premium_tier = 'Free'`
    ).catch(() => ({ rows: [] }));

    for (const grant of orphanGrants.rows) {
      await query(
        `UPDATE users SET premium_tier = $1, premium_granted_at = NOW()
         WHERE id = $2 AND premium_tier = 'Free'`,
        [grant.tier, grant.user_id]
      );
      fixes.push({
        userId: grant.user_id,
        displayName: grant.display_name || grant.username,
        tier: grant.tier,
        issue: 'orphan grant (user was Free)',
        fix: 'premium_tier restored from premium_grants',
      });

      // Notify restored user
      const userChat = await query(
        'SELECT telegram_chat_id FROM users WHERE id = $1 LIMIT 1',
        [grant.user_id]
      ).catch(() => ({ rows: [] }));
      if (userChat.rows.length > 0 && userChat.rows[0].telegram_chat_id) {
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        if (botToken) {
          const https = require('https');
          const payload = JSON.stringify({
            chat_id: userChat.rows[0].telegram_chat_id,
            text: `🔄 *Premium Restored*\n\nYour *${grant.tier}* premium was not active on your account but has been restored.\n\nPlease refresh the website or re-login to use premium features.\n\n[Open Piyala](https://vocabmasterai.site)`,
            parse_mode: 'Markdown',
            disable_web_page_preview: true,
          });
          const opts = {
            hostname: 'api.telegram.org',
            path: `/bot${botToken}/sendMessage`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) },
          };
          const req = https.request(opts, () => {});
          req.on('error', () => {});
          req.write(payload);
          req.end();
          notified.push(grant.user_id);
        }
      }
    }

    res.json({
      success: true,
      totalPremiumUsers: result.rows.length,
      fixesApplied: fixes.length,
      usersNotified: notified.length,
      fixes,
    });
  } catch (err) {
    console.error('verify-premium error:', err.message);
    res.json({ success: false, error: err.message });
  }
});

// ============================================================
// POST /api/auth/telegram/admin/status
// Full system status — website, DB, bot, counts
// ============================================================
router.post('/admin/status', async (req, res) => {
  try {
    const startTime = Date.now();

    // DB health
    let dbOk = false;
    try { await pool.query('SELECT 1'); dbOk = true; } catch (e) {}

    // Counts
    const users = await query('SELECT COUNT(*) as c FROM users').catch(() => ({ rows: [{ c: 0 }] }));
    const premiumUsers = await query("SELECT COUNT(*) as c FROM users WHERE premium_tier != 'Free'").catch(() => ({ rows: [{ c: 0 }] }));
    const botUsers = await query('SELECT COUNT(*) as c FROM telegram_bot_users').catch(() => ({ rows: [{ c: 0 }] }));
    const pendingPayments = await query("SELECT COUNT(*) as c FROM payment_requests WHERE status = 'pending'").catch(() => ({ rows: [{ c: 0 }] }));
    const approvedPayments = await query("SELECT COUNT(*) as c FROM payment_requests WHERE status = 'approved'").catch(() => ({ rows: [{ c: 0 }] }));
    const premiumGrants = await query('SELECT COUNT(*) as c FROM premium_grants').catch(() => ({ rows: [{ c: 0 }] }));
    const activeSessions = await query('SELECT COUNT(*) as c FROM device_sessions').catch(() => ({ rows: [{ c: 0 }] }));

    // Latest user registration
    const latestUser = await query('SELECT username, created_at FROM users ORDER BY created_at DESC LIMIT 1').catch(() => ({ rows: [] }));

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      responseTimeMs: Date.now() - startTime,
      database: {
        connected: dbOk,
        poolHealthy: dbOk,
      },
      counts: {
        users: parseInt(users.rows[0].c) || 0,
        premiumUsers: parseInt(premiumUsers.rows[0].c) || 0,
        botUsers: parseInt(botUsers.rows[0].c) || 0,
        pendingPayments: parseInt(pendingPayments.rows[0].c) || 0,
        approvedPayments: parseInt(approvedPayments.rows[0].c) || 0,
        premiumGrants: parseInt(premiumGrants.rows[0].c) || 0,
        activeSessions: parseInt(activeSessions.rows[0].c) || 0,
      },
      latestUser: latestUser.rows[0] || null,
    });
  } catch (err) {
    console.error('admin status error:', err.message);
    res.json({ success: false, error: err.message });
  }
});

// ============================================================
// POST /api/auth/telegram/admin/delete-data
// Delete various types of data from the database
// ============================================================
router.post('/admin/delete-data', async (req, res) => {
  try {
    const { target, userId, paymentId, id } = req.body;
    const entityId = userId || paymentId || id;
    if (!target) return res.json({ success: false, error: 'Missing target' });

    let deleted = 0;
    let label = '';
    let details = {};
    let notifChatId = null;

    switch (target) {
      case 'user': {
        if (!entityId) return res.json({ success: false, error: 'Missing user ID' });
        const uuid = await resolveUserId(entityId);
        if (!uuid) return res.json({ success: false, error: 'User not found. Use a valid UUID or short ID from the bot list.' });
        const user = await query('SELECT username, display_name FROM users WHERE id = $1 LIMIT 1', [uuid]).catch(() => ({ rows: [] }));
        label = user.rows[0]?.display_name || user.rows[0]?.username || uuid;
        const r1 = await query('DELETE FROM user_progress WHERE user_id = $1', [uuid]);
        const r2 = await query('DELETE FROM refresh_tokens WHERE user_id = $1', [uuid]);
        const r3 = await query('DELETE FROM user_stats WHERE user_id = $1', [uuid]);
        const r4 = await query('DELETE FROM premium_grants WHERE user_id = $1', [uuid]);
        const r5 = await query('DELETE FROM payment_requests WHERE user_id = $1', [uuid]);
        await query('DELETE FROM notification_reads WHERE user_id = $1', [uuid]);
        await query('DELETE FROM speaking_requests WHERE from_user_id = $1 OR to_user_id = $1', [uuid]);
        await query('DELETE FROM password_reset_tokens WHERE user_id = $1', [uuid]);
        await query('DELETE FROM user_profiles WHERE user_id = $1', [uuid]);
        await query('DELETE FROM token_blacklist WHERE user_id = $1', [uuid]);
        const r6 = await query('DELETE FROM telegram_bot_users WHERE user_id = $1', [uuid]);
        const r7 = await query('DELETE FROM device_sessions WHERE user_id = $1', [uuid]);
        const delUser = await query('DELETE FROM users WHERE id = $1 RETURNING id', [uuid]);
        deleted = delUser.rows.length;
        details = {
          premiumGrantsDeleted: (r4?.rowCount || 0),
          paymentRequestsDeleted: (r5?.rowCount || 0),
          sessionsDeleted: (r7?.rowCount || 0),
          botDataDeleted: (r6?.rowCount || 0),
        };
        break;
      }

      case 'payment_request':
      case 'payment': {
        if (!entityId) return res.json({ success: false, error: 'Missing payment ID' });
        label = entityId;
        const delPay = await query('DELETE FROM payment_requests WHERE id = $1 RETURNING id', [entityId]);
        deleted = delPay.rows.length;
        break;
      }

      case 'premium_from_user':
      case 'premium': {
        if (!entityId) return res.json({ success: false, error: 'Missing user ID' });
        const uuid = await resolveUserId(entityId);
        if (!uuid) return res.json({ success: false, error: 'User not found. Use a valid UUID or short ID from the bot list.' });
        const pUser = await query('SELECT username, display_name, telegram_chat_id FROM users WHERE id = $1 LIMIT 1', [uuid]).catch(() => ({ rows: [] }));
        label = pUser.rows[0]?.display_name || pUser.rows[0]?.username || uuid;
        await query(`UPDATE users SET premium_tier = 'Free', premium_granted_at = NULL, premium_granted_by = NULL, premium_expires_at = NULL WHERE id = $1`, [uuid]);
        await query('DELETE FROM premium_grants WHERE user_id = $1', [uuid]);
        notifChatId = pUser.rows[0]?.telegram_chat_id;
        if (notifChatId) {
          try {
            const token = getBotToken();
            if (token) {
              const https = require('https');
              const msgData = JSON.stringify({
                chat_id: notifChatId,
                text: '⚠️ *Notice:* Your premium access has been removed by an administrator.',
                parse_mode: 'Markdown',
              });
              const opts = {
                hostname: 'api.telegram.org',
                path: `/bot${token}/sendMessage`,
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(msgData) },
              };
              const req = https.request(opts);
              req.write(msgData);
              req.end();
            }
          } catch (_) {}
        }
        deleted = 1;
        break;
      }

      case 'all_pending_payments': {
        label = 'all pending payment requests';
        const delPending = await query("DELETE FROM payment_requests WHERE status = 'pending' RETURNING id");
        deleted = delPending.rows.length;
        break;
      }

      case 'all_sessions': {
        label = 'all device sessions';
        const delSessions = await query('DELETE FROM device_sessions RETURNING id');
        deleted = delSessions.rows.length;
        break;
      }

      case 'all_data': {
        label = 'all data (complete wipe)';
        await query('DELETE FROM device_sessions');
        await query('DELETE FROM user_progress');
        await query('DELETE FROM refresh_tokens');
        await query('DELETE FROM user_stats');
        await query('DELETE FROM premium_grants');
        await query('DELETE FROM payment_requests');
        await query('DELETE FROM notification_reads');
        await query('DELETE FROM speaking_requests');
        await query('DELETE FROM password_reset_tokens');
        await query('DELETE FROM user_profiles');
        await query('DELETE FROM token_blacklist');
        await query('DELETE FROM word_ai_cache');
        await query('DELETE FROM telegram_bot_users');
        await query('DELETE FROM users');
        deleted = -1;
        break;
      }

      default:
        return res.json({ success: false, error: 'Unknown target: ' + target });
    }

    res.json({ success: true, deleted, label, details, userNotified: !!notifChatId });
  } catch (err) {
    console.error('admin delete-data error:', err.message);
    res.json({ success: false, error: err.message });
  }
});

module.exports = router;
