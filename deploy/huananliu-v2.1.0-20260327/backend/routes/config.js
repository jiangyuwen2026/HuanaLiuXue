const express = require('express');
const router = express.Router();
const { Config } = require('../models');

// 默认配置项
const defaultConfigs = [
  // 联系方式
  { key: 'site_name', value: '华南留学', type: 'string', group: 'general', label: '网站名称', description: '网站显示的名称' },
  { key: 'site_slogan', value: '专业留学服务，助您圆梦名校', type: 'string', group: 'general', label: '网站标语', description: '网站副标题/标语' },
  
  // 电话配置
  { key: 'phone', value: '+86 400 888 8888', type: 'string', group: 'contact', label: '联系电话', description: '联系页面显示的电话号码' },
  { key: 'phone_time', value: '周一至周日 9:00-21:00', type: 'string', group: 'contact', label: '电话服务时间', description: '电话服务时间说明' },
  
  // 邮箱配置
  { key: 'email', value: 'info@huananliu.com', type: 'string', group: 'contact', label: '联系邮箱', description: '官方联系邮箱' },
  { key: 'email_reply', value: '24小时内回复', type: 'string', group: 'contact', label: '邮箱回复说明', description: '邮箱回复时效说明' },
  
  // 地址配置
  { key: 'address', value: '广州市天河区珠江新城', type: 'string', group: 'contact', label: '公司地址', description: '公司地址简写（用于联系卡片）' },
  { key: 'address_full', value: '广州市天河区珠江新城华夏路30号', type: 'string', group: 'contact', label: '完整地址', description: '完整的公司详细地址' },
  { key: 'address_note', value: '欢迎预约到访咨询', type: 'string', group: 'contact', label: '地址备注', description: '地址下方的提示文字' },
  
  // 在线咨询配置
  { key: 'online_title', value: '7×24小时在线', type: 'string', group: 'contact', label: '在线服务标题', description: '在线服务标题' },
  { key: 'online_desc', value: '随时为您解答疑问', type: 'string', group: 'contact', label: '在线服务描述', description: '在线服务描述' },
  
  // 其他联系方式
  { key: 'wechat', value: 'huananliu', type: 'string', group: 'contact', label: '微信公众号', description: '微信公众号ID' },
  { key: 'wechat_qr', value: '', type: 'string', group: 'contact', label: '微信二维码', description: '微信公众号二维码图片URL' },
  { key: 'business_hours', value: '周一至周日 9:00-21:00', type: 'string', group: 'contact', label: '营业时间', description: '公司营业时间' },
  
  // SEO配置
  { key: 'seo_title', value: '华南留学 - 专业留学申请服务', type: 'string', group: 'seo', label: 'SEO标题', description: '网站SEO标题' },
  { key: 'seo_keywords', value: '留学,留学申请,出国留学,留学中介,留学咨询', type: 'string', group: 'seo', label: 'SEO关键词', description: '网站SEO关键词，用逗号分隔' },
  { key: 'seo_description', value: '华南留学提供专业的留学申请服务，涵盖美国、英国、澳大利亚、加拿大等国家，助您成功进入世界顶尖名校。', type: 'string', group: 'seo', label: 'SEO描述', description: '网站SEO描述' },
  
  // 社交媒体
  { key: 'weibo', value: '', type: 'string', group: 'social', label: '微博链接', description: '官方微博链接' },
  { key: 'douyin', value: '', type: 'string', group: 'social', label: '抖音链接', description: '官方抖音链接' },
  { key: 'xiaohongshu', value: '', type: 'string', group: 'social', label: '小红书链接', description: '官方小红书链接' },
  
  // LOGO配置
  { key: 'logo', value: '/images/logo.png', type: 'image', group: 'logo', label: '主Logo', description: '网站主Logo，用于导航栏、页脚等位置' },
  { key: 'logo_dark', value: '', type: 'image', group: 'logo', label: '深色背景Logo', description: '深色背景使用的浅色Logo（如未设置则使用主Logo）' },
  { key: 'footer_logo', value: '', type: 'image', group: 'logo', label: '页脚Logo', description: '页脚区域显示的Logo（如未设置则使用主Logo）' },
  { key: 'favicon', value: '/favicon.ico', type: 'image', group: 'logo', label: 'Favicon图标', description: '浏览器标签页图标' },
  { key: 'admin_logo', value: '/images/logo.png', type: 'image', group: 'logo', label: '后台Logo', description: '后台管理系统显示的Logo' },
];

