const express = require('express');
const router = express.Router();
const { School, Consultant, Case, News, Message, Banner, Admin } = require('../models');

// 通用CRUD中间件
const wrapAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// ===== 学校管理 =====
router.get('/schools', wrapAsync(async (req, res) => {
  const { page = 1, limit = 10, status, country } = req.query;
  const where = {};
  if (status !== undefined) where.status = parseInt(status);
  if (country) where.country = country;
  
  const { count, rows } = await School.findAndCountAll({
    where,
    order: [['id', 'DESC']],
    limit: parseInt(limit),
    offset: (parseInt(page) - 1) * parseInt(limit)
  });
  res.json({ success: true, data: { list: rows, total: count } });
}));

router.post('/schools', wrapAsync(async (req, res) => {
  const school = await School.create(req.body);
  res.json({ success: true, data: school });
}));

router.put('/schools/:id', wrapAsync(async (req, res) => {
  const school = await School.findByPk(req.params.id);
  if (!school) return res.status(404).json({ success: false, message: '不存在' });
  await school.update(req.body);
  res.json({ success: true, data: school });
}));

router.delete('/schools/:id', wrapAsync(async (req, res) => {
  const school = await School.findByPk(req.params.id);
  if (!school) return res.status(404).json({ success: false, message: '不存在' });
  await school.destroy();
  res.json({ success: true, message: '删除成功' });
}));

// ===== 顾问管理 =====
router.get('/consultants', wrapAsync(async (req, res) => {
  const { page = 1, limit = 10, status, region, service_type } = req.query;
  const where = {};
  if (status !== undefined) where.status = parseInt(status);
  if (region) where.region = region;
  if (service_type) where.service_type = service_type;
  
  const { count, rows } = await Consultant.findAndCountAll({
    where,
    order: [['id', 'DESC']],
    limit: parseInt(limit),
    offset: (parseInt(page) - 1) * parseInt(limit)
  });
  res.json({ success: true, data: { list: rows, total: count } });
}));

router.post('/consultants', wrapAsync(async (req, res) => {
  const consultant = await Consultant.create(req.body);
  res.json({ success: true, data: consultant });
}));

router.put('/consultants/:id', wrapAsync(async (req, res) => {
  const consultant = await Consultant.findByPk(req.params.id);
  if (!consultant) return res.status(404).json({ success: false, message: '不存在' });
  await consultant.update(req.body);
  res.json({ success: true, data: consultant });
}));

router.delete('/consultants/:id', wrapAsync(async (req, res) => {
  const consultant = await Consultant.findByPk(req.params.id);
  if (!consultant) return res.status(404).json({ success: false, message: '不存在' });
  await consultant.destroy();
  res.json({ success: true, message: '删除成功' });
}));

// ===== 案例管理 =====
router.get('/cases', wrapAsync(async (req, res) => {
  const { page = 1, limit = 10, status, target_country } = req.query;
  const where = {};
  if (status !== undefined) where.status = parseInt(status);
  if (target_country) where.target_country = target_country;
  
  const { count, rows } = await Case.findAndCountAll({
    where,
    include: [
      { model: Consultant, as: 'consultant', attributes: ['id', 'name'] },
      { model: School, as: 'school', attributes: ['id', 'name_cn'] }
    ],
    order: [['id', 'DESC']],
    limit: parseInt(limit),
    offset: (parseInt(page) - 1) * parseInt(limit)
  });
  res.json({ success: true, data: { list: rows, total: count } });
}));

router.post('/cases', wrapAsync(async (req, res) => {
  const c = await Case.create(req.body);
  res.json({ success: true, data: c });
}));

router.put('/cases/:id', wrapAsync(async (req, res) => {
  const c = await Case.findByPk(req.params.id);
  if (!c) return res.status(404).json({ success: false, message: '不存在' });
  await c.update(req.body);
  res.json({ success: true, data: c });
}));

router.delete('/cases/:id', wrapAsync(async (req, res) => {
  const c = await Case.findByPk(req.params.id);
  if (!c) return res.status(404).json({ success: false, message: '不存在' });
  await c.destroy();
  res.json({ success: true, message: '删除成功' });
}));

// ===== 新闻管理 =====
router.get('/news', wrapAsync(async (req, res) => {
  const { page = 1, limit = 10, status, category } = req.query;
  const where = {};
  if (status !== undefined) where.status = parseInt(status);
  if (category) where.category = category;
  
  const { count, rows } = await News.findAndCountAll({
    where,
    order: [['id', 'DESC']],
    limit: parseInt(limit),
    offset: (parseInt(page) - 1) * parseInt(limit)
  });
  res.json({ success: true, data: { list: rows, total: count } });
}));

router.post('/news', wrapAsync(async (req, res) => {
  const news = await News.create(req.body);
  res.json({ success: true, data: news });
}));

router.put('/news/:id', wrapAsync(async (req, res) => {
  const news = await News.findByPk(req.params.id);
  if (!news) return res.status(404).json({ success: false, message: '不存在' });
  await news.update(req.body);
  res.json({ success: true, data: news });
}));

router.delete('/news/:id', wrapAsync(async (req, res) => {
  const news = await News.findByPk(req.params.id);
  if (!news) return res.status(404).json({ success: false, message: '不存在' });
  await news.destroy();
  res.json({ success: true, message: '删除成功' });
}));

// ===== 统计数据 =====
router.get('/stats', wrapAsync(async (req, res) => {
  const [
    schoolCount,
    consultantCount,
    caseCount,
    newsCount,
    messageCount,
    pendingMessageCount
  ] = await Promise.all([
    School.count({ where: { status: 1 } }),
    Consultant.count({ where: { status: 1 } }),
    Case.count({ where: { status: 1 } }),
    News.count({ where: { status: 1 } }),
    Message.count(),
    Message.count({ where: { status: 0 } })
  ]);
  
  res.json({
    success: true,
    data: {
      schools: schoolCount,
      consultants: consultantCount,
      cases: caseCount,
      news: newsCount,
      messages: messageCount,
      pendingMessages: pendingMessageCount
    }
  });
}));

module.exports = router;
