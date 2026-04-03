const express = require('express');
const router = express.Router();
const { Banner } = require('../models');

// 获取轮播图列表（公开）
router.get('/', async (req, res) => {
  try {
    const banners = await Banner.findAll({
      where: { status: 1 },
      order: [['sort', 'ASC'], ['id', 'DESC']]
    });
    
    res.json({ success: true, data: banners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取轮播图列表（管理后台）
router.get('/admin', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Banner.findAndCountAll({
      order: [['sort', 'ASC'], ['id', 'DESC']],
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

// 创建轮播图
router.post('/', async (req, res) => {
  try {
    const banner = await Banner.create(req.body);
    res.json({ success: true, data: banner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 更新轮播图
router.put('/:id', async (req, res) => {
  try {
    const banner = await Banner.findByPk(req.params.id);
    
    if (!banner) {
      return res.status(404).json({ success: false, message: '轮播图不存在' });
    }
    
    await banner.update(req.body);
    
    res.json({ success: true, data: banner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 删除轮播图
router.delete('/:id', async (req, res) => {
  try {
    const banner = await Banner.findByPk(req.params.id);
    
    if (!banner) {
      return res.status(404).json({ success: false, message: '轮播图不存在' });
    }
    
    await banner.destroy();
    
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
