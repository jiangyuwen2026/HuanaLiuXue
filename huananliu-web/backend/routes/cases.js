const express = require('express');
const router = express.Router();
const { Case, Consultant, School } = require('../models');

// 获取案例列表
router.get('/', async (req, res) => {
  try {
    const { country, page = 1, limit = 10 } = req.query;
    const where = { status: 1 };
    
    if (country) {
      where.target_country = country;
    }
    
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Case.findAndCountAll({
      where,
      include: [
        { model: Consultant, as: 'consultant', attributes: ['id', 'name', 'avatar', 'title'] },
        { model: School, as: 'school', attributes: ['id', 'name_cn', 'name_en'] }
      ],
      order: [['created_at', 'DESC']],
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

// 获取案例详情
router.get('/:id', async (req, res) => {
  try {
    const c = await Case.findByPk(req.params.id, {
      include: [
        { model: Consultant, as: 'consultant' },
        { model: School, as: 'school' }
      ]
    });
    
    if (!c) {
      return res.status(404).json({ success: false, message: '案例不存在' });
    }
    
    // 增加浏览量
    await c.increment('view_count');
    
    res.json({ success: true, data: c });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取热门案例
router.get('/hot/list', async (req, res) => {
  try {
    const cases = await Case.findAll({
      where: { status: 1 },
      include: [
        { model: Consultant, as: 'consultant', attributes: ['id', 'name', 'avatar'] },
        { model: School, as: 'school', attributes: ['id', 'name_cn'] }
      ],
      order: [['view_count', 'DESC']],
      limit: 6
    });
    
    res.json({ success: true, data: cases });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取明星案例列表（公开API）
router.get('/featured/list', async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    
    const cases = await Case.findAll({
      where: { 
        status: 1,
        is_featured: 1 
      },
      include: [
        { model: Consultant, as: 'consultant', attributes: ['id', 'name', 'avatar'] },
        { model: School, as: 'school', attributes: ['id', 'name_cn', 'name_en'] }
      ],
      order: [
        ['feature_sort', 'ASC'],
        ['created_at', 'DESC']
      ],
      limit: parseInt(limit)
    });
    
    // 格式化返回数据，适配前端展示
    const formattedCases = cases.map(c => ({
      id: c.id,
      name: c.student_name || '同学',
      avatar: c.avatar || '👨‍🎓',
      school: c.school?.name_cn || c.admission_result?.split('·')[0] || '名校',
      major: c.target_major || c.admission_result?.split('·')[1] || '热门专业',
      result: c.scholarship || '成功录取',
      bg: c.feature_bg || 'from-emerald-500 to-teal-600',
      score: c.original_school || '优秀背景',
      highlight: c.feature_highlight || '成功案例',
      cover: c.cover,
      target_country: c.target_country
    }));
    
    res.json({ success: true, data: formattedCases });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 设置案例明星状态（管理后台）
router.put('/admin/:id/featured', async (req, res) => {
  try {
    const { is_featured, feature_sort, feature_highlight, feature_bg } = req.body;
    const c = await Case.findByPk(req.params.id);
    
    if (!c) {
      return res.status(404).json({ success: false, message: '案例不存在' });
    }
    
    await c.update({ 
      is_featured: is_featured ? 1 : 0,
      feature_sort: feature_sort || 0,
      feature_highlight: feature_highlight || c.feature_highlight,
      feature_bg: feature_bg || c.feature_bg
    });
    
    res.json({ 
      success: true, 
      message: is_featured ? '已设为明星案例' : '已取消明星案例',
      data: c 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 批量设置明星案例（管理后台）
router.post('/admin/batch-featured', async (req, res) => {
  try {
    const { ids, is_featured } = req.body;
    
    await Case.update(
      { is_featured: is_featured ? 1 : 0 },
      { where: { id: ids } }
    );
    
    res.json({ 
      success: true, 
      message: is_featured ? '批量设置明星案例成功' : '批量取消明星案例成功'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
