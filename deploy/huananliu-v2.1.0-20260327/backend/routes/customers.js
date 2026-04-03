/**
 * ============================================================================
 * 注册客户管理路由 (v2.1.0)
 * ============================================================================
 * 功能：前端注册用户管理（微信小程序用户）
 * 包括：列表、详情、启用/禁用、统计
 * ============================================================================
 */

const express = require('express');
const router = express.Router();
const { User, Appointment } = require('../models');
const { Op } = require('sequelize');

// 认证中间件
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: '未登录' });
  }
  next();
};

/**
 * 获取客户列表
 * GET /api/admin/customers
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      keyword = '', 
      status,
      hasPhone,
      startDate,
      endDate
    } = req.query;
    
    const where = {};
    
    // 关键词搜索（昵称、手机号、openid）
    if (keyword) {
      where[Op.or] = [
        { nickname: { [Op.like]: `%${keyword}%` } },
        { phone: { [Op.like]: `%${keyword}%` } },
        { openid: { [Op.like]: `%${keyword}%` } }
      ];
    }
    
    // 状态筛选
    if (status !== undefined && status !== '') {
      where.status = parseInt(status);
    }
    
    // 是否绑定手机号
    if (hasPhone === '1') {
      where.phone = { [Op.ne]: null };
    } else if (hasPhone === '0') {
      where.phone = { [Op.eq]: null };
    }
    
    // 注册时间范围
    if (startDate || endDate) {
      where.created_at = {};
      if (startDate) {
        where.created_at[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        where.created_at[Op.lte] = new Date(endDate + ' 23:59:59');
      }
    }

    const offset = (page - 1) * limit;
    
    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: [
        'id', 'openid', 'unionid', 'nickname', 'avatar', 'phone',
        'gender', 'country', 'province', 'city', 'status',
        'last_login', 'created_at', 'updated_at'
      ],
      order: [['created_at', 'DESC']],
      offset: parseInt(offset),
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('获取客户列表失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 获取客户详情
 * GET /api/admin/customers/:id
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: [
        'id', 'openid', 'unionid', 'nickname', 'avatar', 'phone',
        'gender', 'country', 'province', 'city', 'language',
        'status', 'last_login', 'created_at', 'updated_at'
      ]
    });
    
    if (!user) {
      return res.status(404).json({ success: false, message: '客户不存在' });
    }

    // 获取客户的预约记录
    const appointments = await Appointment.findAll({
      where: { user_id: user.id },
      order: [['created_at', 'DESC']],
      limit: 10
    });

    res.json({
      success: true,
      data: {
        ...user.toJSON(),
        appointments
      }
    });
  } catch (error) {
    console.error('获取客户详情失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 更新客户状态
 * PUT /api/admin/customers/:id/status
 */
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (status !== 0 && status !== 1) {
      return res.status(400).json({ success: false, message: '状态值无效' });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: '客户不存在' });
    }

    await user.update({ status });

    res.json({
      success: true,
      message: status === 1 ? '启用成功' : '禁用成功'
    });
  } catch (error) {
    console.error('更新客户状态失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 获取客户统计
 * GET /api/admin/customers/statistics/overview
 */
router.get('/statistics/overview', authMiddleware, async (req, res) => {
  try {
    // 总用户数
    const totalUsers = await User.count();
    
    // 今日新增
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayNew = await User.count({
      where: { created_at: { [Op.gte]: today } }
    });
    
    // 本周新增
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const weekNew = await User.count({
      where: { created_at: { [Op.gte]: weekStart } }
    });
    
    // 本月新增
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const monthNew = await User.count({
      where: { created_at: { [Op.gte]: monthStart } }
    });
    
    // 绑定手机号的用户
    const phoneBound = await User.count({
      where: { phone: { [Op.ne]: null } }
    });
    
    // 活跃用户（7天内有登录）
    const activeThreshold = new Date();
    activeThreshold.setDate(activeThreshold.getDate() - 7);
    const activeUsers = await User.count({
      where: { last_login: { [Op.gte]: activeThreshold } }
    });

    // 性别分布
    const genderStats = await User.findAll({
      attributes: ['gender', [User.sequelize.fn('COUNT', '*'), 'count']],
      group: ['gender'],
      raw: true
    });

    // 最近7天注册趋势
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const count = await User.count({
        where: {
          created_at: {
            [Op.gte]: date,
            [Op.lt]: nextDate
          }
        }
      });
      
      last7Days.push({
        date: date.toISOString().split('T')[0],
        count
      });
    }

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          todayNew,
          weekNew,
          monthNew,
          phoneBound,
          activeUsers,
          phoneBoundRate: totalUsers > 0 ? ((phoneBound / totalUsers) * 100).toFixed(2) : 0
        },
        genderStats,
        trend: last7Days
      }
    });
  } catch (error) {
    console.error('获取客户统计失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 导出客户数据
 * GET /api/admin/customers/export
 */
router.get('/export/all', authMiddleware, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        'id', 'nickname', 'phone', 'gender', 'country', 'province', 'city',
        'last_login', 'created_at'
      ],
      order: [['created_at', 'DESC']]
    });

    // 转换为CSV格式
    const headers = ['ID', '昵称', '手机号', '性别', '国家', '省份', '城市', '最后登录', '注册时间'];
    const rows = users.map(u => [
      u.id,
      u.nickname || '',
      u.phone || '',
      u.gender === 1 ? '男' : u.gender === 2 ? '女' : '未知',
      u.country || '',
      u.province || '',
      u.city || '',
      u.last_login ? new Date(u.last_login).toLocaleString() : '',
      new Date(u.created_at).toLocaleString()
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=customers.csv');
    res.send('\ufeff' + csv); // BOM for Excel
  } catch (error) {
    console.error('导出客户数据失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
