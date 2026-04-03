const api = require('../../utils/api');

Page({
  data: {
    currentTab: 0,
    serviceTabs: ['留学申请', '英语培训', '竞赛规划', '科研提升'],
    services: [],
    consultants: [],
    loading: false,
    stats: [
      { value: '15年', label: '行业经验' },
      { value: '5000+', label: '成功案例' },
      { value: '98%', label: '录取率' }
    ],
    // 英语培训详情数据
    englishData: {
      stats: [
        { value: '95%', label: '学员提分率', desc: '平均提升1-2分' },
        { value: '8.5', label: '雅思最高分', desc: '单项满分学员' },
        { value: '115', label: '托福最高分', desc: '冲刺前10%' },
        { value: '1000+', label: '高分学员', desc: '累计成功案例' }
      ],
      features: [
        { icon: '📖', title: '个性化学习方案', desc: '根据学员基础和目标分数，定制专属学习计划' },
        { icon: '✅', title: '真题实战演练', desc: '海量真题库+独家模拟题，熟悉考试题型' },
        { icon: '👨‍🏫', title: '资深名师授课', desc: '雅思8.5+/托福110+教师，平均8年经验' },
        { icon: '📊', title: '全程进度追踪', desc: '定期模考评估，实时调整学习策略' }
      ],
      ieltsCourses: [
        { name: '雅思基础班', target: '目标5.5-6.0', duration: '8周课程', price: '¥8,800', features: ['语法基础强化', '词汇系统积累', '听说读写入门'] },
        { name: '雅思精品班', target: '目标6.5-7.0', duration: '10周课程', price: '¥12,800', popular: true, features: ['全科技巧精讲', '真题深度解析', '口语外教陪练'] },
        { name: '雅思冲刺班', target: '目标7.0-7.5+', duration: '6周强化', price: '¥15,800', features: ['高分技巧特训', '考前预测押题', 'VIP一对一辅导'] }
      ],
      toeflCourses: [
        { name: '托福基础班', target: '目标60-80', duration: '8周课程', price: '¥8,800', features: ['词汇量突破', '语法基础夯实', '听力阅读入门'] },
        { name: '托福强化班', target: '目标80-100', duration: '10周课程', price: '¥12,800', popular: true, features: ['听说读写强化', '真题实战演练', '机考系统训练'] },
        { name: '托福冲刺班', target: '目标100-110+', duration: '6周强化', price: '¥15,800', features: ['高分策略特训', '考前精准预测', '一对一弱项攻克'] }
      ],
      teachers: [
        { name: 'Sarah Chen', title: '雅思口语/写作', score: '雅思8.5分', experience: '10年教学经验', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face', desc: '英国剑桥大学硕士，前雅思考官' },
        { name: 'Michael Wang', title: '托福听力/阅读', score: '托福118分', experience: '8年教学经验', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face', desc: '美国加州大学博士，独创听力笔记法' },
        { name: 'Emily Liu', title: '雅思阅读/听力', score: '雅思8.0分', experience: '6年教学经验', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face', desc: '澳洲国立大学硕士，提分率95%+' },
        { name: 'David Zhang', title: '托福口语/写作', score: '托福115分', experience: '9年教学经验', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face', desc: '加拿大多伦多大学硕士，快速提分专家' }
      ],
      process: [
        { step: 1, title: '水平测试', desc: '专业英语水平评估' },
        { step: 2, title: '方案定制', desc: '个性化学习规划' },
        { step: 3, title: '系统学习', desc: '名师精讲各科技巧' },
        { step: 4, title: '真题演练', desc: '大量练习巩固提升' },
        { step: 5, title: '模考冲刺', desc: '全真模拟考前冲刺' },
        { step: 6, title: '出分复盘', desc: '成绩分析，持续优化' }
      ]
    },
    // 竞赛规划详情数据
    competitionData: {
      stats: [
        { value: '50+', label: '覆盖竞赛', desc: '国际权威赛事' },
        { value: '85%', label: '获奖率', desc: '远超行业平均' },
        { value: '200+', label: '金牌导师', desc: '竞赛获奖经历' },
        { value: 'TOP30', label: '名校录取', desc: '藤校/G5offer' }
      ],
      features: [
        { icon: '🗺️', title: '个性化规划', desc: '根据学生兴趣、能力和目标，量身定制竞赛路径' },
        { icon: '🏆', title: '权威竞赛资源', desc: '涵盖数学、物理、化学、生物、计算机等主流竞赛' },
        { icon: '👨‍🏫', title: '金牌教练团队', desc: '国际竞赛金牌选手+资深教练，传授实战经验' },
        { icon: '📈', title: '申请竞争力', desc: '竞赛获奖经历大幅提升名校录取概率' }
      ],
      categories: [
        { key: 'math', name: '数学竞赛', color: '#3b82f6', competitions: ['AMC 8/10/12', 'AIME', 'USAMO', 'BMO', 'HiMCM', 'Euclid'] },
        { key: 'physics', name: '物理竞赛', color: '#8b5cf6', competitions: ['Physics Bowl', 'F=ma', 'USAPhO', 'BPhO', 'CAP', 'SIN'] },
        { key: 'chemistry', name: '化学竞赛', color: '#10b981', competitions: ['USNCO', 'UKChO', 'CCC', 'CCO', 'ASOC', 'Chem13'] },
        { key: 'biology', name: '生物竞赛', color: '#f43f5e', competitions: ['USABO', 'BBO', 'Brain Bee', 'HOSA', 'ASOB', 'IBO'] },
        { key: 'computer', name: '计算机竞赛', color: '#06b6d4', competitions: ['USACO', 'NOIP', 'ACS', 'Kaggle', 'Google Code-in', 'FRC'] },
        { key: 'business', name: '商科经济', color: '#f59e0b', competitions: ['NEC', 'IEO', 'FBLA', 'DECA', 'KWHS', 'SIC'] }
      ],
      mentors: [
        { name: 'Dr. Chen', title: 'AMC/USAMO金牌教练', achievement: 'IMO金牌得主', experience: '12年竞赛辅导', students: '带出50+ USAMO qualifier', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face' },
        { name: 'Dr. Wang', title: '物理竞赛金牌教练', achievement: 'IPhO金牌得主', experience: '10年竞赛辅导', students: '带出30+ USAPhO金牌', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face' },
        { name: 'Dr. Liu', title: '生物竞赛金牌教练', achievement: 'USABO满分教练', experience: '8年竞赛辅导', students: '带出20+ USABO semifinalist', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face' },
        { name: 'Alex Zhang', title: '计算机竞赛教练', achievement: 'USACO Platinum', experience: '7年编程教学', students: '带出100+ USACO晋级', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face' }
      ],
      successCases: [
        { name: '张同学', grade: '11年级', competitions: 'AMC12 Top 1%, AIME 12分', result: '录取 MIT 数学系', avatar: '👨‍🎓' },
        { name: '李同学', grade: '12年级', competitions: 'USABO Semifinalist, Brain Bee一等奖', result: '录取 斯坦福 生物系', avatar: '👩‍🎓' },
        { name: '王同学', grade: '11年级', competitions: 'USACO Platinum, Google Code-in Winner', result: '录取 CMU 计算机系', avatar: '👨‍🎓' }
      ],
      process: [
        { step: 1, title: '兴趣评估', desc: '了解学生兴趣、特长和目标院校' },
        { step: 2, title: '竞赛匹配', desc: '根据学生特点推荐合适竞赛' },
        { step: 3, title: '规划制定', desc: '制定长期竞赛规划和时间表' },
        { step: 4, title: '系统培训', desc: '专业教练系统授课和辅导' },
        { step: 5, title: '真题训练', desc: '历年真题实战演练' },
        { step: 6, title: '冲刺夺奖', desc: '赛前冲刺，冲击奖项' }
      ]
    },
    // 科研提升详情数据
    researchData: {
      stats: [
        { value: '100+', label: '合作导师', desc: '顶尖院校教授' },
        { value: '90%', label: '论文发表率', desc: 'EI/CPCI/SCI' },
        { value: '500+', label: '科研学员', desc: '累计培养' },
        { value: 'TOP50', label: '名校录取', desc: '藤校/G5占比' }
      ],
      features: [
        { icon: '🔬', title: '前沿课题选择', desc: '对接最新科研热点，提供符合兴趣的跨学科研究方向' },
        { icon: '👨‍🏫', title: '顶尖导师指导', desc: 'MIT、斯坦福、哈佛、清北等顶尖院校的教授/博士指导' },
        { icon: '📄', title: '学术论文发表', desc: '指导发表EI/CPCI国际会议论文或SCI期刊论文' },
        { icon: '💡', title: '独立研究成果', desc: '完成独立研究项目，获得可展示的科研成果和推荐信' }
      ],
      fields: [
        { key: 'cs', name: '计算机科学', icon: '💻', topics: ['人工智能', '机器学习', '深度学习', '计算机视觉', '自然语言处理', '网络安全', '区块链', '数据科学'] },
        { key: 'engineering', name: '工程技术', icon: '⚙️', topics: ['电子工程', '机械工程', '材料科学', '能源工程', '机器人', '自动化', '航空航天', '生物医学工程'] },
        { key: 'biomed', name: '生物医学', icon: '🧬', topics: ['基因工程', '生物信息学', '药物研发', '神经科学', '免疫学', '癌症研究', '干细胞', '公共卫生'] },
        { key: 'business', name: '商科经济', icon: '📊', topics: ['数据分析', '金融科技', '行为经济学', '市场营销', '供应链管理', '创业研究', 'ESG', '国际贸易'] },
        { key: 'social', name: '社会科学', icon: '🌍', topics: ['心理学', '社会学', '教育学', '国际关系', '公共政策', '传媒研究', '环境研究', '性别研究'] },
        { key: 'math', name: '数理统计', icon: '📈', topics: ['概率统计', '数学建模', '优化理论', '量化金融', '运筹学', '图论', '密码学', '数值分析'] }
      ],
      programs: [
        { name: '科研启蒙项目', duration: '1-2个月', suitable: '9-10年级', features: ['科研方法论入门', '文献阅读训练', '研究课题初探', '项目证书'], outcome: '科研思维建立', price: '¥15,800', tag: '入门首选' },
        { name: '科研提升项目', duration: '3-6个月', suitable: '10-11年级', features: ['完整科研流程', '导师一对一指导', '研究报告产出', '导师推荐信'], outcome: '高质量研究报告', price: '¥38,800', tag: '热门推荐' },
        { name: '论文发表项目', duration: '6-12个月', suitable: '11-12年级', features: ['EI/CPCI会议发表', 'SCI期刊指导', '独立作者论文', '名校申请加分'], outcome: '国际会议/期刊论文', price: '¥68,800', tag: '冲刺名校' }
      ],
      mentors: [
        { name: 'Prof. Smith', title: 'MIT 计算机教授', research: '人工智能与机器学习', papers: 'Nature/Science 20+', students: '指导50+学生发表论文', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face' },
        { name: 'Prof. Johnson', title: '斯坦福 生物教授', research: '生物医学工程', papers: 'Cell/Science 15+', students: '30+学生进藤校', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face' },
        { name: 'Dr. Li', title: '清华 经济学副教授', research: '行为经济学', papers: 'SSCI期刊30+', students: '20+学生发表论文', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face' },
        { name: 'Prof. Wang', title: '哈佛 心理学博士', research: '认知神经科学', papers: 'Neuron/Nature 10+', students: '15+学生进Top10', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face' }
      ],
      successCases: [
        { name: '陈同学', grade: '11年级', field: '计算机科学', achievement: 'AI医疗影像识别研究，发表IEEE会议论文', result: '录取 卡内基梅隆大学' },
        { name: '林同学', grade: '12年级', field: '生物医学', achievement: 'CRISPR基因编辑研究，发表SCI期刊论文', result: '录取 约翰霍普金斯大学' },
        { name: '赵同学', grade: '11年级', field: '经济学', achievement: '数字货币市场分析研究，发表CPCI会议论文', result: '录取 宾夕法尼亚大学沃顿商学院' }
      ],
      process: [
        { step: 1, title: '兴趣评估', desc: '了解学术兴趣与目标' },
        { step: 2, title: '导师匹配', desc: '匹配合适的科研导师' },
        { step: 3, title: '课题确定', desc: '确定具体研究方向' },
        { step: 4, title: '科研开展', desc: '系统开展研究工作' },
        { step: 5, title: '论文撰写', desc: '指导完成学术论文' },
        { step: 6, title: '成果发表', desc: '协助投稿与发表' }
      ],
      successCases: [
        { name: '李同学', before: '雅思5.5', after: '雅思7.0', duration: '3个月', school: '曼彻斯特大学' },
        { name: '张同学', before: '托福75', after: '托福105', duration: '4个月', school: '纽约大学' },
        { name: '王同学', before: '雅思6.0', after: '雅思7.5', duration: '2个月', school: '悉尼大学' }
      ]
    },
    currentCourseTab: 'ielts',
    currentCompetitionTab: 'math',
    currentResearchTab: 'cs',
    // 留学申请详情数据
    applyServices: [
      {
        icon: '🎯',
        title: '选校定位',
        desc: '根据学生背景，精准匹配目标院校',
        features: ['背景评估', '院校匹配', '专业推荐']
      },
      {
        icon: '📝',
        title: '文书指导',
        desc: '一对一文书润色，突出个人亮点',
        features: ['PS撰写', '推荐信', 'CV优化']
      },
      {
        icon: '🎤',
        title: '面试辅导',
        desc: '模拟真实面试场景，提升表现',
        features: ['模拟面试', '技巧培训', '问题预测']
      },
      {
        icon: '🛂',
        title: '签证办理',
        desc: '材料准备、面签辅导一站式服务',
        features: ['材料准备', '面签辅导', '进度跟踪']
      },
      {
        icon: '🏠',
        title: '行前指导',
        desc: '出国前的全方位准备',
        features: ['住宿安排', '机票预订', '生活指南']
      },
      {
        icon: '🌟',
        title: '背景提升',
        desc: '竞赛、科研、实习等项目',
        features: ['竞赛规划', '科研项目', '名企实习']
      }
    ],
    // 服务流程
    process: [
      { step: 1, title: '初步咨询', desc: '了解学生背景、需求和目标' },
      { step: 2, title: '评估定位', desc: '全面评估，精准定位目标院校' },
      { step: 3, title: '方案制定', desc: '量身定制申请方案' },
      { step: 4, title: '材料准备', desc: '指导准备申请材料，打磨文书' },
      { step: 5, title: '申请递交', desc: '协助完成网申，跟踪进度' },
      { step: 6, title: '面试辅导', desc: '模拟面试训练，提升表现' }
    ]
  },

  onLoad() {
    this.loadServices();
    this.loadConsultants();
  },

  onPullDownRefresh() {
    Promise.all([
      this.loadServices(),
      this.loadConsultants()
    ]).then(() => {
      wx.stopPullDownRefresh();
    });
  },

  // 从后端加载服务数据
  async loadServices() {
    this.setData({ loading: true });
    
    try {
      const res = await api.get('/services');
      
      if (res.success && res.data) {
        const services = res.data.map(item => ({
          id: item.id,
          category: item.category || '留学申请',
          name: item.title,
          subtitle: item.subtitle || '',
          desc: item.description || '',
          priceDisplay: item.price || '面议',
          icon: this.getIconByCategory(item.category),
          features: item.features || [],
          badge: item.badge || ''
        }));
        
        this.setData({
          services: services,
          loading: false
        });
      }
    } catch (error) {
      console.error('加载服务失败:', error);
      this.setData({ loading: false });
    }
  },

  // 加载顾问列表
  async loadConsultants() {
    try {
      const res = await api.get('/consultants', { limit: 4 });
      
      if (res.success && res.data && res.data.list) {
        const consultants = res.data.list.map(item => ({
          id: item.id,
          name: item.name,
          title: item.title,
          avatar: item.avatar,
          education: item.education,
          experience: item.experience,
          successCases: item.success_cases,
          rating: item.rating
        }));
        
        this.setData({ consultants });
      }
    } catch (error) {
      console.error('加载顾问失败:', error);
    }
  },

  // 根据类别获取图标
  getIconByCategory(category) {
    const iconMap = {
      '留学申请': '🎓',
      '英语培训': '📚',
      '竞赛规划': '🏆',
      '科研提升': '🔬'
    };
    return iconMap[category] || '📋';
  },

  // 切换标签
  switchTab(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ currentTab: index });
    
    // 切换到任意主要分类时加载顾问
    if (index < 4 && this.data.consultants.length === 0) {
      this.loadConsultants();
    }
  },

  // 切换课程标签（雅思/托福）
  switchCourseTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentCourseTab: tab });
  },

  // 切换竞赛分类标签
  switchCompetitionTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentCompetitionTab: tab });
  },

  // 切换科研领域标签
  switchResearchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentResearchTab: tab });
  },

  // 查看顾问详情
  goToConsultantDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/consultant/detail/consultant-detail?id=${id}`
    });
  },

  // 咨询服务
  consultService(e) {
    const service = e.currentTarget.dataset.service;
    wx.navigateTo({
      url: `/pages/appointment/appointment?service=${encodeURIComponent(service.name)}`
    });
  },

  // 免费咨询
  goToConsult() {
    wx.navigateTo({
      url: '/pages/appointment/appointment'
    });
  },

  // 图片加载失败
  onAvatarError(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      [`consultants[${index}].avatar`]: '/images/default/avatar.png'
    });
  }
});
