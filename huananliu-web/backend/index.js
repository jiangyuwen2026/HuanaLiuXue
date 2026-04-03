/**
 * ============================================================================
 * 华南留学后端API服务 - 版本标记
 * ============================================================================
 * @version      2.1.0-DEVELOPING
 * @release_date 2026-03-27
 * @status       DEVELOPING - v2.1.0 开发中
 * @description  华南留学后端API服务 - Express + Sequelize + MySQL
 * @tech_stack   Node.js + Express + Sequelize ORM + MySQL + JWT
 * ============================================================================
 * 修改历史：
 * - v1.0.0-FINAL (2026-03-25): 功能完成冻结版本
 * - v2.1.0-DEVELOPING (2026-03-27): 
 *   * 新增后台用户管理功能
 *   * 新增注册客户管理功能
 * ============================================================================
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const { sequelize } = require('./models');

// 导入路由
const schoolsRouter = require('./routes/schools');
const consultantsRouter = require('./routes/consultants');
const casesRouter = require('./routes/cases');
const newsRouter = require('./routes/news');
const messagesRouter = require('./routes/messages');
const appointmentsRouter = require('./routes/appointments');
const bannersRouter = require('./routes/banners');
const { router: configRouter, initDefaultConfigs } = require('./routes/config');
const { router: servicesRouter, initDefaultServices } = require('./routes/services');
const headlinesRouter = require('./routes/headlines');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const adminUsersRouter = require('./routes/admin-users');
const customersRouter = require('./routes/customers');
const uploadRouter = require('./routes/upload');
const competitionRouter = require('./routes/competition');
const aboutRouter = require('./routes/about');
const studyNewsRouter = require('./routes/studyNews');
const { router: testimonialsRouter, initDefaultTestimonials } = require('./routes/testimonials');

// 雅思/托福题库系统路由
const questionsRouter = require('./routes/questions');
const examRouter = require('./routes/exam');
const examPapersRouter = require('./routes/examPapers');

const app = express();

// 中间件
app.use(cors({ origin: config.server.corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 请求日志
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// 公开API路由
app.use('/api/schools', schoolsRouter);
app.use('/api/consultants', consultantsRouter);
app.use('/api/cases', casesRouter);
app.use('/api/news', newsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/banners', bannersRouter);
app.use('/api/config', configRouter);
app.use('/api/services', servicesRouter);
app.use('/api/headlines', headlinesRouter);
console.log('✅ 配置路由已加载: /api/config');
console.log('✅ 服务路由已加载: /api/services');
console.log('✅ 头条路由已加载: /api/headlines');

// 小程序用户认证路由
app.use('/api/auth', authRouter);
console.log('✅ 认证路由已加载: /api/auth');

// 管理后台API路由
app.use('/api/admin/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/admin/users', adminUsersRouter);
app.use('/api/admin/customers', customersRouter);
console.log('✅ 后台用户管理路由已加载: /api/admin/users');
console.log('✅ 客户管理路由已加载: /api/admin/customers');

// 文件上传路由
app.use('/api/upload', uploadRouter);

// 竞赛相关路由
app.use('/api/competitions', competitionRouter);
console.log('✅ 竞赛路由已加载: /api/competitions');

// 关于我们路由
app.use('/api/about', aboutRouter);
console.log('✅ 关于我们路由已加载: /api/about');

// 留学快讯路由
app.use('/api/study-news', studyNewsRouter);
console.log('✅ 留学快讯路由已加载: /api/study-news');

// 学生留言路由
app.use('/api/testimonials', testimonialsRouter);
console.log('✅ 留言路由已加载: /api/testimonials');

// 雅思/托福题库系统路由
app.use('/api/questions', questionsRouter);
app.use('/api/exam', examRouter);
app.use('/api/exam-papers', examPapersRouter);
console.log('✅ 题库路由已加载: /api/questions');
console.log('✅ 考试路由已加载: /api/exam');
console.log('✅ 试卷路由已加载: /api/exam-papers');

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, message: err.message });
});

// 启动服务器
const PORT = config.server.port;

async function startServer() {
  try {
    // 测试数据库连接
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功');
    
    // 同步模型（仅开发环境）
    await sequelize.sync({ alter: true });
    console.log('✅ 数据库模型同步完成');
    
    // 初始化默认配置
    await initDefaultConfigs();
    console.log('✅ 网站配置初始化完成');
    
    // 初始化默认服务
    await initDefaultServices();
    console.log('✅ 服务数据初始化完成');
    
    // 初始化默认留言
    await initDefaultTestimonials();
    console.log('✅ 留言数据初始化完成');
    
    app.listen(PORT, () => {
      console.log(`🚀 华南留学后端服务已启动: http://localhost:${PORT}`);
      console.log(`📚 API文档: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ 启动失败:', error);
    process.exit(1);
  }
}

startServer();
