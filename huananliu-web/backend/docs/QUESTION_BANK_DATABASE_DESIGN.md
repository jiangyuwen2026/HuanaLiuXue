# 雅思/托福题库系统 - 数据库设计文档

**文档版本**: v1.0  
**创建日期**: 2026-04-03  
**适用分支**: `feature/ielts-toefl-question-bank`

---

## 📋 概述

本文档描述了华南留学官网新增的雅思/托福题库与在线刷题系统的数据库表结构设计。系统支持：

- 雅思 (IELTS) 和 托福 (TOEFL) 两种考试类型
- 听力、阅读、写作、口语四个科目
- 多种题型：单选、多选、判断、填空、匹配、写作、口语
- 在线刷题、模考、错题本功能

---

## 🗂️ 数据库表清单

| 表名 | 说明 | 核心字段 |
|------|------|----------|
| `question_categories` | 题目分类 | exam_type, subject, name, parent_id |
| `question_tags` | 知识点标签 | name, color |
| `questions` | 题目主表 | exam_type, subject, type, content, correct_answer |
| `question_tag_relations` | 题目标签关联 | question_id, tag_id |
| `exam_papers` | 试卷/模考卷 | title, exam_type, time_limit, question_count |
| `exam_paper_questions` | 试卷题目关联 | paper_id, question_id, sort_order |
| `user_exams` | 用户考试记录 | user_id, mode, score, time_spent, status |
| `user_answers` | 用户答题详情 | exam_id, question_id, user_answer, is_correct |
| `user_wrong_questions` | 错题本 | user_id, question_id, wrong_count, is_mastered |

---

## 📊 详细表结构

### 1. question_categories (题目分类表)

存储题目分类，支持多级分类（如：雅思听力 → 场景对话 → 图书馆场景）。

```sql
CREATE TABLE question_categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  exam_type VARCHAR(20) NOT NULL,    -- ielts / toefl
  subject VARCHAR(20) NOT NULL,      -- listening / reading / writing / speaking
  name VARCHAR(50) NOT NULL,         -- 分类名称
  parent_id INT UNSIGNED DEFAULT 0,  -- 父分类ID, 0=顶级分类
  sort_order INT DEFAULT 0,
  status TINYINT DEFAULT 1,          -- 0=禁用, 1=启用
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**默认数据**:
- 雅思听力、雅思阅读、雅思写作、雅思口语
- 托福听力、托福阅读、托福写作、托福口语

---

### 2. question_tags (知识点标签表)

用于标记题目涉及的知识点，便于用户针对性练习。

```sql
CREATE TABLE question_tags (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,  -- 如"同义替换"
  color VARCHAR(20) DEFAULT '#2C5F7C',
  sort_order INT DEFAULT 0,
  status TINYINT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**默认标签**:
- 同义替换、主旨大意、细节理解、推理判断
- 词汇题、语法结构、逻辑连接、听力场景

---

### 3. questions (题目表)

核心题目表，存储所有题目内容、答案、解析等。

```sql
CREATE TABLE questions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id INT UNSIGNED DEFAULT 0,
  exam_type VARCHAR(20) NOT NULL,    -- ielts / toefl
  subject VARCHAR(20) NOT NULL,      -- listening / reading / writing / speaking
  type VARCHAR(30) NOT NULL,         -- 题型，见下表
  title TEXT,                        -- 题干
  content TEXT,                      -- 题目内容(支持HTML)
  options JSON,                      -- 选项 [{"key":"A","text":"..."}]
  correct_answer TEXT,               -- 正确答案
  answer_analysis TEXT,              -- 答案解析
  sample_answer TEXT,                -- 范文/参考答案(写作/口语用)
  difficulty TINYINT DEFAULT 2,      -- 1=简单, 2=中等, 3=困难
  score DECIMAL(5,2) DEFAULT 1.00,   -- 默认分值
  knowledge_points JSON,             -- 知识点列表
  audio_url VARCHAR(500),            -- 听力音频
  images JSON,                       -- 题目图片
  passage TEXT,                      -- 阅读文章/听力原文/口语材料
  time_limit INT DEFAULT 0,          -- 建议答题时间(秒)
  usage_count INT DEFAULT 0,         -- 被练习次数
  status TINYINT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**题型 (type) 枚举**:

| 题型代码 | 说明 | 适用科目 |
|----------|------|----------|
| `single_choice` | 单选题 | 听力、阅读 |
| `multiple_choice` | 多选题 | 阅读 |
| `true_false_not_given` | 判断题 (T/F/NG) | 阅读 |
| `fill_blank` | 填空题 | 听力、阅读 |
| `matching` | 匹配题 | 阅读 |
| `map_labeling` | 地图/图表标注 | 听力 |
| `sentence_completion` | 句子完成 | 听力 |
| `essay` | 大作文 (Task 2) | 写作 |
| `short_answer` | 小作文/简答 (Task 1) | 写作 |
| `speaking_part1` | 口语 Part 1 | 口语 |
| `speaking_part2` | 口语 Part 2 | 口语 |
| `speaking_part3` | 口语 Part 3 | 口语 |

---

### 4. question_tag_relations (题目标签关联表)

多对多关联表，记录题目与标签的关系。

```sql
CREATE TABLE question_tag_relations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  question_id INT UNSIGNED NOT NULL,
  tag_id INT UNSIGNED NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_question_tag (question_id, tag_id)
);
```

---

### 5. exam_papers (试卷表)

存储模拟考试试卷，支持官方真题和自定义试卷。

```sql
CREATE TABLE exam_papers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,       -- 试卷标题，如"雅思全真模拟卷-Test 1"
  exam_type VARCHAR(20) NOT NULL,    -- ielts / toefl
  subject VARCHAR(20),               -- 为空表示综合卷
  description TEXT,
  total_score DECIMAL(6,2) DEFAULT 0,
  time_limit INT DEFAULT 0,          -- 总时长(秒)，如 10800 = 3小时
  question_count INT DEFAULT 0,
  is_official TINYINT DEFAULT 0,     -- 是否官方真题
  sort_order INT DEFAULT 0,
  status TINYINT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

