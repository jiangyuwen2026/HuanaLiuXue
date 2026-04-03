const express = require('express');
const router = express.Router();
const { Appointment } = require('../models');

// 提交预约申请
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, wechat, visit_date, visit_time, purpose, content } = req.body;
    
    // 基本验证
    if (!name || !phone || !visit_date) {
      return res.status(400).json({
        success: false,
        message: '请填写必填项：姓名、电话、到访日期'
      });
    }
    
    // 创建预约
    const appointment = await Appointment.create({
      name,
      phone,
      email,
      wechat,
      visit_date,
      visit_time,
      purpose,
      content,
      status: 0 // 待确认
    });
    
    res.json({
      success: true,
      message: '预约提交成功，我们将尽快与您联系确认',
      data: appointment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取预约列表（管理后台）
router.get('/admin', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, startDate, endDate } = req.query;
    const where = {};
    
    if (status !== undefined) {
      where.status = status;
    }
    
    if (startDate && endDate) {
      where.visit_date = {
        [require('sequelize').Op.between]: [startDate, endDate]
      };
    }
    
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Appointment.findAndCountAll({
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

// 更新预约状态
router.put('/admin/:id', async (req, res) => {
  try {
    const { status, remark } = req.body;
    const appointment = await Appointment.findByPk(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: '预约不存在' });
    }
    
    await appointment.update({ status, remark });
    
    res.json({
      success: true,
      message: '更新成功',
      data: appointment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 删除预约
router.delete('/admin/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: '预约不存在' });
    }
    
    await appointment.destroy();
    
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取预约统计
router.get('/admin/stats', async (req, res) => {
  try {
    const total = await Appointment.count();
    const pending = await Appointment.count({ where: { status: 0 } });
    const confirmed = await Appointment.count({ where: { status: 1 } });
    const completed = await Appointment.count({ where: { status: 2 } });
    const cancelled = await Appointment.count({ where: { status: 3 } });
    
    // 今日预约
    const today = new Date().toISOString().split('T')[0];
    const todayCount = await Appointment.count({
      where: { visit_date: today }
    });
    
    res.json({
      success: true,
      data: {
        total,
        pending,
        confirmed,
        completed,
        cancelled,
        today: todayCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
