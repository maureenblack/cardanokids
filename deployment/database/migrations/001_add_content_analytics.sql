-- Migration: Add content analytics tables
-- Version: 001

-- Table for tracking content views
CREATE TABLE IF NOT EXISTS content_views (
    id UUID PRIMARY KEY,
    content_id UUID REFERENCES educational_content(id),
    user_id UUID REFERENCES users(id),
    view_duration_seconds INTEGER,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    device_type VARCHAR(50),
    ip_address VARCHAR(45)
);

-- Table for tracking quiz results in detail
CREATE TABLE IF NOT EXISTS quiz_results (
    id UUID PRIMARY KEY,
    content_id UUID REFERENCES educational_content(id),
    user_id UUID REFERENCES users(id),
    question_id VARCHAR(255),
    question_text TEXT,
    user_answer TEXT,
    is_correct BOOLEAN,
    time_taken_seconds INTEGER,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for tracking learning milestones
CREATE TABLE IF NOT EXISTS learning_milestones (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    milestone_type VARCHAR(50) NOT NULL,
    milestone_description TEXT NOT NULL,
    course_id UUID REFERENCES courses(id),
    module_id UUID REFERENCES modules(id),
    content_id UUID REFERENCES educational_content(id),
    achieved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    blockchain_recorded BOOLEAN DEFAULT FALSE,
    transaction_id VARCHAR(255)
);

-- Create indexes for analytics tables
CREATE INDEX IF NOT EXISTS idx_content_views_content_id ON content_views(content_id);
CREATE INDEX IF NOT EXISTS idx_content_views_user_id ON content_views(user_id);
CREATE INDEX IF NOT EXISTS idx_content_views_viewed_at ON content_views(viewed_at);

CREATE INDEX IF NOT EXISTS idx_quiz_results_content_id ON quiz_results(content_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_id ON quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_submitted_at ON quiz_results(submitted_at);

CREATE INDEX IF NOT EXISTS idx_learning_milestones_user_id ON learning_milestones(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_milestones_milestone_type ON learning_milestones(milestone_type);
CREATE INDEX IF NOT EXISTS idx_learning_milestones_achieved_at ON learning_milestones(achieved_at);
