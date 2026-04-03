const express = require('express');
const router = express.Router();
const { News } = require('../models');

// 获取新闻列表
router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const where = { status: 1 };
    
    if (category) {
      where.category = category;
    }
    
    const offset = (page - 1) * limit;
    
    const { count, rows } = await News.findAndCountAll({
      where,
      order: [['published_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.json({
      success: true,
      data: {
        list: rows,
        total: count,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取新闻详情
router.get('/:id', async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);
    
    if (!news) {
      return res.status(404).json({ success: false, message: '新闻不存在' });
    }
    
    // 增加浏览量
    await news.increment('view_count');
    
    res.json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取热门新闻
router.get('/hot/list', async (req, res) => {
  try {
    const news = await News.findAll({
      where: { status: 1 },
      order: [['view_count', 'DESC'], ['published_at', 'DESC']],
      limit: 6
    });
    
    res.json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取新闻分类
router.get('/options/categories', async (req, res) => {
  try {
    const categories = await News.findAll({
      where: { status: 1 },
      attributes: ['category'],
      group: ['category'],
      raw: true
    });
    
    res.json({ 
      success: true, 
      data: categories.map(c => c.category).filter(Boolean) 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取推荐新闻（公开API）
router.get('/recommended/list', async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    
    const news = await News.findAll({
      where: { 
        status: 1,
        is_recommended: 1 
      },
      order: [
        ['recommend_sort', 'ASC'],
        ['published_at', 'DESC']
      ],
      limit: parseInt(limit)
    });
    
    res.json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 设置新闻推荐状态（管理后台）
router.put('/admin/:id/recommend', async (req, res) => {
  try {
    const { is_recommended, recommend_sort } = req.body;
    const news = await News.findByPk(req.params.id);
    
    if (!news) {
      return res.status(404).json({ success: false, message: '新闻不存在' });
    }
    
    await news.update({ 
      is_recommended: is_recommended ? 1 : 0,
      recommend_sort: recommend_sort || 0
    });
    
    res.json({ 
      success: true, 
      message: is_recommended ? '已设为推荐' : '已取消推荐',
      data: news 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 批量设置推荐（管理后台）
router.post('/admin/batch-recommend', async (req, res) => {
  try {
    const { ids, is_recommended } = req.body;
    
    await News.update(
      { is_recommended: is_recommended ? 1 : 0 },
      { where: { id: ids } }
    );
    
    res.json({ 
      success: true, 
      message: is_recommended ? '批量设置推荐成功' : '批量取消推荐成功'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
