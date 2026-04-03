/**
 * ============================================================================
 * 后台用户管理路由 (v2.1.0)
 * ============================================================================
 * 功能：管理员账户管理
 * 包括：列表、创建、编辑、删除、重置密码、启用/禁用
 * ============================================================================
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { Admin } = require('../models');
const { Op } = require('sequelize');

// 认证中间件
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: '未登录' });
  }
  // 简单验证，实际应该使用 JWT 验证
  next();
};

// 权限检查中间件 - 只有超级管理员可以管理其他管理员
const superAdminMiddleware = async (req, res, next) => {
  const adminId = req.headers['x-admin-id'];
  const admin = await Admin.findByPk(adminId);
  if (!admin || admin.role !== 'super') {
    return res.status(403).json({ success: false, message: '权限不足' });
  }
  next();
};

/**
 * 获取管理员列表
 * GET /api/admin/users
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, keyword = '', status } = req.query;
    
    const where = {};
    if (keyword) {
      where[Op.or] = [
        { username: { [Op.like]: `%${keyword}%` } },
        { name: { [Op.like]: `%${keyword}%` } }
      ];
    }
    if (status !== undefined && status !== '') {
      where.status = parseInt(status);
    }

    const offset = (page - 1) * limit;
    
    const { count, rows } = await Admin.findAndCountAll({
      where,
      attributes: ['id', 'username', 'name', 'role', 'status', 'last_login', 'created_at'],
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
    console.error('获取管理员列表失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 获取管理员详情
 * GET /api/admin/users/:id
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.params.id, {
      attributes: ['id', 'username', 'name', 'role', 'status', 'last_login', 'created_at', 'updated_at']
    });
    
    if (!admin) {
      return res.status(404).json({ success: false, message: '管理员不存在' });
    }

    res.json({ success: true, data: admin });
  } catch (error) {
    console.error('获取管理员详情失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 创建管理员
 * POST /api/admin/users
 * 需要超级管理员权限
 */
router.post('/', authMiddleware, superAdminMiddleware, async (req, res) => {
  try {
    const { username, password, name, role = 'admin' } = req.body;
    
    // 验证必填字段
    if (!username || !password) {
      return res.status(400).json({ success: false, message: '用户名和密码不能为空' });
    }

    // 检查用户名是否已存在
    const existingAdmin = await Admin.findOne({ where: { username } });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: '用户名已存在' });
    }

    // 密码加密
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      username,
      password: hashedPassword,
      name,
      role,
      status: 1
    });

    res.json({
      success: true,
      message: '创建成功',
      data: {
        id: admin.id,
        username: admin.username,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('创建管理员失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 更新管理员
 * PUT /api/admin/users/:id
 */
router.put('/:id', authMiddleware, superAdminMiddleware, async (req, res) => {
  try {
    const { name, role, status } = req.body;
    const admin = await Admin.findByPk(req.params.id);
    
    if (!admin) {
      return res.status(404).json({ success: false, message: '管理员不存在' });
    }

    // 不允许修改超级管理员的角色（防止误操作）
    if (admin.role === 'super' && role && role !== 'super') {
      return res.status(403).json({ success: false, message: '不能修改超级管理员角色' });
    }

    await admin.update({ name, role, status });

    res.json({ success: true, message: '更新成功' });
  } catch (error) {
    console.error('更新管理员失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 重置密码
 * PUT /api/admin/users/:id/reset-password
 */
router.put('/:id/reset-password', authMiddleware, superAdminMiddleware, async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: '密码长度不能少于6位' });
    }

    const admin = await Admin.findByPk(req.params.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: '管理员不存在' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await admin.update({ password: hashedPassword });

    res.json({ success: true, message: '密码重置成功' });
  } catch (error) {
    console.error('重置密码失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 删除管理员
 * DELETE /api/admin/users/:id
 */
router.delete('/:id', authMiddleware, superAdminMiddleware, async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.params.id);
    
    if (!admin) {
      return res.status(404).json({ success: false, message: '管理员不存在' });
    }

    // 不允许删除超级管理员
    if (admin.role === 'super') {
      return res.status(403).json({ success: false, message: '不能删除超级管理员' });
    }

    await admin.destroy();
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    console.error('删除管理员失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
