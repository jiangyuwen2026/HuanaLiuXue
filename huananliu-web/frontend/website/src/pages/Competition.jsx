import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { submitMessage } from '../utils/api';

const Competition = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    grade: '',
    interestCategory: '',
    targetSchool: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeCategory, setActiveCategory] = useState('math');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await submitMessage({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        country: formData.interestCategory,
        message: `年级: ${formData.grade}, 目标学校: ${formData.targetSchool}, 备注: ${formData.message}`
      });
      if (res.success) {
        setSubmitted(true);
        setFormData({
          name: '', phone: '', email: '', grade: '',
          interestCategory: '', targetSchool: '', message: ''
        });
      }
    } catch (error) {
      setSubmitted(true);
    }
    setSubmitting(false);
  };

  const stats = [
    { value: '50+', label: '覆盖竞赛', desc: '国际权威赛事' },
    { value: '85%', label: '获奖率', desc: '远超行业平均' },
    { value: '200+', label: '金牌导师', desc: '竞赛获奖经历' },
    { value: 'TOP30', label: '名校录取', desc: '藤校/G5offer' }
  ];

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.553-.894L15 7m0 13V7m0 0L9 7" />
        </svg>
      ),
      title: '个性化规划',
      desc: '根据学生兴趣、能力和目标，量身定制竞赛路径'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      title: '权威竞赛资源',
      desc: '涵盖数学、物理、化学、生物、计算机等主流竞赛'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: '金牌教练团队',
      desc: '国际竞赛金牌选手+资深教练，传授实战经验'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      title: '申请竞争力',
      desc: '竞赛获奖经历大幅提升名校录取概率'
    }
  ];

  const competitionCategories = {
    math: {
      name: '数学竞赛',
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      competitions: [
        { name: 'AMC 8/10/12', slug: 'amc-8-10-12', fullName: '美国数学竞赛', difficulty: '中等', time: '每年11月' },
        { name: 'AIME', slug: 'aime', fullName: '美国数学邀请赛', difficulty: '困难', time: '每年2月' },
        { name: 'USAMO', slug: 'usamo', fullName: '美国数学奥林匹克', difficulty: '极难', time: '每年3月' },
        { name: 'BMO', slug: 'bmo', fullName: '英国数学奥林匹克', difficulty: '困难', time: '每年11月' },
        { name: 'HiMCM', slug: 'himcm', fullName: '美国高中生数学建模', difficulty: '中等', time: '每年10月' },
        { name: 'Euclid', slug: 'euclid', fullName: '欧几里得数学竞赛', difficulty: '中等', time: '每年4月' }
      ]
    },
    physics: {
      name: '物理竞赛',
      color: 'from-purple-500 to-violet-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      competitions: [
        { name: 'Physics Bowl', slug: 'physics-bowl', fullName: '物理碗', difficulty: '中等', time: '每年3月' },
        { name: 'F=ma', slug: 'f-ma', fullName: '美国物理奥赛初赛', difficulty: '困难', time: '每年2月' },
        { name: 'USAPhO', slug: 'usapho', fullName: '美国物理奥林匹克', difficulty: '极难', time: '每年3月' },
        { name: 'BPhO', slug: 'bpho', fullName: '英国物理奥林匹克', difficulty: '困难', time: '每年11月' },
        { name: 'CAP', slug: 'cap', fullName: '加拿大物理竞赛', difficulty: '中等', time: '每年4月' },
        { name: 'SIN', slug: 'sin', fullName: '加拿大牛顿物理竞赛', difficulty: '中等', time: '每年5月' }
      ]
    },
    chemistry: {
      name: '化学竞赛',
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      competitions: [
        { name: 'USNCO', slug: 'usnco', fullName: '美国化学奥林匹克', difficulty: '困难', time: '每年3月' },
        { name: 'UKChO', slug: 'ukcho', fullName: '英国化学奥林匹克', difficulty: '困难', time: '每年1月' },
        { name: 'CCC', slug: 'ccc', fullName: '加拿大化学竞赛', difficulty: '中等', time: '每年4月' },
        { name: 'CCO', slug: 'cco', fullName: '加拿大化学奥赛', difficulty: '困难', time: '每年9月' },
        { name: 'ASOC', slug: 'asoc', fullName: '澳洲化学奥林匹克', difficulty: '中等', time: '每年10月' },
        { name: 'Chem13', slug: 'chem13', fullName: '加拿大化学13考试', difficulty: '中等', time: '每年5月' }
      ]
    },
    biology: {
      name: '生物竞赛',
      color: 'from-rose-500 to-pink-600',
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-600',
      competitions: [
        { name: 'USABO', slug: 'usabo', fullName: '美国生物奥林匹克', difficulty: '困难', time: '每年4月' },
        { name: 'BBO', slug: 'bbo', fullName: '英国生物奥林匹克', difficulty: '困难', time: '每年4月' },
        { name: 'Brain Bee', slug: 'brain-bee', fullName: '脑科学大赛', difficulty: '中等', time: '每年3月' },
        { name: 'HOSA', slug: 'hosa', fullName: '生物与健康领袖挑战', difficulty: '中等', time: '每年1月' },
        { name: 'ASOB', slug: 'asob', fullName: '澳洲生物奥林匹克', difficulty: '中等', time: '每年10月' },
        { name: 'IBO', slug: 'ibo', fullName: '国际生物奥林匹克选拔赛', difficulty: '极难', time: '每年5月' }
      ]
    },
    computer: {
      name: '计算机竞赛',
      color: 'from-cyan-500 to-blue-600',
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-600',
      competitions: [
        { name: 'USACO', slug: 'usaco', fullName: '美国信息学奥林匹克', difficulty: '困难', time: '全年' },
        { name: 'NOIP', slug: 'noip', fullName: '全国信息学联赛', difficulty: '困难', time: '每年11月' },
        { name: 'ACS', slug: 'acs', fullName: '美国计算机科学联赛', difficulty: '中等', time: '每年12月' },
        { name: 'Kaggle', slug: 'kaggle', fullName: '数据科学竞赛', difficulty: '中等', time: '全年' },
        { name: 'Google Code-in', slug: 'google-code-in', fullName: '谷歌编程挑战赛', difficulty: '中等', time: '每年11月' },
        { name: 'FRC', slug: 'frc', fullName: 'FIRST机器人竞赛', difficulty: '困难', time: '每年1-4月' }
      ]
    },
    business: {
      name: '商科经济',
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
      competitions: [
        { name: 'NEC', slug: 'nec', fullName: '全美经济学挑战赛', difficulty: '中等', time: '每年12月' },
        { name: 'IEO', slug: 'ieo', fullName: '国际经济学奥林匹克', difficulty: '困难', time: '每年4月' },
        { name: 'FBLA', slug: 'fbla', fullName: '未来商业领袖挑战', difficulty: '中等', time: '每年1月' },
        { name: 'DECA', slug: 'deca', fullName: '商业挑战赛', difficulty: '中等', time: '每年4月' },
        { name: 'KWHS', slug: 'kwhs', fullName: '沃顿商业投资竞赛', difficulty: '中等', time: '每年9月' },
        { name: 'SIC', slug: 'sic', fullName: '中学生投资挑战赛', difficulty: '入门', time: '每年4月' }
      ]
    }
  };

  const mentors = [
    {
      name: 'Dr. Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      title: 'AMC/USAMO金牌教练',
      achievement: 'IMO金牌得主',
      experience: '12年竞赛辅导',
      students: '带出50+ USAMO qualifier'
    },
    {
      name: 'Dr. Wang',
     avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face',
      title: '物理竞赛金牌教练',
      achievement: 'IPhO金牌得主',
      experience: '10年竞赛辅导',
      students: '带出30+ USAPhO金牌'
    },
    {
      name: 'Dr. Liu',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face',
      title: '生物竞赛金牌教练',
      achievement: 'USABO满分教练',
      experience: '8年竞赛辅导',
      students: '带出20+ USABO semifinalist'
    },
    {
      name: 'Alex Zhang',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face',
      title: '计算机竞赛教练',
      achievement: 'USACO Platinum',
      experience: '7年编程教学',
      students: '带出100+ USACO晋级'
    }
  ];

  const successCases = [
    {
      name: '张同学',
      grade: '11年级',
      competitions: 'AMC12 Top 1%, AIME 12分',
      result: '录取 MIT 数学系',
      avatar: '👨‍🎓'
    },
    {
      name: '李同学',
      grade: '12年级',
      competitions: 'USABO Semifinalist, Brain Bee一等奖',
      result: '录取 斯坦福 生物系',
      avatar: '👩‍🎓'
    },
    {
      name: '王同学',
      grade: '11年级',
      competitions: 'USACO Platinum, Google Code-in Winner',
      result: '录取 CMU 计算机系',
      avatar: '👨‍🎓'
    }
  ];

  const processSteps = [
    { step: '01', title: '兴趣评估', desc: '了解学生兴趣、特长和目标院校', icon: '🎯' },
    { step: '02', title: '竞赛匹配', desc: '根据学生特点推荐合适竞赛', icon: '🔍' },
    { step: '03', title: '规划制定', desc: '制定长期竞赛规划和时间表', icon: '📋' },
    { step: '04', title: '系统培训', desc: '专业教练系统授课和辅导', icon: '🎓' },
    { step: '05', title: '真题训练', desc: '历年真题实战演练', icon: '📝' },
    { step: '06', title: '冲刺夺奖', desc: '赛前冲刺，冲击奖项', icon: '🏆' }
  ];

  const faqs = [
    { q: '几年级开始准备竞赛最合适？', a: '建议9-10年级开始规划，这样可以有充足的时间准备，同时不影响11年级的申请。但不同竞赛有不同要求，AMC等竞赛可以从更早开始。' },
    { q: '竞赛获奖对留学申请有多大帮助？', a: '国际竞赛获奖是学术能力的有力证明，尤其对于申请理工科专业。顶尖奖项如USAMO/USAPhO/USABO等更是藤校/G5录取的重要加分项。' },
    { q: '同时准备多个竞赛会不会影响成绩？', a: '我们建议学生根据自己的兴趣和时间，选择1-2个主竞赛重点准备。我们会帮助学生制定合理的时间规划，避免竞赛冲突。' },
    { q: '没有竞赛基础可以参加吗？', a: '当然可以！我们有针对不同基础的课程体系，从入门到冲刺都有相应的辅导方案。很多获奖学员都是从零基础开始的。' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900 py-20 lg:py-28 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-400/20 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center px-4 py-1.5 bg-amber-400/20 backdrop-blur-sm text-amber-300 text-sm font-medium rounded-full mb-6 border border-amber-400/30">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              85% 竞赛获奖率
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              国际竞赛规划<br />
              <span className="text-amber-300">为名校申请增添竞争力</span>
            </h1>
            <p className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto leading-relaxed mb-10">
              覆盖数学、物理、化学、生物、计算机等50+国际权威竞赛，
              金牌教练一对一指导，助力冲刺顶尖名校
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#consult-form"
                className="inline-flex items-center justify-center bg-white text-violet-700 hover:bg-purple-50 px-8 py-4 rounded-xl font-semibold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                免费竞赛评估
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 px-8 py-4 rounded-xl font-semibold transition-all border border-white/30"
              >
                了解竞赛详情
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="relative container mx-auto px-4 mt-16">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-purple-200 text-sm font-medium">{stat.label}</div>
                  <div className="text-white/60 text-xs mt-1">{stat.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-4 py-1.5 bg-violet-50 text-violet-700 text-sm font-medium rounded-full mb-4">
              核心优势
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              为什么选择我们的竞赛规划
            </h2>
            <p className="text-gray-600 text-lg">
              国际竞赛获奖经历是申请顶尖名校的重要加分项
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group bg-slate-50 rounded-2xl p-6 hover:bg-violet-50 hover:shadow-lg transition-all duration-300 border border-transparent hover:border-violet-200"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-purple-200 rounded-2xl flex items-center justify-center text-violet-600 mb-5 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Competition Categories */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-4 py-1.5 bg-amber-50 text-amber-700 text-sm font-medium rounded-full mb-4">
              竞赛项目
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              覆盖主流国际权威竞赛
            </h2>
            <p className="text-gray-600 text-lg">
              数学、物理、化学、生物、计算机、商科经济，总有一款适合你
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {Object.entries(competitionCategories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                  activeCategory === key
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                    : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {competitionCategories[activeCategory].competitions.map((comp, index) => (
              <Link 
                key={index} 
                to={`/competition/${comp.slug}`}
                className={`group bg-white rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300 border-l-4 ${competitionCategories[activeCategory].textColor.replace('text', 'border')} hover:-translate-y-1`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900 group-hover:text-violet-600 transition-colors">{comp.name}</h3>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${competitionCategories[activeCategory].bgColor} ${competitionCategories[activeCategory].textColor}`}>
                    {comp.difficulty}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mb-2">{comp.fullName}</p>
                <div className="flex items-center text-gray-400 text-xs">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {comp.time}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center text-violet-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  查看详情
                  <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Mentors Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full mb-4">
              金牌导师
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              国际竞赛金牌得主亲授
            </h2>
            <p className="text-gray-600 text-lg">
              资深竞赛教练团队，实战经验丰富
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mentors.map((mentor, index) => (
              <div 
                key={index} 
                className="group bg-slate-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={mentor.avatar} 
                    alt={mentor.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-bold text-lg">{mentor.name}</h3>
                    <p className="text-white/80 text-sm">{mentor.title}</p>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center mb-2">
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded">
                      {mentor.achievement}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">{mentor.experience}</p>
                  <p className="text-emerald-600 text-sm font-medium">{mentor.students}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Cases */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-4 py-1.5 bg-white/10 text-white/80 text-sm font-medium rounded-full mb-4 border border-white/20">
              成功案例
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              他们用竞赛成绩敲开名校大门
            </h2>
            <p className="text-purple-200 text-lg">
              每一个Offer背后，都有坚持与努力
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {successCases.map((student, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-3xl">
                    {student.avatar}
                  </div>
                  <div className="ml-3">
                    <h4 className="font-bold text-white">{student.name}</h4>
                    <p className="text-purple-200 text-sm">{student.grade}</p>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 mb-4">
                  <p className="text-amber-300 text-sm font-medium mb-1">竞赛成绩</p>
                  <p className="text-white text-sm">{student.competitions}</p>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-emerald-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-emerald-400 font-medium">{student.result}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-4 py-1.5 bg-cyan-50 text-cyan-700 text-sm font-medium rounded-full mb-4">
              服务流程
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              六步竞赛规划体系
            </h2>
            <p className="text-gray-600 text-lg">
              科学规划，确保最佳竞赛效果
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {processSteps.map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-slate-50 rounded-2xl p-5 text-center hover:bg-violet-50 transition-colors border border-transparent hover:border-violet-200">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className="text-2xl font-bold text-violet-400 mb-1">{item.step}</div>
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-500 text-xs">{item.desc}</p>
                </div>
                {index < 5 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 translate-x-1/2 z-10">
                    <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section id="consult-form" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-block px-4 py-1.5 bg-rose-50 text-rose-700 text-sm font-medium rounded-full mb-4">
                立即咨询
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                免费竞赛规划评估
              </h2>
              <p className="text-gray-600 text-lg">
                填写信息，我们的竞赛顾问将为您制定个性化规划方案
              </p>
            </div>

            {submitted ? (
              <div className="bg-white rounded-2xl shadow-card p-12 text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">提交成功！</h3>
                <p className="text-gray-600 mb-6">感谢您的预约，我们的竞赛顾问将在24小时内与您联系</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-violet-600 hover:text-violet-700 font-medium"
                >
                  继续预约 →
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-card p-8">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">姓名 *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                        placeholder="请输入您的姓名"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">电话 *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                        placeholder="请输入您的电话"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">邮箱</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                        placeholder="请输入您的邮箱"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">当前年级</label>
                      <select
                        name="grade"
                        value={formData.grade}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-white"
                      >
                        <option value="">请选择</option>
                        <option value="8年级及以下">8年级及以下</option>
                        <option value="9年级">9年级（初三）</option>
                        <option value="10年级">10年级（高一）</option>
                        <option value="11年级">11年级（高二）</option>
                        <option value="12年级">12年级（高三）</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">感兴趣学科</label>
                      <select
                        name="interestCategory"
                        value={formData.interestCategory}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-white"
                      >
                        <option value="">请选择</option>
                        <option value="数学">数学</option>
                        <option value="物理">物理</option>
                        <option value="化学">化学</option>
                        <option value="生物">生物</option>
                        <option value="计算机">计算机</option>
                        <option value="商科经济">商科经济</option>
                        <option value="多学科">多学科</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">目标院校</label>
                    <div className="flex flex-wrap gap-3">
                      {['藤校', 'MIT/斯坦福', '英国G5', 'TOP30', 'TOP50'].map((school) => (
                        <button
                          key={school}
                          type="button"
                          onClick={() => setFormData({ ...formData, targetSchool: school })}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            formData.targetSchool === school
                              ? 'bg-violet-600 text-white'
                              : 'bg-slate-100 text-gray-600 hover:bg-slate-200'
                          }`}
                        >
                          {school}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">补充信息</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                      placeholder="请描述您的竞赛目标、已有基础、计划申请的专业等信息..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white py-4 rounded-xl font-semibold transition-all shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 disabled:opacity-50"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        提交中...
                      </span>
                    ) : (
                      '立即预约免费咨询'
                    )}
                  </button>
                  
                  <p className="text-center text-gray-500 text-sm mt-4">
                    提交即表示您同意我们的隐私政策，您的信息将被严格保密
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-full mb-4">
              常见问题
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              关于竞赛规划的常见疑问
            </h2>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((item, index) => (
              <div key={index} className="bg-slate-50 rounded-xl p-6">
                <h4 className="font-bold text-gray-900 mb-2 flex items-start">
                  <span className="w-6 h-6 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-sm mr-3 flex-shrink-0">Q</span>
                  {item.q}
                </h4>
                <p className="text-gray-600 ml-9">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Competition;
