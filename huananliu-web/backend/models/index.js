const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config');

const sequelize = new Sequelize(
  config.database.database,
  config.database.username,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: config.database.dialect,
    logging: config.database.logging,
    pool: config.database.pool
  }
);

// 学校模型
const School = sequelize.define('School', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name_cn: { type: DataTypes.STRING(255), allowNull: false },
  name_en: { type: DataTypes.STRING(255) },
  country: { type: DataTypes.STRING(50) },
  city: { type: DataTypes.STRING(50) },
  rank: { type: DataTypes.INTEGER },
  logo: { type: DataTypes.STRING(500) },
  banner: { type: DataTypes.STRING(500) }, // 封面图/首图
  description: { type: DataTypes.TEXT },
  features: { type: DataTypes.JSON }, // 特色亮点
  requirements: { type: DataTypes.JSON }, // 申请要求
  faculties: { type: DataTypes.JSON }, // 院系列表 [{id, name, majors: []}]
  master_categories: { type: DataTypes.JSON }, // 硕士专业分类 [{id, name, majors: []}]
  tuition: { type: DataTypes.STRING(100) },
  website: { type: DataTypes.STRING(500) },
  status: { type: DataTypes.TINYINT, defaultValue: 1 },
  view_count: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  tableName: 'schools',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// 顾问模型
const Consultant = sequelize.define('Consultant', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(50), allowNull: false },
  avatar: { type: DataTypes.STRING(500) },
  title: { type: DataTypes.STRING(100) },
  service_type: { type: DataTypes.STRING(50) },
  region: { type: DataTypes.STRING(50) },
  experience: { type: DataTypes.INTEGER },
  education: { type: DataTypes.STRING(200) },
  specialties: { type: DataTypes.JSON },
  bio: { type: DataTypes.TEXT },
  success_cases: { type: DataTypes.INTEGER, defaultValue: 0 },
  rating: { type: DataTypes.DECIMAL(3, 2), defaultValue: 5.00 },
  status: { type: DataTypes.TINYINT, defaultValue: 1 }
}, {
  tableName: 'consultants',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// 成功案例模型
const Case = sequelize.define('Case', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(255), allowNull: false },
  student_name: { type: DataTypes.STRING(50) },
  avatar: { type: DataTypes.STRING(500) },
  consultant_id: { type: DataTypes.INTEGER },
  school_id: { type: DataTypes.INTEGER },
  original_school: { type: DataTypes.STRING(200) },
  target_country: { type: DataTypes.STRING(50) },
  target_major: { type: DataTypes.STRING(200) },
  admission_result: { type: DataTypes.STRING(200) },
  scholarship: { type: DataTypes.STRING(100) },
  story: { type: DataTypes.TEXT },
  cover: { type: DataTypes.STRING(500) },
  images: { type: DataTypes.JSON },
  status: { type: DataTypes.TINYINT, defaultValue: 1 },
  view_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  is_featured: { type: DataTypes.TINYINT, defaultValue: 0 }, // 是否明星案例 0=否 1=是
  feature_sort: { type: DataTypes.INTEGER, defaultValue: 0 }, // 明星案例排序
  feature_highlight: { type: DataTypes.STRING(100) }, // 明星案例亮点标签
  feature_bg: { type: DataTypes.STRING(50) } // 明星案例背景渐变配色
}, {
  tableName: 'cases',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// 新闻模型
const News = sequelize.define('News', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(255), allowNull: false },
  cover: { type: DataTypes.STRING(500) },
  category: { type: DataTypes.STRING(50) },
  summary: { type: DataTypes.TEXT },
  content: { type: DataTypes.TEXT },
  author: { type: DataTypes.STRING(50) },
  source: { type: DataTypes.STRING(100) },
  tags: { type: DataTypes.JSON },
  status: { type: DataTypes.TINYINT, defaultValue: 1 },
  view_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  is_recommended: { type: DataTypes.TINYINT, defaultValue: 0 }, // 是否推荐 0=否 1=是
  recommend_sort: { type: DataTypes.INTEGER, defaultValue: 0 }, // 推荐排序
  published_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'news',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// 留言模型
const Message = sequelize.define('Message', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(50), allowNull: false },
  phone: { type: DataTypes.STRING(20) },
  email: { type: DataTypes.STRING(100) },
  country: { type: DataTypes.STRING(50) },
  message: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.TINYINT, defaultValue: 0 },
  remark: { type: DataTypes.TEXT }
}, {
  tableName: 'messages',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// 预约到访模型
const Appointment = sequelize.define('Appointment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(50), allowNull: false },
  phone: { type: DataTypes.STRING(20), allowNull: false },
  email: { type: DataTypes.STRING(100) },
  wechat: { type: DataTypes.STRING(50) },
  visit_date: { type: DataTypes.DATEONLY, allowNull: false },
  visit_time: { type: DataTypes.STRING(20) },
  purpose: { type: DataTypes.STRING(100) },
  content: { type: DataTypes.TEXT },
  status: { type: DataTypes.TINYINT, defaultValue: 0 }, // 0:待确认, 1:已确认, 2:已完成, 3:已取消
  remark: { type: DataTypes.TEXT }
}, {
  tableName: 'appointments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// 轮播图模型
const Banner = sequelize.define('Banner', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(100), allowNull: false },
  image: { type: DataTypes.STRING(500), allowNull: false },
  link_type: { type: DataTypes.STRING(20) },
  link_id: { type: DataTypes.INTEGER },
  link_url: { type: DataTypes.STRING(500) },
  sort: { type: DataTypes.INTEGER, defaultValue: 0 },
  status: { type: DataTypes.TINYINT, defaultValue: 1 }
}, {
  tableName: 'banners',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// 网站配置模型
const Config = sequelize.define('Config', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  key: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  value: { type: DataTypes.TEXT },
  type: { type: DataTypes.STRING(20), defaultValue: 'string' }, // string, number, boolean, json
  group: { type: DataTypes.STRING(20), defaultValue: 'general' }, // general, contact, seo, social
  label: { type: DataTypes.STRING(100) },
  description: { type: DataTypes.STRING(255) }
}, {
  tableName: 'configs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// 产品服务模型
const Service = sequelize.define('Service', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(100), allowNull: false },
  subtitle: { type: DataTypes.STRING(200) },
  category: { type: DataTypes.STRING(50) }, // 类别: 留学申请、英语培训、竞赛规划、科研提升
  description: { type: DataTypes.TEXT },
  icon: { type: DataTypes.STRING(50) }, // 图标名称或SVG
  color: { type: DataTypes.STRING(50), defaultValue: 'from-blue-500 to-blue-600' },
  link: { type: DataTypes.STRING(200) },
  sort: { type: DataTypes.INTEGER, defaultValue: 0 },
  status: { type: DataTypes.TINYINT, defaultValue: 1 },
  features: { type: DataTypes.JSON }, // 特色功能列表
  price: { type: DataTypes.STRING(100) }, // 价格显示
  badge: { type: DataTypes.STRING(50) } // 标签如"热门"、"推荐"
}, {
  tableName: 'services',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// 头条新闻模型
const Headline = sequelize.define('Headline', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(200), allowNull: false },
  summary: { type: DataTypes.TEXT },
  cover: { type: DataTypes.STRING(500) },
  link: { type: DataTypes.STRING(500) }, // 链接地址
  link_type: { type: DataTypes.STRING(20), defaultValue: 'news' }, // news, url
  link_id: { type: DataTypes.INTEGER }, // 关联的新闻ID
  sort: { type: DataTypes.INTEGER, defaultValue: 0 },
  status: { type: DataTypes.TINYINT, defaultValue: 1 }, // 0=下架, 1=上架
  view_count: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  tableName: 'headlines',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// 留学快讯模型
const StudyNews = sequelize.define('StudyNews', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(300), allowNull: false },
  summary: { type: DataTypes.TEXT },
  content: { type: DataTypes.TEXT },
  category: { type: DataTypes.STRING(50) },
  country: { type: DataTypes.STRING(50) },
  source: { type: DataTypes.STRING(100) },
  source_url: { type: DataTypes.STRING(500) },
  publish_date: { type: DataTypes.DATEONLY },
  sort: { type: DataTypes.INTEGER, defaultValue: 0 },
  is_top: { type: DataTypes.TINYINT, defaultValue: 0 },
  status: { type: DataTypes.TINYINT, defaultValue: 1 },
  view_count: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  tableName: 'study_news',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// 竞赛模型
const Competition = sequelize.define('Competition', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  slug: { type: DataTypes.STRING(50), allowNull: false, unique: true }, // URL标识，如 amc-10
  name: { type: DataTypes.STRING(100), allowNull: false }, // 竞赛名称
  name_en: { type: DataTypes.STRING(100) }, // 英文名称
  category: { type: DataTypes.STRING(50), allowNull: false }, // math/physics/chemistry/biology/computer/business
  level: { type: DataTypes.STRING(50) }, // 难度级别：beginner/intermediate/advanced
  
  // Hero区域
  hero_tag: { type: DataTypes.STRING(50) }, // 标签，如"国际顶尖竞赛"
  hero_short_desc: { type: DataTypes.TEXT }, // 简短描述
  
  // 基本信息
  overview: { type: DataTypes.TEXT }, // 竞赛概述（HTML）
  eligibility: { type: DataTypes.TEXT }, // 参赛资格
  format: { type: DataTypes.TEXT }, // 竞赛形式（HTML）
  syllabus: { type: DataTypes.TEXT }, // 考试大纲（HTML）
  scoring: { type: DataTypes.TEXT }, // 评分标准
  
  // 时间节点（JSON数组）
  timeline: { type: DataTypes.JSON }, // [{date, title, description}]
  
  // 奖项设置
  awards: { type: DataTypes.TEXT }, // 奖项说明（HTML）
  award_details: { type: DataTypes.JSON }, // [{level, requirement, benefit}]
  
  // 历年分数线
  score_history: { type: DataTypes.JSON }, // [{year, cutoff, note}]
  
  // 备考资源
  resources: { type: DataTypes.JSON }, // [{type, title, description, link}]
  
  // 推荐书籍/资料
  recommended_books: { type: DataTypes.JSON }, // [{title, author, description}]
  
  // 统计数据
  participants: { type: DataTypes.STRING(50) }, // 参赛人数，如"30万+"
  countries: { type: DataTypes.STRING(20) }, // 参与国家数
  difficulty_score: { type: DataTypes.INTEGER }, // 难度评分 1-10
  recognition: { type: DataTypes.STRING(200) }, // 认可度说明
  
  // 图片
  logo: { type: DataTypes.STRING(500) },
  banner: { type: DataTypes.STRING(500) },
  
  // 链接
  official_url: { type: DataTypes.STRING(500) }, // 官网链接
  
  // 状态
  status: { type: DataTypes.TINYINT, defaultValue: 1 }, // 0=下架, 1=上架
  sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
  view_count: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  tableName: 'competitions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// 用户模型（微信小程序用户）
const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  openid: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  unionid: { type: DataTypes.STRING(100) },
  nickname: { type: DataTypes.STRING(100) },
  avatar: { type: DataTypes.STRING(500) },
  phone: { type: DataTypes.STRING(20) },
  gender: { type: DataTypes.TINYINT, defaultValue: 0 }, // 0=未知, 1=男, 2=女
  country: { type: DataTypes.STRING(50) },
  province: { type: DataTypes.STRING(50) },
  city: { type: DataTypes.STRING(50) },
  language: { type: DataTypes.STRING(20) },
  status: { type: DataTypes.TINYINT, defaultValue: 1 }, // 0=禁用, 1=正常
  last_login: { type: DataTypes.DATE }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// 管理员模型
const Admin = sequelize.define('Admin', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false },
  name: { type: DataTypes.STRING(50) },
  role: { type: DataTypes.STRING(20), defaultValue: 'admin' },
  status: { type: DataTypes.TINYINT, defaultValue: 1 },
  last_login: { type: DataTypes.DATE }
}, {
  tableName: 'admins',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// 学生留言/评价模型（成功案例页面轮播展示）
const Testimonial = sequelize.define('Testimonial', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  student_name: { type: DataTypes.STRING(50), allowNull: false },
  avatar: { type: DataTypes.STRING(500) }, // 头像URL
  school: { type: DataTypes.STRING(100) }, // 录取学校
  major: { type: DataTypes.STRING(100) }, // 专业
  content: { type: DataTypes.TEXT, allowNull: false }, // 留言内容
  sort_order: { type: DataTypes.INTEGER, defaultValue: 0 }, // 排序
  status: { type: DataTypes.TINYINT, defaultValue: 1 } // 0=下架 1=上架
}, {
  tableName: 'testimonials',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// ==================== 雅思/托福题库系统模型 ====================

// 1. 题目分类模型
const QuestionCategory = sequelize.define('QuestionCategory', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  exam_type: { type: DataTypes.STRING(20), allowNull: false, comment: 'ielts, toefl' },
  subject: { type: DataTypes.STRING(20), allowNull: false, comment: 'listening, reading, writing, speaking' },
  name: { type: DataTypes.STRING(50), allowNull: false },
  parent_id: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
  sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
  status: { type: DataTypes.TINYINT, defaultValue: 1 }
}, {
  tableName: 'question_categories',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// 2. 知识点标签模型
const QuestionTag = sequelize.define('QuestionTag', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  color: { type: DataTypes.STRING(20), defaultValue: '#2C5F7C' },
  sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
  status: { type: DataTypes.TINYINT, defaultValue: 1 }
}, {
  tableName: 'question_tags',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// 3. 题目模型
const Question = sequelize.define('Question', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  category_id: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
  exam_type: { type: DataTypes.STRING(20), allowNull: false },
  subject: { type: DataTypes.STRING(20), allowNull: false },
  type: { type: DataTypes.STRING(30), allowNull: false },
  title: { type: DataTypes.TEXT },
  content: { type: DataTypes.TEXT },
  options: { type: DataTypes.JSON },
  correct_answer: { type: DataTypes.TEXT },
  answer_analysis: { type: DataTypes.TEXT },
  sample_answer: { type: DataTypes.TEXT },
  difficulty: { type: DataTypes.TINYINT, defaultValue: 2 },
  score: { type: DataTypes.DECIMAL(5, 2), defaultValue: 1.00 },
  knowledge_points: { type: DataTypes.JSON },
  audio_url: { type: DataTypes.STRING(500) },
  images: { type: DataTypes.JSON },
  passage: { type: DataTypes.TEXT },
  time_limit: { type: DataTypes.INTEGER, defaultValue: 0 },
  usage_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  status: { type: DataTypes.TINYINT, defaultValue: 1 }
}, {
  tableName: 'questions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// 4. 题目标签关联模型
const QuestionTagRelation = sequelize.define('QuestionTagRelation', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  question_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  tag_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false }
}, {
  tableName: 'question_tag_relations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { unique: true, fields: ['question_id', 'tag_id'] },
    { fields: ['tag_id'] }
  ]
});

// 5. 试卷模型
const ExamPaper = sequelize.define('ExamPaper', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(200), allowNull: false },
  exam_type: { type: DataTypes.STRING(20), allowNull: false },
  subject: { type: DataTypes.STRING(20) },
  description: { type: DataTypes.TEXT },
  total_score: { type: DataTypes.DECIMAL(6, 2), defaultValue: 0 },
  time_limit: { type: DataTypes.INTEGER, defaultValue: 0 },
  question_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  is_official: { type: DataTypes.TINYINT, defaultValue: 0 },
  sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
  status: { type: DataTypes.TINYINT, defaultValue: 1 }
}, {
  tableName: 'exam_papers',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// 6. 试卷题目关联模型
const ExamPaperQuestion = sequelize.define('ExamPaperQuestion', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  paper_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  question_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
  score: { type: DataTypes.DECIMAL(5, 2), defaultValue: 1.00 }
}, {
  tableName: 'exam_paper_questions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { unique: true, fields: ['paper_id', 'question_id'] },
    { fields: ['question_id'] }
  ]
});

// 7. 用户考试记录模型
const UserExam = sequelize.define('UserExam', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  paper_id: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
  exam_type: { type: DataTypes.STRING(20) },
  subject: { type: DataTypes.STRING(20) },
  mode: { type: DataTypes.STRING(20), defaultValue: 'practice' },
  title: { type: DataTypes.STRING(200) },
  total_questions: { type: DataTypes.INTEGER, defaultValue: 0 },
  answered_questions: { type: DataTypes.INTEGER, defaultValue: 0 },
  correct_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  total_score: { type: DataTypes.DECIMAL(6, 2), defaultValue: 0 },
  user_score: { type: DataTypes.DECIMAL(6, 2), defaultValue: 0 },
  time_spent: { type: DataTypes.INTEGER, defaultValue: 0 },
  status: { type: DataTypes.TINYINT, defaultValue: 0 },
  started_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  submitted_at: { type: DataTypes.DATE }
}, {
  tableName: 'user_exams',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// 8. 用户答题记录模型
const UserAnswer = sequelize.define('UserAnswer', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  exam_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  question_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  user_answer: { type: DataTypes.TEXT },
  is_correct: { type: DataTypes.TINYINT, defaultValue: 0 },
  score: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  time_spent: { type: DataTypes.INTEGER, defaultValue: 0 },
  answer_analysis: { type: DataTypes.TEXT }
}, {
  tableName: 'user_answers',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { unique: true, fields: ['exam_id', 'question_id'] }
  ]
});

// 9. 用户错题本模型
const UserWrongQuestion = sequelize.define('UserWrongQuestion', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  question_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  wrong_count: { type: DataTypes.INTEGER, defaultValue: 1 },
  last_wrong_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  is_mastered: { type: DataTypes.TINYINT, defaultValue: 0 },
  mastered_at: { type: DataTypes.DATE }
}, {
  tableName: 'user_wrong_questions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { unique: true, fields: ['user_id', 'question_id'] }
  ]
});