### 6. exam_paper_questions (试卷题目关联表)

记录试卷包含哪些题目及其顺序、分值。

```sql
CREATE TABLE exam_paper_questions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  paper_id INT UNSIGNED NOT NULL,
  question_id INT UNSIGNED NOT NULL,
  sort_order INT DEFAULT 0,          -- 题目在试卷中的顺序
  score DECIMAL(5,2) DEFAULT 1.00,   -- 该题在此试卷中的分值
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_paper_question (paper_id, question_id)
);
```

---

### 7. user_exams (用户考试记录表)

记录用户的每次练习或模考。

```sql
CREATE TABLE user_exams (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  paper_id INT UNSIGNED DEFAULT 0,   -- 0表示自由练习，非0表示模考
  exam_type VARCHAR(20),
  subject VARCHAR(20),
  mode VARCHAR(20) DEFAULT 'practice', -- 练习模式，见下表
  title VARCHAR(200),                -- 练习标题
  total_questions INT DEFAULT 0,
  answered_questions INT DEFAULT 0,
  correct_count INT DEFAULT 0,       -- 客观题正确数
  total_score DECIMAL(6,2) DEFAULT 0,
  user_score DECIMAL(6,2) DEFAULT 0,
  time_spent INT DEFAULT 0,          -- 用时(秒)
  status TINYINT DEFAULT 0,          -- 0=进行中, 1=已完成
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  submitted_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**练习模式 (mode) 枚举**:

| 模式 | 说明 |
|------|------|
| `practice` | 专项练习（按科目/分类） |
| `exam` | 模考（完整试卷） |
| `wrong_book` | 错题重练 |
| `random` | 随机练习 |
| `tag_practice` | 知识点专项 |

---

### 8. user_answers (用户答题详情表)

记录用户每道题的答题详情。

```sql
CREATE TABLE user_answers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  exam_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  question_id INT UNSIGNED NOT NULL,
  user_answer TEXT,                  -- 用户答案
  is_correct TINYINT DEFAULT 0,      -- 0=错误, 1=正确, 2=部分正确, 3=待批改
  score DECIMAL(5,2) DEFAULT 0,
  time_spent INT DEFAULT 0,          -- 该题用时(秒)
  answer_analysis TEXT,              -- 当时看到的解析(快照)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_exam_question (exam_id, question_id)
);
```

**is_correct 说明**:
- `0` - 错误（客观题）
- `1` - 正确（客观题）
- `2` - 部分正确（多选题选部分）
- `3` - 待批改（写作/口语等主观题）

---

### 9. user_wrong_questions (用户错题本表)

记录用户的错题，支持标记已掌握。

```sql
CREATE TABLE user_wrong_questions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  question_id INT UNSIGNED NOT NULL,
  wrong_count INT DEFAULT 1,         -- 错误次数
  last_wrong_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_mastered TINYINT DEFAULT 0,     -- 0=未掌握, 1=已掌握
  mastered_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_question (user_id, question_id)
);
```

---

## 🔗 模型关联关系 (Sequelize)

```javascript
// 题目与分类
QuestionCategory.hasMany(Question, { foreignKey: 'category_id', as: 'questions' });
Question.belongsTo(QuestionCategory, { foreignKey: 'category_id', as: 'category' });

