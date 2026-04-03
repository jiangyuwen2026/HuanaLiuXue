-- ============================================================================
-- 添加 AI 批改字段到 user_answers 表
-- ============================================================================

-- 添加 AI 评分字段
ALTER TABLE user_answers
ADD COLUMN ai_score DECIMAL(3, 1) NULL COMMENT 'AI 评分 (0-9)',
ADD COLUMN ai_details JSON NULL COMMENT '各项评分详情',
ADD COLUMN ai_feedback TEXT NULL COMMENT 'AI 评语',
ADD COLUMN ai_graded_at DATETIME NULL COMMENT 'AI 批改时间',
ADD COLUMN ai_model VARCHAR(50) NULL COMMENT '使用的 AI 模型';

-- 添加索引
CREATE INDEX idx_ai_score ON user_answers(ai_score);
CREATE INDEX idx_ai_graded_at ON user_answers(ai_graded_at);
