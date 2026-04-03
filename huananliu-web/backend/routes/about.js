const express = require('express');
const router = express.Router();
const About = require('../models/About');
const { Consultant } = require('../models');

// 前台 - 获取关于我们配置
router.get('/', async (req, res) => {
  try {
    let about = await About.findOne();
    
    if (!about) {
      // 如果没有数据，创建默认数据
      about = await About.create({});
    }
    
    // 强制从顾问表获取数据作为团队数据
    let teamFromConsultants = [];
    try {
      const consultants = await Consultant.findAll({
        where: { status: 1 },
        order: [['id', 'ASC']],
        limit: 8
      });
      
      // 将顾问数据映射为团队格式
      teamFromConsultants = consultants.map(c => ({
        name: c.name,
        title: c.title,
        avatar: c.avatar,
        bio: c.bio || `${c.education}。${c.experience}年留学咨询经验，帮助${c.success_cases}+学生成功申请。`,
        education: c.education,
        experience: c.experience,
        success_cases: c.success_cases,
        rating: c.rating,
        specialties: c.specialties || []
      }));
    } catch (err) {
      console.error('获取顾问数据失败:', err);
    }
    
    // 强制使用顾问数据作为团队数据（不再使用about.team）
    const responseData = {
      ...about.toJSON(),
      team: teamFromConsultants,
      team_title: '认识我们的团队',
      team_subtitle: '专业的顾问团队，拥有丰富的国际教育咨询经验'
    };
    
    res.json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error('获取关于我们配置失败:', error);
    res.status(500).json({ success: false, message: '获取失败' });
  }
});

// 后台 - 获取关于我们配置
router.get('/admin', async (req, res) => {
  try {
    let about = await About.findOne();
    
    if (!about) {
      about = await About.create({});
    }
    
    res.json({
      success: true,
      data: about
    });
  } catch (error) {
    console.error('获取关于我们配置失败:', error);
    res.status(500).json({ success: false, message: '获取失败' });
  }
});

// 后台 - 更新关于我们配置
router.put('/admin', async (req, res) => {
  try {
    let about = await About.findOne();
    
    if (!about) {
      about = await About.create(req.body);
    } else {
      await about.update(req.body);
    }
    
    res.json({
      success: true,
      data: about,
      message: '更新成功'
    });
  } catch (error) {
    console.error('更新关于我们配置失败:', error);
    res.status(500).json({ success: false, message: '更新失败' });
  }
});

module.exports = router;
