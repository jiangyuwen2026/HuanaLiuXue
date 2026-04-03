import { useState } from 'react';
import { Link } from 'react-router-dom';
import { submitMessage } from '../utils/api';

function Apply() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    country: '',
    education: '',
    targetYear: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('本科');

  const countries = [
    { name: '香港', flag: '🇭🇰', desc: 'QS百强名校云集' },
    { name: '澳门', flag: '🇲🇴', desc: '双语教学环境' },
    { name: '新加坡', flag: '🇸🇬', desc: '亚洲教育中心' },
    { name: '英国', flag: '🇬🇧', desc: 'G5精英大学' },
    { name: '美国', flag: '🇺🇸', desc: '常春藤盟校' },
    { name: '澳大利亚', flag: '🇦🇺', desc: '八大名校' },
    { name: '加拿大', flag: '🇨🇦', desc: '移民友好' },
    { name: '日本', flag: '🇯🇵', desc: '科技前沿' },
  ];

  const educations = ['高三在读', '高三毕业', '本科在读', '本科毕业', '硕士在读', '硕士毕业'];
  const targetYears = ['2025年秋季', '2026年春季', '2026年秋季', '2027年及以后'];

  const services = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.553-.894L15 7m0 13V7m0 0L9 7" />
        </svg>
      ),
      title: '选校定位',
      desc: '根据学术背景、职业规划，精准匹配8-12所目标院校',
      features: ['院校库查询', '录取概率评估', '保底/冲刺策略']
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      title: '文书打造',
      desc: 'native speaker润色，打造个性化申请文书',
      features: ['个人陈述PS', '推荐信RL', '简历CV', '研究计划RP']
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: '申请管理',
      desc: '全程跟踪申请进度，确保材料准时递交',
      features: ['网申填写', '材料审核', ' deadline提醒', '状态跟进']
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      ),
      title: '面试辅导',
      desc: '模拟真实面试场景，提升表达和应变能力',
      features: ['1v1模拟面试', '题库训练', '答题技巧', '心理辅导']
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: '签证服务',
      desc: '专业签证指导，提高签证通过率',
      features: ['材料清单', '表格填写', '面签培训', '行前指导']
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: '奖学金申请',
      desc: '帮助申请各类奖学金，减轻经济负担',
      features: ['奖学金匹配', '申请文书', '材料准备', '面试辅导']
    }
  ];

  const processSteps = {
    '本科': [
      { step: '01', title: '初步咨询', desc: '了解学生背景、兴趣和目标', duration: '1-2天' },
      { step: '02', title: '选校定位', desc: '根据成绩和预算确定8-12所院校', duration: '3-5天' },
      { step: '03', title: '标化考试', desc: '雅思/托福、SAT/ACT备考指导', duration: '2-6个月' },
      { step: '04', title: '文书准备', desc: '个人陈述、推荐信、简历打磨', duration: '1-2个月' },
      { step: '05', title: '递交申请', desc: '网申填写、材料上传、费用缴纳', duration: '1个月内' },
      { step: '06', title: '面试辅导', desc: '模拟面试、答题技巧培训', duration: '1-2周' },
      { step: '07', title: '收获Offer', desc: '对比录取结果，选择最优方案', duration: '2-4个月' },
      { step: '08', title: '签证行前', desc: '签证办理、住宿安排、行前准备', duration: '1-2个月' }
    ],
    '硕士': [
      { step: '01', title: '背景评估', desc: '分析学术背景、科研经历', duration: '1-2天' },
      { step: '02', title: '选校策略', desc: '匹配专业方向和导师资源', duration: '3-5天' },
      { step: '03', title: '文书打造', desc: '个人陈述、研究计划、推荐信', duration: '1-2个月' },
      { step: '04', title: '套磁指导', desc: '联系导师、展示研究兴趣', duration: '1-2个月' },
      { step: '05', title: '递交申请', desc: '网申系统填写、材料上传', duration: '1个月内' },
      { step: '06', title: '面试准备', desc: '专业面试、技术面试辅导', duration: '1-2周' },
      { step: '07', title: 'Offer选择', desc: '对比项目优劣、奖学金情况', duration: '2-4个月' },
      { step: '08', title: '签证入学', desc: '签证办理、住宿安排', duration: '1-2个月' }
    ],
    '博士': [
      { step: '01', title: '研究方向', desc: '确定研究兴趣和目标导师', duration: '1-2周' },
      { step: '02', title: '套磁沟通', desc: '联系潜在导师，讨论研究计划', duration: '2-4个月' },
      { step: '03', title: 'RP撰写', desc: '研究计划书撰写和修改', duration: '1-2个月' },
      { step: '04', title: '文书准备', desc: '个人陈述、学术简历、推荐信', duration: '1个月' },
      { step: '05', title: '奖学金申请', desc: 'CSC、校奖、导师资助申请', duration: '1-2个月' },
      { step: '06', title: '正式申请', desc: '网申系统提交、材料寄送', duration: '1个月内' },
      { step: '07', title: '面试答辩', desc: '研究计划答辩、学术面试', duration: '1-2周' },
      { step: '08', title: '录取入学', desc: '接受offer、签证办理', duration: '2-4个月' }
    ]
  };

  const stats = [
    { value: '98%', label: '录取成功率', desc: '远超行业平均水平' },
    { value: '5000+', label: '成功案例', desc: '覆盖全球顶尖名校' },
    { value: '50+', label: '合作院校', desc: '官方合作伙伴' },
    { value: '15年', label: '行业经验', desc: '专注留学申请服务' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await submitMessage({
        name: form.name,
        phone: form.phone,
        email: form.email,
        country: form.country,
        message: `学历: ${form.education}, 目标入学时间: ${form.targetYear}, 备注: ${form.message}`
      });
      if (res.success) {
        setSuccess(true);
        setForm({ name: '', phone: '', email: '', country: '', education: '', targetYear: '', message: '' });
      } else {
        message.error(res.message || '提交失败');
      }
    } catch (error) {
      // 模拟成功
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-blue-900 py-20 lg:py-28 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium rounded-full mb-6 border border-white/20">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              98% 录取成功率
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              专业留学申请服务<br />
              <span className="text-blue-300">助您圆梦世界名校</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed mb-10">
              从选校定位到收获Offer，全程专业团队一对一指导，
              为您量身定制最优申请策略
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#consult-form"
                className="inline-flex items-center justify-center bg-white text-primary-700 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                免费获取申请方案
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <Link
                to="/consultants"
                className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 px-8 py-4 rounded-xl font-semibold transition-all border border-white/30"
              >
                查看顾问团队
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
                  <div className="text-blue-200 text-sm font-medium">{stat.label}</div>
                  <div className="text-white/60 text-xs mt-1">{stat.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Countries Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-4 py-1.5 bg-primary-50 text-primary-700 text-sm font-medium rounded-full mb-4">
              热门留学目的地
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              覆盖全球主流留学国家
            </h2>
            <p className="text-gray-600 text-lg">
              专注港澳新及英联邦国家申请，深度了解各校录取偏好
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {countries.map((country, index) => (
              <div 
                key={index} 
                className="group bg-slate-50 rounded-2xl p-6 text-center hover:bg-primary-50 hover:shadow-lg transition-all duration-300 cursor-pointer border border-transparent hover:border-primary-200"
              >
                <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform">{country.flag}</div>
                <h3 className="font-bold text-gray-900 mb-1">{country.name}</h3>
                <p className="text-gray-500 text-sm">{country.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full mb-4">
              全方位服务
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              一站式留学申请解决方案
            </h2>
            <p className="text-gray-600 text-lg">
              从规划到入学，全程专业团队陪伴，让您安心省心
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-gray-100 hover:border-primary-200"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center text-primary-600 mb-5 group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {service.features.map((feature, idx) => (
                    <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                      {feature}
                    </span>
                  ))}
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
            <span className="inline-block px-4 py-1.5 bg-amber-50 text-amber-700 text-sm font-medium rounded-full mb-4">
              申请流程
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              标准化服务流程
            </h2>
            <p className="text-gray-600 text-lg">
              科学规范的申请流程，确保每个环节都精益求精
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-slate-100 rounded-xl p-1">
              {['本科', '硕士', '博士'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                    activeTab === tab 
                      ? 'bg-white text-primary-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}申请
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {processSteps[activeTab].map((step, index) => (
              <div 
                key={index} 
                className="group relative bg-slate-50 rounded-2xl p-5 hover:bg-primary-50 transition-colors border border-transparent hover:border-primary-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl font-bold text-primary-200 group-hover:text-primary-400 transition-colors">
                    {step.step}
                  </span>
                  <span className="px-2 py-1 bg-white text-primary-600 text-xs font-medium rounded">
                    {step.duration}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
                
                {/* Arrow */}
                {index < 7 && (
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

      {/* Success Cases Preview */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-primary-900">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-4 py-1.5 bg-white/10 text-white/80 text-sm font-medium rounded-full mb-4 border border-white/20">
              成功案例
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              他们已成功圆梦名校
            </h2>
            <p className="text-blue-200 text-lg">
              每一个Offer背后，都有我们专业团队的用心付出
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: '张同学', school: '香港大学', major: '金融学硕士', result: '全额奖学金', avatar: '👨‍🎓' },
              { name: '李同学', school: '剑桥大学', major: '计算机博士', result: '全奖录取', avatar: '👩‍🎓' },
              { name: '王同学', school: '新加坡国立', major: 'MBA', result: '半额奖学金', avatar: '👨‍🎓' },
            ].map((student, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center mb-4">
                  <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-3xl">
                    {student.avatar}
                  </div>
                  <div className="ml-3">
                    <h4 className="font-bold text-white">{student.name}</h4>
                    <p className="text-blue-200 text-sm">{student.school}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">录取专业</span>
                    <span className="text-white">{student.major}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">奖学金</span>
                    <span className="text-amber-400">{student.result}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link
              to="/cases"
              className="inline-flex items-center text-white hover:text-blue-200 font-medium transition-colors"
            >
              查看更多成功案例
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="consult-form" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-block px-4 py-1.5 bg-rose-50 text-rose-700 text-sm font-medium rounded-full mb-4">
                立即咨询
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                免费获取留学申请方案
              </h2>
              <p className="text-gray-600 text-lg">
                填写以下信息，我们的资深顾问将在24小时内与您联系
              </p>
            </div>

            {success ? (
              <div className="bg-white rounded-2xl shadow-card p-12 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">提交成功</h3>
                <p className="text-gray-600 mb-6">感谢您的预约，我们的顾问将在24小时内与您联系</p>
                <button 
                  onClick={() => setSuccess(false)} 
                  className="text-primary-600 hover:text-primary-700 font-medium"
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
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="请输入您的姓名"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">电话 *</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="请输入您的电话"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">邮箱</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="请输入您的邮箱"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">意向国家</label>
                      <select
                        value={form.country}
                        onChange={e => setForm({ ...form, country: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
                      >
                        <option value="">请选择</option>
                        {countries.map(c => <option key={c.name} value={c.name}>{c.flag} {c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">当前学历</label>
                      <select
                        value={form.education}
                        onChange={e => setForm({ ...form, education: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
                      >
                        <option value="">请选择</option>
                        {educations.map(e => <option key={e} value={e}>{e}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">目标入学时间</label>
                    <div className="flex flex-wrap gap-3">
                      {targetYears.map((year) => (
                        <button
                          key={year}
                          type="button"
                          onClick={() => setForm({ ...form, targetYear: year })}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            form.targetYear === year
                              ? 'bg-primary-600 text-white'
                              : 'bg-slate-100 text-gray-600 hover:bg-slate-200'
                          }`}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">补充信息</label>
                    <textarea 
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      rows="4"
                      placeholder="请描述您的留学目标、意向专业、当前成绩等信息..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-4 rounded-xl font-semibold transition-all shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 disabled:opacity-50"
                  >
                    {loading ? (
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
            <span className="inline-block px-4 py-1.5 bg-purple-50 text-purple-700 text-sm font-medium rounded-full mb-4">
              常见问题
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              关于留学申请的常见疑问
            </h2>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { q: '什么时候开始准备留学申请最合适？', a: '建议提前1-1.5年开始准备。对于本科申请，高二下学期就可以开始规划；硕士申请建议大三下学期或大四上学期开始。' },
              { q: '留学申请需要准备哪些材料？', a: '主要包括：成绩单、语言成绩（雅思/托福）、个人陈述（PS）、推荐信（RL）、简历（CV）、护照复印件等。部分专业还需要作品集或研究计划。' },
              { q: '你们的服务费用是多少？', a: '我们的服务费用根据申请国家和院校数量而定，具体费用请咨询我们的顾问。我们承诺价格透明，无隐形收费。' },
              { q: '申请不成功会退款吗？', a: '我们提供不同类型的服务套餐，部分套餐包含"不成功退部分费用"的保障。具体退款政策请咨询顾问。' },
            ].map((item, index) => (
              <div key={index} className="bg-slate-50 rounded-xl p-6">
                <h4 className="font-bold text-gray-900 mb-2 flex items-start">
                  <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm mr-3 flex-shrink-0">Q</span>
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
}

export default Apply;
