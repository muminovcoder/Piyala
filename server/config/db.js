// SECURE: PostgreSQL connection pool — parameterized queries only
const { Pool } = require('pg');

let poolHealthy = true;

// Clean connection URL: remove unsupported params (sslmode, channel_binding, etc.)
let connectionString = process.env.DATABASE_URL;
const sslConfig = { rejectUnauthorized: false };
if (connectionString) {
  try {
    const url = new URL(connectionString);
    // Remove params not supported by the pg npm package
    url.searchParams.delete('sslmode');
    url.searchParams.delete('channel_binding');
    connectionString = url.toString();
  } catch (e) {
    console.warn('Could not parse DATABASE_URL, using as-is:', e.message);
  }
}

const pool = new Pool({
  connectionString,
  ssl: sslConfig,
  max: 10,
  idleTimeoutMillis: 60000,
  connectionTimeoutMillis: 30000,
});

pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err.message);
  poolHealthy = false;
  // Automatically try to recover after 30s (handles Neon cold starts)
  setTimeout(() => {
    pool.connect((connectErr) => {
      if (!connectErr) {
        poolHealthy = true;
        console.log('Database connection recovered');
      }
    });
  }, 30000);
});

// SECURE: Parameterized query helper
async function query(text, params) {
  if (!poolHealthy) {
    throw new Error('Database is not available');
  }
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;
  if (duration > 1000) {
    console.warn(`Slow query (${duration}ms):`, text.substring(0, 100));
  }
  return result;
}

function setHealthy(v) {
  poolHealthy = v;
}

function isHealthy() {
  return poolHealthy;
}

// SECURE: Transaction helper
async function transaction(callback) {
  if (!poolHealthy) {
    throw new Error('Database is not available');
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { pool, query, transaction, setHealthy, isHealthy };
