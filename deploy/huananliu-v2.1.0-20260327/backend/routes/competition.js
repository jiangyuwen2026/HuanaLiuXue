const express = require('express');
const router = express.Router();
const { Competition } = require('../models');
const { Op } = require('sequelize');

// 获取竞赛列表（前台）
router.get('/list', async (req, res) => {
  try {
    const { category, level, page = 1, pageSize = 20 } = req.query;
    
    const where = { status: 1 };
    if (category) where.category = category;
    if (level) where.level = level;
    
    const competitions = await Competition.findAndCountAll({
      where,
      order: [['sort_order', 'ASC'], ['created_at', 'DESC']],
      offset: (page - 1) * pageSize,
      limit: parseInt(pageSize),
      attributes: [
        'id', 'slug', 'name', 'name_en', 'category', 'level',
        'hero_tag', 'hero_short_desc', 'logo', 'difficulty_score',
        'participants', 'recognition', 'sort_order'
      ]
    });
    
    res.json({
      success: true,
      data: competitions.rows,
      pagination: {
        total: competitions.count,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      }
    });
  } catch (error) {
    console.error('获取竞赛列表失败:', error);
    res.status(500).json({ success: false, message: '获取失败' });
  }
});

// 获取竞赛详情（前台）
router.get('/detail/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const competition = await Competition.findOne({
      where: { slug, status: 1 }
    });
    
    if (!competition) {
      return res.status(404).json({ success: false, message: '竞赛不存在' });
    }
    
    // 增加浏览量
    await competition.increment('view_count');
    
    res.json({ success: true, data: competition });
  } catch (error) {
    console.error('获取竞赛详情失败:', error);
    res.status(500).json({ success: false, message: '获取失败' });
  }
});

// 获取分类列表
router.get('/categories', async (req, res) => {
  try {
    const categories = [
      { id: 'math', name: '数学竞赛', icon: '🔢', color: 'blue' },
      { id: 'physics', name: '物理竞赛', icon: '⚛️', color: 'purple' },
      { id: 'chemistry', name: '化学竞赛', icon: '⚗️', color: 'green' },
      { id: 'biology', name: '生物竞赛', icon: '🧬', color: 'red' },
      { id: 'computer', name: '计算机竞赛', icon: '💻', color: 'indigo' },
      { id: 'business', name: '商科竞赛', icon: '📊', color: 'orange' }
    ];
    
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('获取分类失败:', error);
    res.status(500).json({ success: false, message: '获取失败' });
  }
});

// ===== 后台管理接口 =====

// 获取竞赛列表（后台）
router.get('/admin/list', async (req, res) => {
  try {
    const { keyword, category, status, page = 1, pageSize = 20 } = req.query;
    
    const where = {};
    if (keyword) {
      where[Op.or] = [
        { name: { [Op.like]: `%${keyword}%` } },
        { slug: { [Op.like]: `%${keyword}%` } }
      ];
    }
    if (category) where.category = category;
    if (status !== undefined) where.status = parseInt(status);
    
    const competitions = await Competition.findAndCountAll({
      where,
      order: [['sort_order', 'ASC'], ['created_at', 'DESC']],
      offset: (page - 1) * pageSize,
      limit: parseInt(pageSize)
    });
    
    res.json({
      success: true,
      data: competitions.rows,
      pagination: {
        total: competitions.count,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      }
    });
  } catch (error) {
    console.error('获取竞赛列表失败:', error);
    res.status(500).json({ success: false, message: '获取失败' });
  }
});

// 获取单个竞赛（后台）
router.get('/admin/detail/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const competition = await Competition.findByPk(id);
    
    if (!competition) {
      return res.status(404).json({ success: false, message: '竞赛不存在' });
    }
    
    res.json({ success: true, data: competition });
  } catch (error) {
    console.error('获取竞赛详情失败:', error);
    res.status(500).json({ success: false, message: '获取失败' });
  }
});

// 创建竞赛
router.post('/admin/create', async (req, res) => {
  try {
    const data = req.body;
    
    // 检查 slug 是否已存在
    const existing = await Competition.findOne({ where: { slug: data.slug } });
    if (existing) {
      return res.status(400).json({ success: false, message: '竞赛标识已存在' });
    }
    
    const competition = await Competition.create(data);
    
    res.json({ success: true, data: competition, message: '创建成功' });
  } catch (error) {
    console.error('创建竞赛失败:', error);
    res.status(500).json({ success: false, message: '创建失败' });
  }
});

// 更新竞赛
router.put('/admin/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    const competition = await Competition.findByPk(id);
    if (!competition) {
      return res.status(404).json({ success: false, message: '竞赛不存在' });
    }
    
    // 如果修改了 slug，检查是否与其他冲突
    if (data.slug && data.slug !== competition.slug) {
      const existing = await Competition.findOne({ 
        where: { 
          slug: data.slug,
          id: { [Op.ne]: id }
        } 
      });
      if (existing) {
        return res.status(400).json({ success: false, message: '竞赛标识已存在' });
      }
    }
    
    await competition.update(data);
    
    res.json({ success: true, data: competition, message: '更新成功' });
  } catch (error) {
    console.error('更新竞赛失败:', error);
    res.status(500).json({ success: false, message: '更新失败' });
  }
});

// 删除竞赛
router.delete('/admin/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const competition = await Competition.findByPk(id);
    if (!competition) {
      return res.status(404).json({ success: false, message: '竞赛不存在' });
    }
    
    await competition.destroy();
    
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    console.error('删除竞赛失败:', error);
    res.status(500).json({ success: false, message: '删除失败' });
  }
});

// 更新竞赛状态
router.put('/admin/status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const competition = await Competition.findByPk(id);
    if (!competition) {
      return res.status(404).json({ success: false, message: '竞赛不存在' });
    }
    
    await competition.update({ status });
    
    res.json({ 
      success: true, 
      message: status === 1 ? '已上架' : '已下架'
    });
  } catch (error) {
    console.error('更新状态失败:', error);
    res.status(500).json({ success: false, message: '更新失败' });
  }
});

// 更新排序
router.put('/admin/sort/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { sort_order } = req.body;
    
    const competition = await Competition.findByPk(id);
    if (!competition) {
      return res.status(404).json({ success: false, message: '竞赛不存在' });
    }
    
    await competition.update({ sort_order });
    
    res.json({ success: true, message: '排序更新成功' });
  } catch (error) {
    console.error('更新排序失败:', error);
    res.status(500).json({ success: false, message: '更新失败' });
  }
});

module.exports = router;
