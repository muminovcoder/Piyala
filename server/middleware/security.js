// SECURE: Comprehensive security middleware
const helmet = require('helmet');
const cors = require('cors');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

// SECURE: CSP nonce generator middleware
function nonceMiddleware(req, res, next) {
  res.locals.nonce = crypto.randomBytes(16).toString('base64');
  next();
}

// SECURE: Strict Content Security Policy via Helmet
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        'https://unpkg.com',
        'https://telegram.org',
      ],
      scriptSrcAttr: ["'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://unpkg.com', 'https://cdn.jsdelivr.net'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'https://unpkg.com', 'https://cdn.jsdelivr.net'],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: [
        "'self'",
        'ws://localhost:3001',
        'ws://127.0.0.1:3001',
        'wss://vocabmasterai.site',
        'wss://piyala.onrender.com',
        'https://api.dictionaryapi.dev',
        'https://api.datamuse.com',
        'https://unpkg.com',
        'https://oauth.telegram.org',
        'https://telegram.org',
        'https://api.groq.com',
        'https://cdn.jsdelivr.net',
        'https://fonts.googleapis.com',
      ],
      mediaSrc: ["'self'"],
      manifestSrc: ["'self'", 'data:'],
      frameSrc: ["'self'", 'https://www.youtube.com', 'https://www.youtube-nocookie.com', 'https://oauth.telegram.org'],
      formAction: ["'self'"],
      baseUri: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
      reportUri: '/api/csp-report',
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  noSniff: true,
  xssFilter: true,
  hidePoweredBy: true,
  ieNoOpen: true,
});

// SECURE: Strict CORS
const corsOptions = {
  origin: function (origin, callback) {
    const envOrigins = (process.env.CORS_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);
    const allowedOrigins = [
      ...envOrigins,
      'http://localhost:5500',
      'http://127.0.0.1:5500',
      'http://localhost:3000',
      'http://localhost:3001',
      'https://vocabmasterai.site', // ✅ Custom domain
      'https://piyala.onrender.com', // ✅ Render deployment
      'https://www.piyala.onrender.com',
    ];
    // Allow requests with no origin (file://, curl, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 600,
};

// SECURE: Global rate limiter
const globalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX || '500'),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
  keyGenerator: (req) => req.ip || req.connection.remoteAddress,
});

// SECURE: Aggressive auth route rate limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX || '30'),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts, please try again later' },
  keyGenerator: (req) => {
    const identifier = req.body?.email || req.body?.username || req.ip;
    return `${req.ip}-${identifier}`;
  },
  skipSuccessfulRequests: true,
});

// SECURE: AI endpoint rate limiter (expensive API calls)
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many AI requests. Please wait before trying again.' },
});

// SECURE: Anonymous sync rate limiter (prevent DB spam)
const anonLimiter = rateLimit({
  windowMs: 60000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many sync requests.' },
});

// SECURE: CSRF protection check — HARD MODE
function csrfProtection(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();

  const csrfCookie = req.cookies?.csrf_token;

  if (!csrfCookie) {
    return res.status(403).json({ error: 'CSRF token missing. Please refresh the page.' });
  }

  const csrfHeader = req.headers['x-csrf-token'];

  if (!csrfHeader) {
    return res.status(403).json({ error: 'CSRF header missing. Request blocked.' });
  }

  if (csrfCookie !== csrfHeader) {
    return res.status(403).json({ error: 'CSRF token mismatch. Request blocked.' });
  }

  const newCsrfToken = require('crypto').randomBytes(32).toString('hex');
  res.cookie('csrf_token', newCsrfToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 15 * 60 * 1000,
  });
  res.setHeader('X-CSRF-Token', newCsrfToken);

  next();
};

// SECURE: Password strength validation
function validatePasswordStrength(password) {
  const errors = [];
  if (password.length < 8) errors.push('Password must be at least 8 characters');
  if (password.length > 128) errors.push('Password must not exceed 128 characters');
  if (!/[A-Z]/.test(password)) errors.push('Password must contain an uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('Password must contain a lowercase letter');
  if (!/[0-9]/.test(password)) errors.push('Password must contain a number');
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain a special character');
  }
  return errors;
}

// SECURE: Validation chains for auth routes
const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username must be 3-50 alphanumeric characters, hyphens, or underscores'),
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email required'),
  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be 8-128 characters'),
];

const loginValidation = [
  body('email').trim().isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 1 }).withMessage('Password required'),
];

// SECURE: Check validation results
function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const sanitized = errors.array().map(e => ({
      field: e.path,
      message: e.msg,
    }));
    return res.status(422).json({ error: 'Validation failed', details: sanitized });
  }
  next();
}

module.exports = {
  nonceMiddleware,
  securityHeaders,
  corsOptions,
  globalLimiter,
  authLimiter,
  aiLimiter,
  anonLimiter,
  csrfProtection,
  validatePasswordStrength,
  registerValidation,
  loginValidation,
  handleValidation,
};
