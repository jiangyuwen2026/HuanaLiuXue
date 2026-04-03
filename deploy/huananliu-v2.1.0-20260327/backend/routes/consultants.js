const express = require('express');
const router = express.Router();
const { Consultant, Case } = require('../models');

// 获取顾问列表
router.get('/', async (req, res) => {
  try {
    const { service_type, region, page = 1, limit = 10 } = req.query;
    const where = { status: 1 };
    
    if (service_type) {
      where.service_type = service_type;
    }
    if (region) {
      where.region = region;
    }
    
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Consultant.findAndCountAll({
      where,
      order: [['rating', 'DESC'], ['success_cases', 'DESC']],
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

// 获取热门顾问 - 必须放在 /:id 之前
router.get('/hot/list', async (req, res) => {
  try {
    const consultants = await Consultant.findAll({
      where: { status: 1 },
      order: [['rating', 'DESC'], ['success_cases', 'DESC']],
      limit: 6
    });
    
    res.json({ success: true, data: consultants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取顾问详情 - 放在最后
router.get('/:id', async (req, res) => {
  try {
    const consultant = await Consultant.findByPk(req.params.id, {
      include: [{
        model: Case,
        as: 'cases',
        where: { status: 1 },
        required: false,
        limit: 5
      }]
    });
    
    if (!consultant) {
      return res.status(404).json({ success: false, message: '顾问不存在' });
    }
    
    res.json({ success: true, data: consultant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