// 题目与标签（多对多）
Question.belongsToMany(QuestionTag, { through: QuestionTagRelation, as: 'tags' });
QuestionTag.belongsToMany(Question, { through: QuestionTagRelation, as: 'questions' });

// 试卷与题目（多对多）
ExamPaper.belongsToMany(Question, { through: ExamPaperQuestion, as: 'questions' });
Question.belongsToMany(ExamPaper, { through: ExamPaperQuestion, as: 'papers' });

// 用户与考试记录
User.hasMany(UserExam, { foreignKey: 'user_id', as: 'exams' });
UserExam.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// 考试记录与答题详情
UserExam.hasMany(UserAnswer, { foreignKey: 'exam_id', as: 'answers' });
UserAnswer.belongsTo(UserExam, { foreignKey: 'exam_id', as: 'exam' });
UserAnswer.belongsTo(Question, { foreignKey: 'question_id', as: 'question' });

// 用户与错题本
User.hasMany(UserWrongQuestion, { foreignKey: 'user_id', as: 'wrongQuestions' });
UserWrongQuestion.belongsTo(Question, { foreignKey: 'question_id', as: 'question' });
```

---

## 📁 相关文件

| 文件路径 | 说明 |
|----------|------|
| `migrations/create_question_bank.sql` | 数据库迁移 SQL |
| `models/index.js` | Sequelize 模型定义 |

---

## 🚀 使用说明

### 1. 执行数据库迁移

```bash
mysql -u root -p huananliu < migrations/create_question_bank.sql
```

### 2. 在 Node.js 中使用模型

```javascript
const { 
  Question, 
  QuestionCategory, 
  UserExam, 
  UserAnswer 
} = require('./models');

// 创建题目
const question = await Question.create({
  exam_type: 'ielts',
  subject: 'listening',
  type: 'single_choice',
  title: 'What is the main topic of the conversation?',
  options: [
    { key: 'A', text: 'Library services' },
    { key: 'B', text: 'Course registration' },
    { key: 'C', text: 'Campus facilities' }
  ],
  correct_answer: 'A',
  answer_analysis: 'The conversation focuses on library borrowing rules...',
  difficulty: 2
});

// 获取带分类和标签的题目
const questionWithDetails = await Question.findByPk(1, {
  include: [
    { model: QuestionCategory, as: 'category' },
    { model: QuestionTag, as: 'tags' }
  ]
});
```

---

## 📈 扩展建议

1. **AI 批改集成**: 为写作/口语题添加 `ai_score`、`ai_feedback` 字段
2. **收藏功能**: 添加 `user_favorite_questions` 表
3. **练习计划**: 添加 `study_plans` 和 `study_plan_tasks` 表
4. **排行榜**: 添加 `leaderboards` 表记录模考排名
5. **笔记功能**: 添加 `user_question_notes` 表允许用户给题目添加笔记

---

**文档维护**: 华南留学技术团队  
**最后更新**: 2026-04-03
