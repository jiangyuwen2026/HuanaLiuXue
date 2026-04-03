const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const About = sequelize.define('About', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // Hero 区域
  hero_title: {
    type: DataTypes.STRING(200),
    defaultValue: '助力学子实现全球教育梦想'
  },
  hero_subtitle: {
    type: DataTypes.STRING(100),
    defaultValue: '关于华南留学'
  },
  hero_description: {
    type: DataTypes.TEXT,
    defaultValue: '华南留学是一家专业的国际教育咨询机构，致力于帮助学生进入世界顶尖学府。'
  },
  hero_background: {
    type: DataTypes.STRING(500),
    comment: 'Hero背景图URL'
  },
  
  // 统计数据
  stats: {
    type: DataTypes.JSON,
    defaultValue: [
      { value: '15+', label: '年行业经验', desc: '深耕留学服务领域' },
      { value: '5000+', label: '成功案例', desc: '圆梦世界名校' },
      { value: '98%', label: '录取成功率', desc: '远超行业平均' },
      { value: '200+', label: '专业顾问', desc: '资深服务团队' }
    ]
  },
  
  // 使命
  mission_title: {
    type: DataTypes.STRING(100),
    defaultValue: '我们的使命'
  },
  mission_content: {
    type: DataTypes.TEXT,
    defaultValue: '我们坚信每位学生都应享有优质国际教育的机会...'
  },
  
  // 愿景
  vision_title: {
    type: DataTypes.STRING(100),
    defaultValue: '我们的愿景'
  },
  vision_content: {
    type: DataTypes.TEXT,
    defaultValue: '成为中国最受信赖的国际教育服务机构...'
  },
  
  // 核心价值观
  values: {
    type: DataTypes.JSON,
    defaultValue: [
      {
        title: '专业卓越',
        desc: '我们的团队由经验丰富的教育顾问组成，深谙国际名校录取要求与申请策略。',
        color: 'from-emerald-500 to-teal-600',
        icon: 'shield'
      },
      {
        title: '以学生为中心',
        desc: '我们为每位学生量身定制申请方案，确保最大程度发挥个人优势。',
        color: 'from-blue-500 to-indigo-600',
        icon: 'users'
      },
      {
        title: '国际化视野',
        desc: '与全球顶尖院校建立紧密合作关系，为学生打开通往世界的大门。',
        color: 'from-violet-500 to-purple-600',
        icon: 'globe'
      },
      {
        title: '用心服务',
        desc: '与学生和家庭建立长期关系，在留学之路上提供全程关怀与支持。',
        color: 'from-rose-500 to-pink-600',
        icon: 'heart'
      }
    ]
  },
  
  // 发展历程
  timeline: {
    type: DataTypes.JSON,
    defaultValue: [
      { year: '2009', title: '公司成立', desc: '华南留学在深圳成立，开始提供留学咨询服务' },
      { year: '2012', title: '业务扩展', desc: '服务范围扩展至英语培训、竞赛规划等领域' },
      { year: '2015', title: '百人团队', desc: '顾问团队突破100人，服务网络覆盖全国' },
      { year: '2018', title: '名校突破', desc: '累计帮助1000+学生进入世界TOP30名校' },
      { year: '2021', title: '科研业务', desc: '推出科研提升服务，与顶尖院校教授建立合作' },
      { year: '2024', title: '行业领先', desc: '成为华南地区领先的留学服务机构' }
    ]
  },
  
  // 为什么选择我们
  advantages_title: {
    type: DataTypes.STRING(100),
    defaultValue: '专业团队，值得信赖'
  },
  advantages_subtitle: {
    type: DataTypes.STRING(200),
    defaultValue: '我们深知留学申请对学生和家庭的重要性...'
  },
  advantages: {
    type: DataTypes.JSON,
    defaultValue: [
      { title: '个性化方案', desc: '根据学生背景和目标量身定制申请策略...', icon: '01' },
      { title: '专家团队', desc: '顾问团队直接参与过全球顶尖院校的招生工作...', icon: '02' },
      { title: '全程陪伴', desc: '从初次咨询到签证办理，全程提供专业指导...', icon: '03' },
      { title: '成功保障', desc: '98%的录取成功率见证我们对卓越品质的坚持...', icon: '04' }
    ]
  },
  advantages_image: {
    type: DataTypes.STRING(500),
    comment: '为什么选择我们区域图片'
  },
  
  // 核心团队
  team_title: {
    type: DataTypes.STRING(100),
    defaultValue: '认识我们的团队'
  },
  team_subtitle: {
    type: DataTypes.STRING(200),
    defaultValue: '专业的顾问团队，拥有丰富的国际教育咨询经验'
  },
  team: {
    type: DataTypes.JSON,
    defaultValue: [
      {
        name: '陈博士',
        title: '创始人兼CEO',
        bio: '教育学博士，20+年国际教育经验，曾任知名大学招生官',
        avatar: ''
      },
      {
        name: '王明',
        title: '运营总监',
        bio: '前常春藤盟校招生官，15+年留学行业经验',
        avatar: ''
      },
      {
        name: '刘晓雯',
        title: '高级顾问总监',
        bio: '专注英联邦申请专家，帮助500+学生进入G5名校',
        avatar: ''
      },
      {
        name: '张大卫',
        title: '学术总监',
        bio: '研究型硕博申请专家，科研背景提升项目负责人',
        avatar: ''
      }
    ]
  },
  
  // 合作院校
  partners_title: {
    type: DataTypes.STRING(100),
    defaultValue: '全球顶尖院校合作伙伴'
  },
  partners_subtitle: {
    type: DataTypes.STRING(200),
    defaultValue: '与全球100+顶尖院校建立紧密合作关系'
  },
  partners: {
    type: DataTypes.JSON,
    defaultValue: [
      '哈佛大学', '麻省理工学院', '斯坦福大学', '牛津大学', '剑桥大学',
      '耶鲁大学', '普林斯顿大学', '哥伦比亚大学', '宾夕法尼亚大学', '康奈尔大学'
    ]
  }
}, {
  tableName: 'abouts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = About;