// 建立关联关系
Consultant.hasMany(Case, { foreignKey: 'consultant_id', as: 'cases' });
School.hasMany(Case, { foreignKey: 'school_id', as: 'cases' });
Case.belongsTo(Consultant, { foreignKey: 'consultant_id', as: 'consultant' });
Case.belongsTo(School, { foreignKey: 'school_id', as: 'school' });

// 题库系统关联关系
QuestionCategory.hasMany(Question, { foreignKey: 'category_id', as: 'questions' });
Question.belongsTo(QuestionCategory, { foreignKey: 'category_id', as: 'category' });

Question.belongsToMany(QuestionTag, { through: QuestionTagRelation, foreignKey: 'question_id', as: 'tags' });
QuestionTag.belongsToMany(Question, { through: QuestionTagRelation, foreignKey: 'tag_id', as: 'questions' });

ExamPaper.belongsToMany(Question, { through: ExamPaperQuestion, foreignKey: 'paper_id', as: 'questions' });
Question.belongsToMany(ExamPaper, { through: ExamPaperQuestion, foreignKey: 'question_id', as: 'papers' });

User.hasMany(UserExam, { foreignKey: 'user_id', as: 'exams' });
UserExam.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

UserExam.hasMany(UserAnswer, { foreignKey: 'exam_id', as: 'answers' });
UserAnswer.belongsTo(UserExam, { foreignKey: 'exam_id', as: 'exam' });
UserAnswer.belongsTo(Question, { foreignKey: 'question_id', as: 'question' });

User.hasMany(UserWrongQuestion, { foreignKey: 'user_id', as: 'wrongQuestions' });
UserWrongQuestion.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
UserWrongQuestion.belongsTo(Question, { foreignKey: 'question_id', as: 'question' });

module.exports = {
  sequelize,
  School,
  Consultant,
  Case,
  News,
  Message,
  Appointment,
  Banner,
  Config,
  Service,
  Headline,
  Admin,
  Competition,
  StudyNews,
  Testimonial,
  User,
  // 题库系统模型
  QuestionCategory,
  QuestionTag,
  Question,
  QuestionTagRelation,
  ExamPaper,
  ExamPaperQuestion,
  UserExam,
  UserAnswer,
  UserWrongQuestion
};
