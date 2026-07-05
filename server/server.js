// SECURE: VocabMaster AI — Maximum Security Backend
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');

// Load auth routes ALWAYS (Google OAuth callback works without DB)
let authRoutes = null;
try { authRoutes = require('./routes/auth'); } catch (e) { console.log('Auth routes unavailable'); }

// Only connect DB if DATABASE_URL is set
let pool = null;
let dbRoutes = {};
if (process.env.DATABASE_URL) {
  try {
    pool = require('./config/db').pool;
    dbRoutes = {
      progress: require('./routes/progress'),
      profile: require('./routes/profile'),
      anonymous: require('./routes/anonymous'),
      leaderboard: require('./routes/leaderboard'),
    };
    console.log('Database module loaded');
  } catch (e) {
    console.log('Database unavailable, running without DB');
  }
}

// Dynamic DB middleware: returns 503 if pool is unhealthy instead of crashing
function requireDB(req, res, next) {
  if (!pool) {
    return res.status(503).json({ error: 'Database not configured' });
  }
  try {
    const db = require('./config/db');
    if (!db.isHealthy()) {
      return res.status(503).json({ error: 'Database temporarily unavailable' });
    }
  } catch (e) {
    return res.status(503).json({ error: 'Database not available' });
  }
  next();
}
const {
  nonceMiddleware,
  securityHeaders,
  corsOptions,
  globalLimiter,
  csrfProtection,
} = require('./middleware/security');
const aiRoutes = require('./routes/ai');
const dictionaryRoutes = require('./routes/dictionary');
const telegramRoutes = require('./routes/telegram');

const app = express();
const PORT = process.env.PORT || 3001;

// ===== SECURITY MIDDLEWARE STACK =====
// Order matters for security

// 1. Nonce generator (before helmet so CSP can use it)
app.use(nonceMiddleware);

// 2. Security headers (helmet with strict CSP)
app.use(securityHeaders);

// 3. CSP violation report endpoint (no CSRF needed for reporting)
app.post('/api/csp-report', express.json({ limit: '10kb' }), (req, res) => {
  const report = req.body?.['csp-report'];
  if (report) {
    console.warn('CSP Violation:', report['blocked-uri'], report['violated-directive'], report['document-uri']);
  }
  res.status(204).end();
});

// 4. CORS (strict)
const cors = require('cors');
app.use(cors(corsOptions));

// 5. Cookie parser (for httpOnly token cookies)
app.use(cookieParser(process.env.COOKIE_SECRET));

// 6. Body parsing with size limits
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: false, limit: '5mb' }));

// 7. Global rate limiting
app.use(globalLimiter);

// 8. Trust proxy (for rate limiter IP detection)
app.set('trust proxy', 1);

// ===== HEARTBEAT (keep session alive) =====
app.get('/api/auth/heartbeat', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ===== HEALTH CHECK =====
app.get('/api/health', async (req, res) => {
  if (!pool) {
    return res.json({ status: 'ok (no db)', timestamp: new Date().toISOString() });
  }
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(503).json({ status: 'error', message: 'Database unavailable' });
  }
});

// Make pool available to routes via app.locals
app.locals.pool = pool;

// ===== ROUTES =====
app.use('/api/auth/telegram', telegramRoutes); // ✅ Telegram auth (before /api/auth for correct routing)
app.use('/api/auth', authRoutes || ((req, res) => res.status(503).json({ error: 'Auth not available' })));
app.use('/api/progress', requireDB, dbRoutes.progress || ((req, res) => res.status(503).json({ error: 'Database not available' })));
app.use('/api/profile', requireDB, dbRoutes.profile || ((req, res) => res.status(503).json({ error: 'Database not available' })));
app.use('/api/anonymous', requireDB, dbRoutes.anonymous || ((req, res) => res.status(503).json({ error: 'Database not available' })));
app.use('/api/leaderboard', requireDB, dbRoutes.leaderboard || ((req, res) => res.status(503).json({ error: 'Database not available' })));
app.use('/api/ai', aiRoutes); // ✅ AI route — no DB needed
app.use('/api/dictionary', dictionaryRoutes); // ✅ Dictionary proxy — no DB needed
app.use('/api/speaking', require('./routes/speaking')); // ✅ Speaking practice
app.use('/api/notifications', requireDB, require('./routes/notifications')); // ✅ Notifications

// ===== Serve frontend static files (all environments) =====
const path = require('path');
const fs = require('fs');
const frontendDir = path.join(__dirname, '..');
const maxAge = process.env.NODE_ENV === 'production' ? '1h' : 0;

