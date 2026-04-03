const express = require('express');
const router = express.Router();
const { Message } = require('../models');

// 提交留言
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, country, message } = req.body;
    
    if (!name || !message) {
      return res.status(400).json({ 
        success: false, 
        message: '姓名和留言内容不能为空' 
      });
    }
    
    const newMessage = await Message.create({
      name,
      phone,
      email,
      country,
      message,
      status: 0
    });
    
    res.json({ 
      success: true, 
      message: '留言提交成功，我们会尽快与您联系',
      data: newMessage 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取留言列表（管理后台）
router.get('/', async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const where = {};
    
    if (status !== undefined) {
      where.status = parseInt(status);
    }
    
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Message.findAndCountAll({
      where,
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

// 更新留言状态
router.put('/:id', async (req, res) => {
  try {
    const { status, remark } = req.body;
    const message = await Message.findByPk(req.params.id);
    
    if (!message) {
      return res.status(404).json({ success: false, message: '留言不存在' });
    }
    
    if (status !== undefined) {
      message.status = status;
    }
    if (remark !== undefined) {
      message.remark = remark;
    }
    
    await message.save();
    
    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 删除留言
router.delete('/:id', async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    
    if (!message) {
      return res.status(404).json({ success: false, message: '留言不存在' });
    }
    
    await message.destroy();
    
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
