const express = require('express');
const router = express.Router();
const { Service } = require('../models');

// 默认服务数据 - 4大类别
const defaultServices = [
  {
    title: '留学申请',
    subtitle: '本科/硕士/博士全阶段',
    category: '留学申请',
    description: '本科/硕士/博士全阶段申请服务，从选校到offer全程护航',
    icon: 'graduation',
    color: 'from-blue-500 to-blue-600',
    link: '/apply',
    sort: 1,
    status: 1,
    features: ['选校定位', '文书指导', '面试辅导', '签证办理'],
    price: '¥ 15,000 起',
    badge: '热门'
  },
  {
    title: '英语培训',
    subtitle: '雅思/托福专业培训',
    category: '英语培训',
    description: '雅思/托福专业培训，资深名师助力冲刺高分',
    icon: 'book',
    color: 'from-emerald-500 to-teal-600',
    link: '/english-training',
    sort: 2,
    status: 1,
    features: ['小班教学', '1对1辅导', '模考练习', '冲刺班'],
    price: '¥ 8,000 起',
    badge: ''
  },
  {
    title: '竞赛规划',
    subtitle: '国际竞赛辅导',
    category: '竞赛规划',
    description: '国际竞赛辅导，提升背景实力，助力名校申请',
    icon: 'trophy',
    color: 'from-violet-500 to-purple-600',
    link: '/competition',
    sort: 3,
    status: 1,
    features: ['竞赛选择', '备赛指导', '团队组建', '项目实践'],
    price: '¥ 12,000 起',
    badge: ''
  },
  {
    title: '科研提升',
    subtitle: '顶尖教授指导',
    category: '科研提升',
    description: '顶尖教授指导科研项目，发表国际论文',
    icon: 'flask',
    color: 'from-cyan-500 to-blue-600',
    link: '/research',
    sort: 4,
    status: 1,
    features: ['课题设计', '实验指导', '论文发表', '推荐信'],
    price: '¥ 20,000 起',
    badge: '推荐'
  }
];

// 初始化默认服务
async function initDefaultServices() {
  const count = await Service.count();
  if (count === 0) {
    for (const service of defaultServices) {
      await Service.create(service);
    }
    console.log('✅ 默认服务数据初始化完成');
  }
}

// 获取服务列表（公开）
router.get('/', async (req, res) => {
  try {
    const services = await Service.findAll({
      where: { status: 1 },
      order: [['sort', 'ASC']]
    });
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取服务列表（管理后台）
router.get('/admin', async (req, res) => {
  try {
    const services = await Service.findAll({
      order: [['sort', 'ASC']]
    });
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取单个服务
router.get('/admin/:id', async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: '服务不存在' });
    }
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 创建服务
router.post('/admin', async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.json({ success: true, data: service, message: '创建成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 更新服务
router.put('/admin/:id', async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: '服务不存在' });
    }
    await service.update(req.body);
    res.json({ success: true, data: service, message: '更新成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 删除服务
router.delete('/admin/:id', async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: '服务不存在' });
    }
    await service.destroy();
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 初始化接口
router.post('/admin/init', async (req, res) => {
  try {
    await initDefaultServices();
    res.json({ success: true, message: '初始化完成' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = { router, initDefaultServices };
