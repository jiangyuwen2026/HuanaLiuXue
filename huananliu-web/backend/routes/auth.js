const express = require('express');
const router = express.Router();
const { User } = require('../models');
const axios = require('axios');

// 微信小程序配置
const WX_CONFIG = {
  appid: process.env.WX_APPID || 'your-app-id',
  secret: process.env.WX_SECRET || 'your-app-secret'
};

/**
 * 微信登录
 * 前端传入 code，后端换取 openid 和 session_key
 */
router.post('/wx-login', async (req, res) => {
  try {
    const { code, userInfo } = req.body;
    
    if (!code) {
      return res.status(400).json({ success: false, message: '缺少code参数' });
    }

    // 调用微信接口换取 openid 和 session_key
    const wxUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${WX_CONFIG.appid}&secret=${WX_CONFIG.secret}&js_code=${code}&grant_type=authorization_code`;
    
    const wxRes = await axios.get(wxUrl);
    const { openid, session_key, unionid } = wxRes.data;
    
    if (!openid) {
      return res.status(400).json({ success: false, message: '微信登录失败', error: wxRes.data });
    }

    // 查找或创建用户
    let user = await User.findOne({ where: { openid } });
    
    if (!user) {
      // 新用户，创建记录
      user = await User.create({
        openid,
        unionid,
        nickname: userInfo?.nickName || null,
        avatar: userInfo?.avatarUrl || null,
        gender: userInfo?.gender || 0,
        country: userInfo?.country || null,
        province: userInfo?.province || null,
        city: userInfo?.city || null,
        language: userInfo?.language || null,
        last_login: new Date()
      });
    } else {
      // 更新登录时间和用户信息
      await user.update({
        nickname: userInfo?.nickName || user.nickname,
        avatar: userInfo?.avatarUrl || user.avatar,
        last_login: new Date()
      });
    }

    // 返回用户信息（不包含敏感信息）
    // 实际应用中应该使用JWT，这里简单使用session_key作为token
    res.json({
      success: true,
      data: {
        id: user.id,
        nickname: user.nickname,
        avatar: user.avatar,
        phone: user.phone,
        hasPhone: !!user.phone,
        openid: openid // 传递openid给前端
      },
      token: session_key
    });
    
  } catch (error) {
    console.error('微信登录失败:', error);
    res.status(500).json({ success: false, message: '登录失败', error: error.message });
  }
});

/**
 * 解密手机号
 * 前端传入 encryptedData 和 iv
 */
router.post('/decrypt-phone', async (req, res) => {
  try {
    const { code, encryptedData, iv } = req.body;
    
    if (!code || !encryptedData || !iv) {
      return res.status(400).json({ success: false, message: '缺少必要参数' });
    }

    // 换取 session_key
    const wxUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${WX_CONFIG.appid}&secret=${WX_CONFIG.secret}&js_code=${code}&grant_type=authorization_code`;
    
    const wxRes = await axios.get(wxUrl);
    const { openid, session_key } = wxRes.data;
    
    if (!session_key) {
      return res.status(400).json({ success: false, message: '获取session_key失败' });
    }

    // 解密手机号
    const crypto = require('crypto');
    const sessionKey = Buffer.from(session_key, 'base64');
    const encryptedBuffer = Buffer.from(encryptedData, 'base64');
    const ivBuffer = Buffer.from(iv, 'base64');

    // 解密
    const decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, ivBuffer);
    decipher.setAutoPadding(true);
    let decoded = decipher.update(encryptedBuffer, 'binary', 'utf8');
    decoded += decipher.final('utf8');
    
    const phoneData = JSON.parse(decoded);
    
    if (!phoneData.phoneNumber) {
      return res.status(400).json({ success: false, message: '解密手机号失败' });
    }

    // 更新用户手机号
    await User.update(
      { phone: phoneData.phoneNumber },
      { where: { openid } }
    );

    res.json({
      success: true,
      data: {
        phone: phoneData.phoneNumber,
        purePhone: phoneData.purePhoneNumber,
        countryCode: phoneData.countryCode
      }
    });
    
  } catch (error) {
    console.error('解密手机号失败:', error);
    res.status(500).json({ success: false, message: '解密失败', error: error.message });
  }
});

/**
 * 获取用户信息
 */
router.get('/user-info', async (req, res) => {
  try {
    // 从请求头获取openid
    const openid = req.headers['x-openid'] || req.headers['X-Openid'];
    
    if (!openid) {
      return res.status(401).json({ success: false, message: '未登录' });
    }

    const user = await User.findOne({
      where: { openid },
      attributes: ['id', 'nickname', 'avatar', 'phone', 'gender', 'country', 'province', 'city']
    });

    if (!user) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }

    res.json({
      success: true,
      data: user
    });
    
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({ success: false, message: '获取失败', error: error.message });
  }
});

/**
 * 更新用户信息
 */
router.put('/user-info', async (req, res) => {
  try {
    const openid = req.headers['x-openid'] || req.headers['X-Openid'];
    const { nickname, avatar } = req.body;
    
    if (!openid) {
      return res.status(401).json({ success: false, message: '未登录' });
    }

    await User.update(
      { nickname, avatar },
      { where: { openid } }
    );

    res.json({ success: true, message: '更新成功' });
    
  } catch (error) {
    console.error('更新用户信息失败:', error);
    res.status(500).json({ success: false, message: '更新失败', error: error.message });
  }
});

module.exports = router;