app.use(express.static(frontendDir, {
  dotfiles: 'ignore',
  etag: true,
  maxAge,
  index: false,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
    if (filePath.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
    }
    if (filePath.endsWith('.webmanifest')) {
      res.setHeader('Content-Type', 'application/manifest+json');
    }
  },
}));

// Security contact endpoint
app.get('/.well-known/security.txt', (req, res) => {
  const path = require('path');
  const fs = require('fs');
  const securityTxtPath = path.join(__dirname, '..', 'security.txt');
  if (fs.existsSync(securityTxtPath)) {
    res.type('text/plain').send(fs.readFileSync(securityTxtPath, 'utf-8'));
  } else {
    res.status(404).end();
  }
});

// Block access to server directory
app.use(/^\/server/, (req, res) => res.status(403).json({ error: 'Forbidden' }));

// SPA fallback — serve index.html for all non-API, non-static routes
// Supports nested URL hierarchy: /learn/explore, /company/about, etc.
const indexPath = path.join(frontendDir, '1779981256843_vocabmaster-ai (1).html');
const staticExtensions = ['.js', '.css', '.html', '.json', '.webmanifest', '.png', '.jpg', '.gif', '.svg', '.ico', '.webp', '.woff', '.woff2', '.ttf', '.eot'];

// SECURE: Read HTML once and cache (with nonce injection)
let indexHtml = null;
function getIndexHtml() {
  if (!indexHtml) {
    try {
      indexHtml = fs.readFileSync(indexPath, 'utf-8');
    } catch (e) {
      console.error('Failed to read index.html:', e.message);
      indexHtml = '<html><body><h1>Error loading application</h1></body></html>';
    }
  }
  return indexHtml;
}

app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/')) {
    const ext = path.extname(req.path).toLowerCase();
    if (ext && staticExtensions.includes(ext)) {
      return res.sendFile(path.join(frontendDir, req.path), err => {
        if (err) {
          const html = getIndexHtml().replace(/<script /g, `<script nonce="${res.locals.nonce}" `);
          res.send(html);
        }
      });
    }
    // Inject nonce into script tags for CSP compliance
    const html = getIndexHtml().replace(/<script /g, `<script nonce="${res.locals.nonce}" `);
    res.send(html);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

// ===== 404 HANDLER =====
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ===== GLOBAL ERROR HANDLER =====
app.use((err, req, res, next) => {
  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production') {
    console.error('Server error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// ===== WEBSOCKET SIGNALING (Speaking WebRTC) =====
const { WebSocketServer } = require('ws');
const jwt = require('jsonwebtoken');

function parseCookies(cookieHeader) {
  if (!cookieHeader) return {};
  const cookies = {};
  cookieHeader.split(';').forEach(function(c) {
    const parts = c.trim().split('=');
    if (parts.length >= 2) {
      cookies[parts[0].trim()] = parts.slice(1).join('=').trim();
    }
  });
  return cookies;
}

const wsRooms = {};

function createWsServer(server) {
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', function(ws, req) {
    const cookies = parseCookies(req.headers.cookie);
    const token = cookies.access_token;
    if (!token) { ws.close(4001, 'Auth required'); return; }

    let userData;
    try {
      userData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {
        algorithms: ['HS256'], issuer: 'vocabmaster-ai'
      });
    } catch (e) { ws.close(4001, 'Invalid token'); return; }

    ws.userId = userData.sub;
    ws.username = userData.username || 'anon';
    ws.roomId = null;

    ws.on('message', function(buf) {
      var msg;
      try { msg = JSON.parse(buf.toString()); } catch(e) { return; }

      switch (msg.type) {
        case 'join':
          ws.roomId = 'session-' + msg.sessionId;
          if (!wsRooms[ws.roomId]) wsRooms[ws.roomId] = [];
          var room = wsRooms[ws.roomId];
          var isFirst = room.length === 0;
          room.push(ws);
          ws.send(JSON.stringify({ type: 'room-joined', isFirst: isFirst, userCount: room.length }));
          if (!isFirst) {
            room.forEach(function(client) {
              if (client !== ws) {
                client.send(JSON.stringify({ type: 'peer-joined', userId: ws.userId, username: ws.username }));
              }
            });
          }
          break;

        case 'leave':
          if (ws.roomId && wsRooms[ws.roomId]) {
            wsRooms[ws.roomId] = wsRooms[ws.roomId].filter(function(c) { return c !== ws; });
            if (wsRooms[ws.roomId].length === 0) delete wsRooms[ws.roomId];
          }
          ws.roomId = null;
          break;

        case 'offer':
        case 'answer':
        case 'ice-candidate':
          if (ws.roomId && wsRooms[ws.roomId]) {
            wsRooms[ws.roomId].forEach(function(client) {
              if (client !== ws) client.send(JSON.stringify(msg));
            });
          }
          break;
      }
    });

    ws.on('close', function() {
      if (ws.roomId && wsRooms[ws.roomId]) {
        wsRooms[ws.roomId] = wsRooms[ws.roomId].filter(function(c) { return c !== ws; });
        if (wsRooms[ws.roomId].length === 0) delete wsRooms[ws.roomId];
      }
    });
  });

  return wss;
}

