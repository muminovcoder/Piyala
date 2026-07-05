-- =============================================
-- VOCABMASTER AI — MAXIMUM SECURITY DATABASE SCHEMA
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===== USERS TABLE =====
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL CHECK (char_length(username) >= 3 AND char_length(username) <= 50),
    email VARCHAR(255) UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    password_hash VARCHAR(255) DEFAULT NULL,
    display_name VARCHAR(100) DEFAULT 'Learner',
    avatar_url VARCHAR(500) DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    -- Account lockout
    failed_attempts INT DEFAULT 0,
    locked_until TIMESTAMPTZ DEFAULT NULL,
    -- Phone number for Telegram bot auth
    phone VARCHAR(20) UNIQUE DEFAULT NULL,
    -- OAuth / Telegram auth fields
    google_id VARCHAR(255) UNIQUE DEFAULT NULL,
    telegram_id VARCHAR(32) UNIQUE DEFAULT NULL,
    first_name VARCHAR(128) DEFAULT NULL,
    last_name VARCHAR(128) DEFAULT NULL,
    telegram_username VARCHAR(128) DEFAULT NULL,
    profile_photo VARCHAR(512) DEFAULT NULL,
    CONSTRAINT valid_username CHECK (username ~ '^[a-zA-Z0-9_-]+$'),
    CONSTRAINT unique_telegram_id UNIQUE (telegram_id)
);

-- ===== REFRESH TOKENS TABLE =====
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    device_info VARCHAR(500) DEFAULT NULL,
    ip_address INET DEFAULT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    revoked_at TIMESTAMPTZ DEFAULT NULL,
    replaced_by UUID DEFAULT NULL,
    is_compromised BOOLEAN DEFAULT FALSE,
    CONSTRAINT unique_token_hash UNIQUE (token_hash)
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens(expires_at);
CREATE INDEX idx_refresh_tokens_hash ON refresh_tokens(token_hash);

-- ===== USER PROGRESS TABLE =====
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    word VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'learning' CHECK (status IN ('new', 'learning', 'reviewing', 'mastered')),
    difficulty VARCHAR(20) DEFAULT 'intermediate' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'academic', 'sat')),
    times_viewed INT DEFAULT 0,
    times_correct INT DEFAULT 0,
    times_wrong INT DEFAULT 0,
    last_reviewed_at TIMESTAMPTZ DEFAULT NULL,
    next_review_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_favorite BOOLEAN DEFAULT FALSE,
    UNIQUE(user_id, word)
);

CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_next_review ON user_progress(user_id, next_review_at);
CREATE INDEX idx_user_progress_favorites ON user_progress(user_id, is_favorite) WHERE is_favorite = TRUE;

-- ===== USER STATS TABLE =====
CREATE TABLE IF NOT EXISTS user_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    total_xp INT DEFAULT 0,
    level INT DEFAULT 1,
    words_learned INT DEFAULT 0,
    correct_answers INT DEFAULT 0,
    total_questions INT DEFAULT 0,
    games_played INT DEFAULT 0,
    cards_reviewed INT DEFAULT 0,
    study_minutes INT DEFAULT 0,
    streak INT DEFAULT 0,
    last_active_date DATE DEFAULT NULL,
    heatmap JSONB DEFAULT '{}'::jsonb,
    weekly_data JSONB DEFAULT '{}'::jsonb,
    achievements TEXT[] DEFAULT '{}',
    grammar_xp INT DEFAULT 0,
    grammar_level INT DEFAULT 1,
    grammar_rank VARCHAR(50) DEFAULT 'Beginner',
    grammar_total_lessons INT DEFAULT 0,
    grammar_completed_lessons TEXT[] DEFAULT '{}',
    grammar_lesson_progress JSONB DEFAULT '{}'::jsonb,
    grammar_quiz_score INT DEFAULT 0,
    grammar_total_quizzes INT DEFAULT 0,
    grammar_total_correct INT DEFAULT 0,
    grammar_total_questions INT DEFAULT 0,
    grammar_streak INT DEFAULT 0,
    grammar_achievements TEXT[] DEFAULT '{}',
    grammar_strongest_topic VARCHAR(100) DEFAULT '',
    grammar_weakest_topic VARCHAR(100) DEFAULT '',
    grammar_heatmap JSONB DEFAULT '{}'::jsonb,
    grammar_weekly_data JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== TOKEN BLACKLIST (revoked access tokens) =====
