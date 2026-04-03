-- ============================================================================
-- 华南留学 - 雅思/托福题库系统数据库表结构
-- 创建日期: 2026-04-03
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. 题目分类表
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS question_categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  exam_type VARCHAR(20) NOT NULL COMMENT '考试类型: ielts, toefl',
  subject VARCHAR(20) NOT NULL COMMENT '科目: listening, reading, writing, speaking',
  name VARCHAR(50) NOT NULL COMMENT '分类名称',
  parent_id INT UNSIGNED DEFAULT 0 COMMENT '父分类ID, 0=顶级分类',
  sort_order INT DEFAULT 0 COMMENT '排序',
  status TINYINT DEFAULT 1 COMMENT '状态: 0=禁用, 1=启用',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_exam_type (exam_type),
  INDEX idx_subject (subject),
  INDEX idx_parent (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='题目分类表';

-- ----------------------------------------------------------------------------
-- 2. 知识点标签表
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS question_tags (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL COMMENT '标签名称',
  color VARCHAR(20) DEFAULT '#2C5F7C' COMMENT '标签颜色',
  sort_order INT DEFAULT 0 COMMENT '排序',
  status TINYINT DEFAULT 1 COMMENT '状态: 0=禁用, 1=启用',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='知识点标签表';

-- ----------------------------------------------------------------------------
-- 3. 题目表
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS questions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id INT UNSIGNED DEFAULT 0 COMMENT '分类ID',
  exam_type VARCHAR(20) NOT NULL COMMENT '考试类型: ielts, toefl',
  subject VARCHAR(20) NOT NULL COMMENT '科目: listening, reading, writing, speaking',
  type VARCHAR(30) NOT NULL COMMENT '题型',
  title TEXT COMMENT '题干/题目标题',
  content TEXT COMMENT '题目内容(HTML或JSON)',
  options JSON COMMENT '选项: [{"key":"A","text":"..."}]',
  correct_answer TEXT COMMENT '正确答案',
  answer_analysis TEXT COMMENT '答案解析',
  sample_answer TEXT COMMENT '范文/参考答案(写作口语用)',
  difficulty TINYINT DEFAULT 2 COMMENT '难度: 1=简单, 2=中等, 3=困难',
  score DECIMAL(5,2) DEFAULT 1.00 COMMENT '题目默认分值',
  knowledge_points JSON COMMENT '知识点列表',
  audio_url VARCHAR(500) COMMENT '听力音频URL',
  images JSON COMMENT '题目图片列表',
  passage TEXT COMMENT '阅读文章/听力原文/口语材料',
  time_limit INT DEFAULT 0 COMMENT '建议答题时间(秒), 0=不限时',
  usage_count INT DEFAULT 0 COMMENT '被练习次数',
  status TINYINT DEFAULT 1 COMMENT '状态: 0=下架, 1=上架',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category_id),
  INDEX idx_exam_type (exam_type),
  INDEX idx_subject (subject),
  INDEX idx_type (type),
  INDEX idx_difficulty (difficulty),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='题目表';

-- ----------------------------------------------------------------------------
-- 4. 题目标签关联表
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS question_tag_relations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  question_id INT UNSIGNED NOT NULL,
  tag_id INT UNSIGNED NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_question_tag (question_id, tag_id),
  INDEX idx_tag (tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='题目标签关联表';

-- ----------------------------------------------------------------------------
-- 5. 试卷/模考卷表
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS exam_papers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL COMMENT '试卷标题',
  exam_type VARCHAR(20) NOT NULL COMMENT '考试类型: ielts, toefl',
  subject VARCHAR(20) COMMENT '科目, 为空表示综合卷',
  description TEXT COMMENT '试卷描述',
  total_score DECIMAL(6,2) DEFAULT 0 COMMENT '总分',
  time_limit INT DEFAULT 0 COMMENT '总时长(秒), 0=不限时',
  question_count INT DEFAULT 0 COMMENT '题目数量',
  is_official TINYINT DEFAULT 0 COMMENT '是否官方真题: 0=否, 1=是',
  sort_order INT DEFAULT 0 COMMENT '排序',
  status TINYINT DEFAULT 1 COMMENT '状态: 0=下架, 1=上架',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_exam_type (exam_type),
  INDEX idx_subject (subject),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='试卷表';

-- ----------------------------------------------------------------------------
-- 6. 试卷题目关联表
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS exam_paper_questions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  paper_id INT UNSIGNED NOT NULL,
  question_id INT UNSIGNED NOT NULL,
  sort_order INT DEFAULT 0 COMMENT '题目在试卷中的顺序',
  score DECIMAL(5,2) DEFAULT 1.00 COMMENT '该题在试卷中的分值',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_paper_question (paper_id, question_id),
  INDEX idx_question (question_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='试卷题目关联表';

-- ----------------------------------------------------------------------------
-- 7. 用户考试/练习记录表
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_exams (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL COMMENT '用户ID',
  paper_id INT UNSIGNED DEFAULT 0 COMMENT '试卷ID, 0=自由练习',
  exam_type VARCHAR(20) COMMENT '考试类型',
  subject VARCHAR(20) COMMENT '科目',
  mode VARCHAR(20) NOT NULL DEFAULT 'practice' COMMENT '模式: practice=练习, exam=模考, wrong_book=错题重练, random=随机练习',
  title VARCHAR(200) COMMENT '练习标题',
  total_questions INT DEFAULT 0 COMMENT '总题数',
  answered_questions INT DEFAULT 0 COMMENT '已答题数',
  correct_count INT DEFAULT 0 COMMENT '正确题数(客观题)',
  total_score DECIMAL(6,2) DEFAULT 0 COMMENT '试卷总分',
  user_score DECIMAL(6,2) DEFAULT 0 COMMENT '用户得分',
  time_spent INT DEFAULT 0 COMMENT '用时(秒)',
  status TINYINT DEFAULT 0 COMMENT '状态: 0=进行中, 1=已完成',
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  submitted_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user (user_id),
  INDEX idx_paper (paper_id),
  INDEX idx_mode (mode),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户考试记录表';

-- ----------------------------------------------------------------------------
-- 8. 用户答题详情表
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_answers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  exam_id INT UNSIGNED NOT NULL COMMENT '考试记录ID',
  user_id INT UNSIGNED NOT NULL COMMENT '用户ID',
  question_id INT UNSIGNED NOT NULL COMMENT '题目ID',
  user_answer TEXT COMMENT '用户答案',
  is_correct TINYINT DEFAULT 0 COMMENT '是否正确: 0=错误, 1=正确, 2=部分正确, 3=待批改(主观题)',
  score DECIMAL(5,2) DEFAULT 0 COMMENT '该题得分',
  time_spent INT DEFAULT 0 COMMENT '该题用时(秒)',
  answer_analysis TEXT COMMENT '当时看到的解析(快照)',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_exam_question (exam_id, question_id),
  INDEX idx_user (user_id),
  INDEX idx_question (question_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户答题记录表';

-- ----------------------------------------------------------------------------
-- 9. 用户错题本表
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_wrong_questions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  question_id INT UNSIGNED NOT NULL,
  wrong_count INT DEFAULT 1 COMMENT '错误次数',
  last_wrong_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '最后一次做错时间',
  is_mastered TINYINT DEFAULT 0 COMMENT '是否已掌握: 0=未掌握, 1=已掌握',
  mastered_at DATETIME COMMENT '掌握时间',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_question (user_id, question_id),
  INDEX idx_user (user_id),
  INDEX idx_question (question_id),
  INDEX idx_mastered (is_mastered)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户错题本表';

-- ----------------------------------------------------------------------------
-- 插入默认分类数据
-- ----------------------------------------------------------------------------
INSERT INTO question_categories (exam_type, subject, name, parent_id, sort_order, status) VALUES
-- 雅思分类
('ielts', 'listening', '雅思听力', 0, 1, 1),
('ielts', 'reading', '雅思阅读', 0, 2, 1),
('ielts', 'writing', '雅思写作', 0, 3, 1),
('ielts', 'speaking', '雅思口语', 0, 4, 1),
-- 托福分类
('toefl', 'listening', '托福听力', 0, 5, 1),
('toefl', 'reading', '托福阅读', 0, 6, 1),
('toefl', 'writing', '托福写作', 0, 7, 1),
('toefl', 'speaking', '托福口语', 0, 8, 1);

-- 插入默认标签数据
INSERT INTO question_tags (name, color, status) VALUES
('同义替换', '#3A7CA5', 1),
('主旨大意', '#2C5F7C', 1),
('细节理解', '#E8B46E', 1),
('推理判断', '#5D8A66', 1),
('词汇题', '#8B5A2B', 1),
('语法结构', '#6B5B95', 1),
('逻辑连接', '#C1502E', 1),
('听力场景', '#4A7C59', 1);