// ===== GRACEFUL SHUTDOWN =====
process.on('SIGTERM', async () => {
  console.log('SIGTERM received.');
  if (pool) { await pool.end(); }
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received.');
  if (pool) { await pool.end(); }
  process.exit(0);
});

// ===== START =====
async function start() {
  try {
    // Test database connection if available (with retries for Neon cold starts)
    if (pool) {
      let dbConnected = false;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          await pool.query('SELECT 1');
          dbConnected = true;
          console.log('Database connected successfully');
          break;
        } catch (dbErr) {
          if (attempt < 3) {
            console.log(`DB connection attempt ${attempt} failed, retrying in 5s...`);
            await new Promise(r => setTimeout(r, 5000));
          } else {
            console.log('Database connection failed after 3 attempts — running without DB:', dbErr.message);
            pool = null;
            require('./config/db').setHealthy(false);
          }
        }
      }
    }

    if (pool) {
      // Run schema migrations if tables don't exist
      try {
        const fs = require('fs');
        const path = require('path');
        const schemaPath = path.join(__dirname, 'schema.sql');
        if (fs.existsSync(schemaPath)) {
          const schema = fs.readFileSync(schemaPath, 'utf-8');
          const tableCheck = await pool.query(
            "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users')"
          );
          if (!tableCheck.rows[0].exists) {
            console.log('Running schema migration...');
            await pool.query(schema);
            console.log('Schema migration complete');
          } else {
            // Schema exists — always run column migrations
            console.log('Running column migrations...');
            await pool.query(`ALTER TABLE device_sessions ADD COLUMN IF NOT EXISTS stats JSONB DEFAULT '{}'::jsonb`);
            await pool.query(`ALTER TABLE device_sessions ADD COLUMN IF NOT EXISTS favorites JSONB DEFAULT '[]'::jsonb`);
            await pool.query(`ALTER TABLE device_sessions ADD COLUMN IF NOT EXISTS recent_words JSONB DEFAULT '[]'::jsonb`);
            await pool.query(`ALTER TABLE device_sessions ADD COLUMN IF NOT EXISTS grammar JSONB DEFAULT '{}'::jsonb`);
            await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ DEFAULT NULL`);
            await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE`);
            await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20) UNIQUE DEFAULT NULL`);
            await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS telegram_id VARCHAR(32) UNIQUE DEFAULT NULL`);
            await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(128) DEFAULT NULL`);
            await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name VARCHAR(128) DEFAULT NULL`);
            await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS telegram_username VARCHAR(128) DEFAULT NULL`);
            await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_photo VARCHAR(512) DEFAULT NULL`);
            await pool.query(`ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL`);
            await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS telegram_password_hash VARCHAR(255) DEFAULT NULL`);
            await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS premium_tier VARCHAR(20) DEFAULT 'Free'`);
            await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS premium_expires_at TIMESTAMPTZ DEFAULT NULL`);
            await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS premium_granted_by UUID DEFAULT NULL`);
            await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS premium_granted_at TIMESTAMPTZ DEFAULT NULL`);
            await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS telegram_chat_id BIGINT DEFAULT NULL`);
            await pool.query(`CREATE TABLE IF NOT EXISTS word_ai_cache (word VARCHAR(255) PRIMARY KEY, ai_response TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW())`);
            await pool.query(`CREATE TABLE IF NOT EXISTS premium_grants (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
              tier VARCHAR(20) NOT NULL,
              granted_by UUID NOT NULL REFERENCES users(id),
              granted_at TIMESTAMPTZ DEFAULT NOW(),
              expires_at TIMESTAMPTZ DEFAULT NULL,
              notes TEXT DEFAULT ''
            )`);
            await pool.query(`CREATE INDEX IF NOT EXISTS idx_premium_grants_user ON premium_grants(user_id)`);
            await pool.query(`ALTER TABLE premium_grants ALTER COLUMN granted_by DROP NOT NULL`).catch(() => {});
            await pool.query(`ALTER TABLE premium_grants ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ DEFAULT NULL`);
            await pool.query(`CREATE TABLE IF NOT EXISTS telegram_bot_users (
              id SERIAL PRIMARY KEY,
              telegram_id BIGINT NOT NULL UNIQUE,
              username VARCHAR(128) DEFAULT NULL,
              first_name VARCHAR(128) DEFAULT NULL,
              last_name VARCHAR(128) DEFAULT NULL,
              chat_id BIGINT NOT NULL,
              is_admin BOOLEAN DEFAULT FALSE,
              first_interaction_at TIMESTAMPTZ DEFAULT NOW(),
              last_interaction_at TIMESTAMPTZ DEFAULT NOW()
            )`);
            await pool.query(`CREATE INDEX IF NOT EXISTS idx_tg_bot_users_telegram_id ON telegram_bot_users(telegram_id)`);
            await pool.query(`CREATE TABLE IF NOT EXISTS payment_requests (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
              tier VARCHAR(20) NOT NULL,
              period VARCHAR(10) NOT NULL DEFAULT 'monthly',
              card_type VARCHAR(20) NOT NULL,
              card_number VARCHAR(30) NOT NULL,
              phone VARCHAR(30) DEFAULT NULL,
              country VARCHAR(10) DEFAULT NULL,
              status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
              admin_note TEXT DEFAULT '',
              created_at TIMESTAMPTZ DEFAULT NOW(),
              updated_at TIMESTAMPTZ DEFAULT NOW()
            )`);
            await pool.query(`ALTER TABLE payment_requests ADD COLUMN IF NOT EXISTS phone VARCHAR(30) DEFAULT NULL`);
            await pool.query(`ALTER TABLE payment_requests ADD COLUMN IF NOT EXISTS country VARCHAR(10) DEFAULT NULL`);
            await pool.query(`CREATE INDEX IF NOT EXISTS idx_payment_requests_status ON payment_requests(status)`);
            await pool.query(`CREATE INDEX IF NOT EXISTS idx_payment_requests_user ON payment_requests(user_id)`);
            await pool.query(`CREATE TABLE IF NOT EXISTS speaking_requests (
              id SERIAL PRIMARY KEY,
              from_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
              to_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
              gender_pref VARCHAR(20) DEFAULT 'any',
              level VARCHAR(30) DEFAULT 'beginner',
              status VARCHAR(20) DEFAULT 'pending',
              session_id INT DEFAULT NULL,
              created_at TIMESTAMPTZ DEFAULT NOW()
            )`);
            await pool.query(`CREATE TABLE IF NOT EXISTS speaking_sessions (
              id SERIAL PRIMARY KEY,
              user1_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
              user2_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
              level VARCHAR(30) DEFAULT 'beginner',
              questions JSONB DEFAULT NULL,
              answers JSONB DEFAULT '[]'::jsonb,
              feedback JSONB DEFAULT '{}'::jsonb,
              current_index INT DEFAULT 0,
              who_starts UUID DEFAULT NULL,
              status VARCHAR(20) DEFAULT 'active',
              created_at TIMESTAMPTZ DEFAULT NOW(),
              completed_at TIMESTAMPTZ DEFAULT NULL,
              rating INT DEFAULT NULL
            )`);
            await pool.query(`CREATE TABLE IF NOT EXISTS notifications (
              id SERIAL PRIMARY KEY,
              title VARCHAR(255) NOT NULL DEFAULT 'Admin Announcement',
              message TEXT NOT NULL,
              created_by UUID REFERENCES users(id),
              created_at TIMESTAMPTZ DEFAULT NOW(),
              expires_at TIMESTAMPTZ DEFAULT NULL
            )`);
            await pool.query(`ALTER TABLE notifications ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ DEFAULT NULL`);
            await pool.query(`CREATE INDEX IF NOT EXISTS idx_notifications_expires ON notifications(expires_at)`);
            await pool.query(`CREATE TABLE IF NOT EXISTS notification_reads (
              user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
              notification_id INTEGER NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
              read_at TIMESTAMPTZ DEFAULT NOW(),
              PRIMARY KEY (user_id, notification_id)
            )`);
            console.log('Column migrations complete');
          }
        }
      } catch (migrateErr) {
        console.log('Migration failed — continuing without DB:', migrateErr.message);
        pool = null;
      }
    } else {
      console.log('No database configured — running without DB');
    }

    // Start Telegram bot (polling)
    try {
      let bot;
      try { bot = require('./telegram-bot'); } catch (e) { throw new Error('Module load: ' + e.message); }
      bot.startBot();
      console.log('Telegram bot polling started');
    } catch (e) {
      console.log('Telegram bot not available:', e.message);
    }

    const server = http.createServer(app);
    createWsServer(server);

    server.listen(PORT, () => {
      console.log(`VocabMaster AI backend running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
