const express = require('express');
const router = express.Router();
const { Testimonial } = require('../models');

// 获取留言列表（公开API）
router.get('/', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const testimonials = await Testimonial.findAll({
      where: { status: 1 },
      order: [['sort_order', 'ASC'], ['created_at', 'DESC']],
      limit: parseInt(limit)
    });
    
    res.json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 管理后台 - 获取所有留言
router.get('/admin', async (req, res) => {
  try {
    const testimonials = await Testimonial.findAll({
      order: [['sort_order', 'ASC'], ['created_at', 'DESC']]
    });
    
    res.json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 管理后台 - 创建留言
router.post('/admin', async (req, res) => {
  try {
    const { student_name, avatar, school, major, content, sort_order, status } = req.body;
    
    const testimonial = await Testimonial.create({
      student_name,
      avatar,
      school,
      major,
      content,
      sort_order: sort_order || 0,
      status: status !== undefined ? status : 1
    });
    
    res.json({ success: true, message: '创建成功', data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 管理后台 - 更新留言
router.put('/admin/:id', async (req, res) => {
  try {
    const { student_name, avatar, school, major, content, sort_order, status } = req.body;
    const testimonial = await Testimonial.findByPk(req.params.id);
    
    if (!testimonial) {
      return res.status(404).json({ success: false, message: '留言不存在' });
    }
    
    await testimonial.update({
      student_name,
      avatar,
      school,
      major,
      content,
      sort_order,
      status
    });
    
    res.json({ success: true, message: '更新成功', data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 管理后台 - 删除留言
router.delete('/admin/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findByPk(req.params.id);
    
    if (!testimonial) {
      return res.status(404).json({ success: false, message: '留言不存在' });
    }
    
    await testimonial.destroy();
    
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 初始化默认留言数据
async function initDefaultTestimonials() {
  const defaults = [
    {
      student_name: '张同学',
      avatar: '',
      school: '香港大学',
      major: '金融硕士',
      content: '华南留学的专业服务让我顺利拿到了香港大学的录取通知书。他们不仅帮我准备了完美的申请材料，还在面试准备上给了我很大帮助。',
      sort_order: 1,
      status: 1
    },
    {
      student_name: '李同学',
      avatar: '',
      school: '剑桥大学',
      major: '计算机科学',
      content: '从文书润色到面试辅导，华南留学的顾问团队全程陪伴。感谢他们的耐心指导，让我实现了剑桥梦！',
      sort_order: 2,
      status: 1
    },
    {
      student_name: '王同学',
      avatar: '',
      school: '新加坡国立大学',
      major: 'MBA',
      content: '工作多年后决定留学，华南留学帮我找到了最适合的项目。从选校到申请，每一步都有专业指导。',
      sort_order: 3,
      status: 1
    },
    {
      student_name: '陈同学',
      avatar: '',
      school: '墨尔本大学',
      major: '法学',
      content: '双非背景申请八大不是梦！华南留学的顾问根据我的情况制定了详细方案，最终收获梦校Offer。',
      sort_order: 4,
      status: 1
    },
    {
      student_name: '刘同学',
      avatar: '',
      school: '帝国理工学院',
      major: '工程',
      content: '申请过程比想象中顺利很多，感谢华南留学的专业指导。文书修改了十几次，每一份材料都精益求精。',
      sort_order: 5,
      status: 1
    }
  ];
  
  for (const item of defaults) {
    const exists = await Testimonial.findOne({ where: { student_name: item.student_name, school: item.school } });
    if (!exists) {
      await Testimonial.create(item);
      console.log(`✅ 创建留言: ${item.student_name}`);
    }
  }
}

module.exports = { router, initDefaultTestimonials };