CREATE TABLE IF NOT EXISTS token_blacklist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token_jti VARCHAR(255) NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ DEFAULT NOW(),
    reason VARCHAR(50) DEFAULT 'logout'
);

CREATE INDEX idx_token_blacklist_jti ON token_blacklist(token_jti);
CREATE INDEX idx_token_blacklist_expires ON token_blacklist(expires_at);

CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);

-- ===== FUNCTIONS & TRIGGERS =====
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ===== WORD AI CACHE TABLE =====
CREATE TABLE IF NOT EXISTS word_ai_cache (
    word VARCHAR(255) PRIMARY KEY,
    ai_response TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trigger_word_ai_cache_updated_at
    BEFORE UPDATE ON word_ai_cache
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ===== PASSWORD RESET TOKENS =====
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_password_reset_user_id ON password_reset_tokens(user_id);

-- ===== USER PROFILES TABLE (encrypted sensitive fields) =====
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    display_name VARCHAR(100) DEFAULT '',
    avatar_url VARCHAR(500) DEFAULT '',
    bio TEXT DEFAULT '',
    location VARCHAR(200) DEFAULT '',
    website VARCHAR(500) DEFAULT '',
    native_language VARCHAR(50) DEFAULT '',
    target_language VARCHAR(50) DEFAULT 'English',
    daily_word_goal INT DEFAULT 10,
    study_goal VARCHAR(50) DEFAULT 'casual' CHECK (study_goal IN ('casual', 'regular', 'intensive', 'hardcore')),
    notification_preferences JSONB DEFAULT '{"email": true, "streak_reminder": true, "achievement": true}'::jsonb,
    theme VARCHAR(20) DEFAULT 'dark',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== DEVICE SESSIONS (anonymous data persistence) =====
CREATE TABLE IF NOT EXISTS device_sessions (
    device_id VARCHAR(64) PRIMARY KEY,
    stats JSONB DEFAULT '{}'::jsonb,
    favorites JSONB DEFAULT '[]'::jsonb,
    recent_words JSONB DEFAULT '[]'::jsonb,
    grammar JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_user_progress_updated_at
    BEFORE UPDATE ON user_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_user_stats_updated_at
    BEFORE UPDATE ON user_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_device_sessions_updated_at
    BEFORE UPDATE ON device_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ===== PREMIUM GRANTS TABLE =====
CREATE TABLE IF NOT EXISTS premium_grants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tier VARCHAR(20) NOT NULL CHECK (tier IN ('Basic', 'Premium', 'Premium Ultra')),
    granted_by UUID NOT NULL REFERENCES users(id),
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT NULL,
    notes TEXT DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_premium_grants_user ON premium_grants(user_id);

-- ===== TELEGRAM BOT USERS TABLE =====
CREATE TABLE IF NOT EXISTS telegram_bot_users (
    id SERIAL PRIMARY KEY,
    telegram_id BIGINT NOT NULL UNIQUE,
    username VARCHAR(128) DEFAULT NULL,
    first_name VARCHAR(128) DEFAULT NULL,
    last_name VARCHAR(128) DEFAULT NULL,
    chat_id BIGINT NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    first_interaction_at TIMESTAMPTZ DEFAULT NOW(),
    last_interaction_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tg_bot_users_telegram_id ON telegram_bot_users(telegram_id);
CREATE INDEX IF NOT EXISTS idx_tg_bot_users_chat_id ON telegram_bot_users(chat_id);

-- ===== PAYMENT REQUESTS TABLE =====
CREATE TABLE IF NOT EXISTS payment_requests (
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
);

CREATE INDEX IF NOT EXISTS idx_payment_requests_status ON payment_requests(status);
CREATE INDEX IF NOT EXISTS idx_payment_requests_user ON payment_requests(user_id);

