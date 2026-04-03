const express = require('express');
const router = express.Router();
const { School } = require('../models');

// 获取学校列表
router.get('/', async (req, res) => {
  try {
    const { country, page = 1, limit = 10 } = req.query;
    const where = { status: 1 };
    
    if (country) {
      where.country = country;
    }
    
    const offset = (page - 1) * limit;
    
    const { count, rows } = await School.findAndCountAll({
      where,
      order: [['rank', 'ASC'], ['id', 'DESC']],
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

// 获取学校详情
router.get('/:id', async (req, res) => {
  try {
    const school = await School.findByPk(req.params.id);
    
    if (!school) {
      return res.status(404).json({ success: false, message: '学校不存在' });
    }
    
    // 增加浏览量
    await school.increment('view_count');
    
    res.json({ success: true, data: school });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取热门学校
router.get('/hot/list', async (req, res) => {
  try {
    const schools = await School.findAll({
      where: { status: 1 },
      order: [['view_count', 'DESC'], ['rank', 'ASC']],
      limit: 6
    });
    
    res.json({ success: true, data: schools });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取国家列表
router.get('/options/countries', async (req, res) => {
  try {
    const countries = await School.findAll({
      where: { status: 1 },
      attributes: ['country'],
      group: ['country'],
      raw: true
    });
    
    res.json({ 
      success: true, 
      data: countries.map(c => c.country).filter(Boolean) 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
