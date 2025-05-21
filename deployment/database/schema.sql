-- Cardano Kids Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    account_type VARCHAR(20) NOT NULL, -- 'parent', 'teacher', 'child'
    password_hash VARCHAR(255),
    age_group VARCHAR(20), -- 'young' (6-8), 'middle' (9-11), 'older' (12-14)
    parent_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Wallet connections
CREATE TABLE IF NOT EXISTS wallet_connections (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    wallet_type VARCHAR(20) NOT NULL, -- 'nami', 'eternl', 'flint', 'yoroi'
    stake_address VARCHAR(255) NOT NULL,
    is_connected BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    age_level VARCHAR(20) NOT NULL, -- 'young', 'middle', 'older'
    course_order INTEGER NOT NULL,
    thumbnail_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Modules table
CREATE TABLE IF NOT EXISTS modules (
    id UUID PRIMARY KEY,
    course_id UUID REFERENCES courses(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    module_order INTEGER NOT NULL,
    thumbnail_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Educational content
CREATE TABLE IF NOT EXISTS educational_content (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    content_type VARCHAR(20) NOT NULL, -- 'lesson', 'video', 'quiz', 'game', 'simulation'
    content_level VARCHAR(20) NOT NULL, -- 'beginner', 'intermediate', 'advanced'
    target_age_groups JSONB NOT NULL, -- Array of age groups
    content_url TEXT NOT NULL,
    thumbnail_url TEXT,
    module_id UUID REFERENCES modules(id),
    content_order INTEGER,
    creator_id UUID REFERENCES users(id),
    verification_status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'pending', 'verified', 'published'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITH TIME ZONE
);

-- Content access requirements
CREATE TABLE IF NOT EXISTS content_access_requirements (
    id UUID PRIMARY KEY,
    content_id UUID REFERENCES educational_content(id),
    requirement_type VARCHAR(30) NOT NULL, -- 'badge_required', 'module_completed', etc.
    badge_id UUID,
    module_id UUID REFERENCES modules(id),
    required_progress INTEGER,
    required_age_group VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Content verification records
CREATE TABLE IF NOT EXISTS content_verification (
    id UUID PRIMARY KEY,
    content_id UUID REFERENCES educational_content(id),
    verifier_id UUID REFERENCES users(id),
    verification_status VARCHAR(20) NOT NULL, -- 'approved', 'rejected'
    verification_notes TEXT,
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Blockchain records for content
CREATE TABLE IF NOT EXISTS blockchain_records (
    id UUID PRIMARY KEY,
    content_id UUID REFERENCES educational_content(id),
    transaction_id VARCHAR(255) NOT NULL,
    metadata_label INTEGER NOT NULL,
    metadata_json JSONB NOT NULL,
    ipfs_hash VARCHAR(255) NOT NULL,
    policy_id VARCHAR(255),
    asset_name VARCHAR(255),
    block_height INTEGER,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User content access
CREATE TABLE IF NOT EXISTS user_content_access (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    content_id UUID REFERENCES educational_content(id),
    access_granted BOOLEAN DEFAULT FALSE,
    access_granted_at TIMESTAMP WITH TIME ZONE,
    completion_status VARCHAR(20) DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed'
    progress INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    score INTEGER,
    attempts INTEGER DEFAULT 0,
    UNIQUE(user_id, content_id)
);

-- Content feedback
CREATE TABLE IF NOT EXISTS content_feedback (
    id UUID PRIMARY KEY,
    content_id UUID REFERENCES educational_content(id),
    user_id UUID REFERENCES users(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Achievements
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    achievement_type VARCHAR(30) NOT NULL, -- 'course_completion', 'module_completion', 'quiz_mastery', etc.
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User achievements
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    achievement_id UUID REFERENCES achievements(id),
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    transaction_id VARCHAR(255),
    nft_policy_id VARCHAR(255),
    nft_asset_name VARCHAR(255),
    UNIQUE(user_id, achievement_id)
);

-- Classrooms
CREATE TABLE IF NOT EXISTS classrooms (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    teacher_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Classroom students
CREATE TABLE IF NOT EXISTS classroom_students (
    classroom_id UUID REFERENCES classrooms(id),
    student_id UUID REFERENCES users(id),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (classroom_id, student_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_educational_content_module_id ON educational_content(module_id);
CREATE INDEX IF NOT EXISTS idx_modules_course_id ON modules(course_id);
CREATE INDEX IF NOT EXISTS idx_user_content_access_user_id ON user_content_access(user_id);
CREATE INDEX IF NOT EXISTS idx_user_content_access_content_id ON user_content_access(content_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_content_verification_content_id ON content_verification(content_id);
CREATE INDEX IF NOT EXISTS idx_classroom_students_student_id ON classroom_students(student_id);
CREATE INDEX IF NOT EXISTS idx_users_parent_id ON users(parent_id);
CREATE INDEX IF NOT EXISTS idx_users_account_type ON users(account_type);
CREATE INDEX IF NOT EXISTS idx_educational_content_verification_status ON educational_content(verification_status);
CREATE INDEX IF NOT EXISTS idx_educational_content_content_type ON educational_content(content_type);
CREATE INDEX IF NOT EXISTS idx_educational_content_content_level ON educational_content(content_level);
