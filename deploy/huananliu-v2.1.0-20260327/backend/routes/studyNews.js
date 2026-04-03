const express = require('express');
const router = express.Router();
const { StudyNews } = require('../models');
const { Op } = require('sequelize');

// 获取快讯列表（公开API）
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, country } = req.query;
    const offset = (page - 1) * limit;
    
    const where = { status: 1 };
    if (category) where.category = category;
    if (country) where.country = country;
    
    const { count, rows } = await StudyNews.findAndCountAll({
      where,
      order: [
        ['is_top', 'DESC'],
        ['sort', 'DESC'],
        ['publish_date', 'DESC'],
        ['id', 'DESC']
      ],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    const list = rows.map(item => formatNewsItem(item));
    
    res.json({
      success: true,
      data: {
        list,
        total: count,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取最新快讯（公开API，用于首页）
router.get('/latest', async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const rows = await StudyNews.findAll({
      where: { status: 1 },
      order: [
        ['is_top', 'DESC'],
        ['sort', 'DESC'],
        ['publish_date', 'DESC'],
        ['id', 'DESC']
      ],
      limit: parseInt(limit)
    });
    
    const list = rows.map(item => formatNewsItem(item));
    
    res.json({ success: true, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取快讯详情（公开API）
router.get('/detail/:id', async (req, res) => {
  try {
    const news = await StudyNews.findByPk(req.params.id);
    
    if (!news || news.status !== 1) {
      return res.status(404).json({ success: false, message: '快讯不存在' });
    }
    
    await news.update({ view_count: news.view_count + 1 });
    
    res.json({ success: true, data: formatNewsItem(news, true) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 管理后台API - 获取列表
router.get('/admin/list', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, status } = req.query;
    const offset = (page - 1) * limit;
    
    const where = {};
    if (search) {
      where.title = { [Op.like]: `%${search}%` };
    }
    if (category) where.category = category;
    if (status !== undefined && status !== '') where.status = parseInt(status);
    
    const { count, rows } = await StudyNews.findAndCountAll({
      where,
      order: [
        ['is_top', 'DESC'],
        ['sort', 'DESC'],
        ['publish_date', 'DESC'],
        ['id', 'DESC']
      ],
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

// 管理后台API - 获取详情
router.get('/admin/detail/:id', async (req, res) => {
  try {
    const news = await StudyNews.findByPk(req.params.id);
    
    if (!news) {
      return res.status(404).json({ success: false, message: '快讯不存在' });
    }
    
    res.json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 管理后台API - 创建快讯
router.post('/admin', async (req, res) => {
  try {
    const { title, summary, content, category, country, source, source_url, publish_date, sort, is_top, status } = req.body;
    
    if (!title) {
      return res.status(400).json({ success: false, message: '标题不能为空' });
    }
    
    const news = await StudyNews.create({
      title,
      summary,
      content,
      category,
      country,
      source,
      source_url,
      publish_date: publish_date || new Date(),
      sort: sort || 0,
      is_top: is_top || 0,
      status: status !== undefined ? status : 1
    });
    
    res.json({ success: true, message: '创建成功', data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 管理后台API - 更新快讯
router.put('/admin/:id', async (req, res) => {
  try {
    const news = await StudyNews.findByPk(req.params.id);
    
    if (!news) {
      return res.status(404).json({ success: false, message: '快讯不存在' });
    }
    
    const { title, summary, content, category, country, source, source_url, publish_date, sort, is_top, status } = req.body;
    
    await news.update({
      title: title || news.title,
      summary,
      content,
      category,
      country,
      source,
      source_url,
      publish_date,
      sort,
      is_top,
      status
    });
    
    res.json({ success: true, message: '更新成功', data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 管理后台API - 删除快讯
router.delete('/admin/:id', async (req, res) => {
  try {
    const news = await StudyNews.findByPk(req.params.id);
    
    if (!news) {
      return res.status(404).json({ success: false, message: '快讯不存在' });
    }
    
    await news.destroy();
    
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 管理后台API - 切换置顶状态
router.patch('/admin/:id/toggle-top', async (req, res) => {
  try {
    const news = await StudyNews.findByPk(req.params.id);
    
    if (!news) {
      return res.status(404).json({ success: false, message: '快讯不存在' });
    }
    
    const newTopStatus = news.is_top === 1 ? 0 : 1;
    await news.update({ is_top: newTopStatus });
    
    res.json({ 
      success: true, 
      message: newTopStatus === 1 ? '已置顶' : '已取消置顶',
      data: { is_top: newTopStatus }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 格式化快讯数据
function formatNewsItem(item, isDetail = false) {
  const data = item.toJSON ? item.toJSON() : item;
  
  const publishDate = new Date(data.publish_date || data.created_at);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (publishDate >= today) {
    data.time_display = data.created_at ? 
      new Date(data.created_at).toTimeString().slice(0, 5) : '今日';
    data.date_display = '今天';
  } else if (publishDate >= yesterday) {
    data.time_display = '昨天';
    data.date_display = '昨天';
  } else {
    data.time_display = (publishDate.getMonth() + 1) + '-' + publishDate.getDate();
    data.date_display = (publishDate.getMonth() + 1) + '月' + publishDate.getDate() + '日';
  }
  
  return data;
}

module.exports = router;
