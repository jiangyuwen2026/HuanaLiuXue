const express = require('express');
const router = express.Router();
const { Headline, News } = require('../models');

// 获取头条列表（公开 - 只返回上架的）
router.get('/', async (req, res) => {
  try {
    const headlines = await Headline.findAll({
      where: { status: 1 },
      order: [['sort', 'ASC'], ['created_at', 'DESC']],
      limit: 5
    });
    res.json({ success: true, data: headlines });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取头条列表（管理后台 - 返回全部）
router.get('/admin', async (req, res) => {
  try {
    const headlines = await Headline.findAll({
      order: [['sort', 'ASC'], ['created_at', 'DESC']]
    });
    res.json({ success: true, data: headlines });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取单个头条
router.get('/admin/:id', async (req, res) => {
  try {
    const headline = await Headline.findByPk(req.params.id);
    if (!headline) {
      return res.status(404).json({ success: false, message: '头条不存在' });
    }
    res.json({ success: true, data: headline });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 创建头条
router.post('/admin', async (req, res) => {
  try {
    const headline = await Headline.create(req.body);
    res.json({ success: true, data: headline, message: '创建成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 更新头条
router.put('/admin/:id', async (req, res) => {
  try {
    const headline = await Headline.findByPk(req.params.id);
    if (!headline) {
      return res.status(404).json({ success: false, message: '头条不存在' });
    }
    await headline.update(req.body);
    res.json({ success: true, data: headline, message: '更新成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 删除头条
router.delete('/admin/:id', async (req, res) => {
  try {
    const headline = await Headline.findByPk(req.params.id);
    if (!headline) {
      return res.status(404).json({ success: false, message: '头条不存在' });
    }
    await headline.destroy();
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 初始化默认头条
router.post('/admin/init', async (req, res) => {
  try {
    const count = await Headline.count();
    if (count > 0) {
      return res.json({ success: true, message: '已有头条数据，跳过初始化' });
    }
    
    const defaultHeadlines = [
      {
        title: '2025年全球留学趋势报告：亚洲留学热度持续攀升',
        summary: '最新报告显示，香港、新加坡等亚洲留学目的地申请量同比增长35%，成为越来越多中国学生的首选...',
        cover: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80',
        link_type: 'news',
        sort: 1,
        status: 1
      },
      {
        title: '英国G5名校申请：如何在个人陈述中脱颖而出',
        summary: '资深文书导师分享G5名校申请的个人陈述写作技巧，让你的申请更具竞争力...',
        cover: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80',
        link_type: 'news',
        sort: 2,
        status: 1
      },
      {
        title: '香港大学2025Fall申请开放时间公布',
        summary: '香港大学正式公布2025年秋季入学申请时间表，各学院申请截止日期有所不同...',
        cover: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80',
        link_type: 'news',
        sort: 3,
        status: 1
      }
    ];
    
    await Headline.bulkCreate(defaultHeadlines);
    res.json({ success: true, message: '初始化成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