// 初始化默认配置
async function initDefaultConfigs() {
  console.log(`开始初始化 ${defaultConfigs.length} 个默认配置项...`);
  for (const config of defaultConfigs) {
    try {
      const exists = await Config.findOne({ where: { key: config.key } });
      if (!exists) {
        await Config.create(config);
        console.log(`✅ 创建配置: ${config.key}`);
      } else {
        // 更新type字段（如果有变化）
        if (exists.type !== config.type) {
          await exists.update({ type: config.type });
          console.log(`🔄 更新类型: ${config.key} (${exists.type} -> ${config.type})`);
        } else {
          console.log(`⏭️ 已存在: ${config.key}`);
        }
      }
    } catch (error) {
      console.error(`❌ 创建配置失败 ${config.key}:`, error.message);
      throw error;
    }
  }
  console.log('配置初始化完成');
}

// 获取所有配置（公开API）
router.get('/public', async (req, res) => {
  try {
    const configs = await Config.findAll();
    const result = {};
    
    configs.forEach(config => {
      let value = config.value;
      // 根据类型转换值
      if (config.type === 'number') {
        value = parseFloat(value) || 0;
      } else if (config.type === 'boolean') {
        value = value === 'true' || value === '1';
      } else if (config.type === 'json') {
        try {
          value = JSON.parse(value);
        } catch {
          value = {};
        }
      }
      
      result[config.key] = value;
    });
    
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 按分组获取配置（管理后台）
router.get('/admin', async (req, res) => {
  try {
    const { group } = req.query;
    const where = {};
    if (group) {
      where.group = group;
    }
    
    const configs = await Config.findAll({
      where,
      order: [['group', 'ASC'], ['id', 'ASC']]
    });
    
    // 按分组组织数据
    const result = {};
    configs.forEach(config => {
      if (!result[config.group]) {
        result[config.group] = [];
      }
      result[config.group].push(config);
    });
    
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 创建配置（管理后台）
router.post('/admin', async (req, res) => {
  try {
    const { key, value, type, group, label, description } = req.body;
    
    // 检查key是否已存在
    const exists = await Config.findOne({ where: { key } });
    if (exists) {
      return res.status(400).json({ success: false, message: '配置项已存在' });
    }
    
    const config = await Config.create({
      key,
      value,
      type: type || 'string',
      group: group || 'general',
      label,
      description
    });
    
    res.json({
      success: true,
      message: '创建成功',
      data: config
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 更新配置（管理后台）
router.put('/admin/:id', async (req, res) => {
  try {
    const { value } = req.body;
    const config = await Config.findByPk(req.params.id);
    
    if (!config) {
      return res.status(404).json({ success: false, message: '配置项不存在' });
    }
    
    await config.update({ value });
    
    res.json({
      success: true,
      message: '更新成功',
      data: config
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 批量更新配置（管理后台）
router.put('/admin/batch/update', async (req, res) => {
  try {
    const { configs } = req.body;
    
    for (const item of configs) {
      await Config.update(
        { value: item.value },
        { where: { key: item.key } }
      );
    }
    
    res.json({ success: true, message: '批量更新成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取配置分组列表
router.get('/admin/groups', async (req, res) => {
  try {
    const groups = [
      { key: 'general', label: '基本信息', icon: 'SettingOutlined' },
      { key: 'contact', label: '联系方式', icon: 'PhoneOutlined' },
      { key: 'logo', label: 'LOGO管理', icon: 'PictureOutlined' },
      { key: 'seo', label: 'SEO设置', icon: 'GlobalOutlined' },
      { key: 'social', label: '社交媒体', icon: 'TeamOutlined' }
    ];
    
    res.json({ success: true, data: groups });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 初始化配置接口（仅开发使用）
router.post('/admin/init', async (req, res) => {
  try {
    console.log('开始初始化配置...');
    await initDefaultConfigs();
    console.log('配置初始化完成');
    res.json({ success: true, message: '初始化完成' });
  } catch (error) {
    console.error('初始化配置失败:', error);
    res.status(500).json({ 
      success: false, 
      message: '初始化失败: ' + error.message,
      error: error.stack
    });
  }
});

// 导出初始化函数供外部使用
module.exports = { router, initDefaultConfigs };
