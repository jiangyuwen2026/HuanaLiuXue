import { useState } from 'react';
import { Link } from 'react-router-dom';
import { submitMessage } from '../utils/api';

const EnglishTraining = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    targetExam: '',
    currentLevel: '',
    targetScore: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeCourse, setActiveCourse] = useState('ielts');

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
        country: formData.targetExam.toUpperCase(),
        message: `英语水平: ${formData.currentLevel}, 目标分数: ${formData.targetScore}, 备注: ${formData.message}`
      });
      if (res.success) {
        setSubmitted(true);
        setFormData({
          name: '', phone: '', email: '', targetExam: '',
          currentLevel: '', targetScore: '', message: ''
        });
      }
    } catch (error) {
      // 模拟成功
      setSubmitted(true);
    }
    setSubmitting(false);
  };

  const stats = [
    { value: '95%', label: '学员提分率', desc: '平均提升1-2分' },
    { value: '8.5', label: '雅思最高分', desc: '单项满分学员众多' },
    { value: '115', label: '托福最高分', desc: '冲刺前10%分数' },
    { value: '1000+', label: '高分学员', desc: '累计成功案例' }
  ];

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: '个性化学习方案',
      desc: '根据学员基础和目标分数，定制专属学习计划，精准提分'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      title: '真题实战演练',
      desc: '海量真题库+独家模拟题，熟悉考试题型，掌握出题规律'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: '资深名师授课',
      desc: '雅思8.5+/托福110+教师团队，平均8年以上教学经验'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: '全程进度追踪',
      desc: '定期模考评估，实时调整学习策略，确保每一步都在进步'
    }
  ];

  const courses = {
    ielts: [
      {
        name: '雅思基础班',
        target: '目标分数 5.5-6.0',
        duration: '8周课程',
        features: ['语法基础强化', '词汇系统积累', '听说读写入门', '小班互动教学'],
        price: '¥8,800',
        popular: false
      },
      {
        name: '雅思精品班',
        target: '目标分数 6.5-7.0',
        duration: '10周课程',
        features: ['全科技巧精讲', '真题深度解析', '口语外教陪练', '作文精批反馈'],
        price: '¥12,800',
        popular: true
      },
      {
        name: '雅思冲刺班',
        target: '目标分数 7.0-7.5+',
        duration: '6周强化',
        features: ['高分技巧特训', '考前预测押题', 'VIP一对一辅导', '无限模考机会'],
        price: '¥15,800',
        popular: false
      }
    ],
    toefl: [
      {
        name: '托福基础班',
        target: '目标分数 60-80',
        duration: '8周课程',
        features: ['词汇量突破', '语法基础夯实', '听力阅读入门', '写作口语起步'],
        price: '¥8,800',
        popular: false
      },
      {
        name: '托福强化班',
        target: '目标分数 80-100',
        duration: '10周课程',
        features: ['听说读写强化', '真题实战演练', '机考系统训练', '专项突破弱项'],
        price: '¥12,800',
        popular: true
      },
      {
        name: '托福冲刺班',
        target: '目标分数 100-110+',
        duration: '6周强化',
        features: ['高分策略特训', '考前精准预测', '一对一弱项攻克', '全真模考演练'],
        price: '¥15,800',
        popular: false
      }
    ]
  };

  const teachers = [
    {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
      title: '雅思口语/写作',
      score: '雅思8.5分',
      experience: '10年教学经验',
      desc: '英国剑桥大学硕士，前雅思考官，擅长口语写作高分突破'
    },
    {
      name: 'Michael Wang',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
      title: '托福听力/阅读',
      score: '托福118分',
      experience: '8年教学经验',
      desc: '美国加州大学博士，独创托福听力笔记法，帮助数千学员突破听力难关'
    },
    {
      name: 'Emily Liu',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
      title: '雅思阅读/听力',
      score: '雅思8.0分',
      experience: '6年教学经验',
      desc: '澳洲国立大学硕士，擅长阅读速度提升和听力精讲，提分率95%+'
    },
    {
      name: 'David Zhang',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
      title: '托福口语/写作',
      score: '托福115分',
      experience: '9年教学经验',
      desc: '加拿大多伦多大学硕士，专注口语写作模板定制，快速提分专家'
    }
  ];

  const process = [
    { step: '01', title: '水平测试', desc: '专业英语水平评估', icon: '📊' },
    { step: '02', title: '方案定制', desc: '个性化学习规划', icon: '📝' },
    { step: '03', title: '系统学习', desc: '名师精讲各科技巧', icon: '🎓' },
    { step: '04', title: '真题演练', desc: '大量练习巩固提升', icon: '📚' },
    { step: '05', title: '模考冲刺', desc: '全真模拟考前冲刺', icon: '🎯' }
  ];

  const faqs = [
    { q: '雅思和托福哪个更适合我？', a: '取决于您的留学目标。雅思更适合英联邦国家（英国、澳洲、加拿大等），托福更适合北美。我们可以根据您的目标院校为您推荐最适合的考试。' },
    { q: '零基础多久可以达到目标分数？', a: '零基础到雅思6.0或托福80分通常需要3-4个月系统学习。具体时长取决于每周学习时间投入和学习效率。' },
    { q: '课程可以试听吗？', a: '当然可以！我们提供免费试听课，您可以体验教学风格和课程内容后再决定是否报名。' },
    { q: '如果考试没过可以重修吗？', a: '我们提供保障服务：达到出勤率要求但未能达标的学员，可免费重修一次相应课程。' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 py-20 lg:py-28 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium rounded-full mb-6 border border-white/20">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              95% 学员成功提分
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              雅思 · 托福专业培训<br />
              <span className="text-cyan-300">助力冲刺世界名校</span>
            </h1>
            <p className="text-lg md:text-xl text-cyan-100 max-w-2xl mx-auto leading-relaxed mb-10">
              资深名师团队，个性化学习方案，科学备考体系，
              帮助您快速突破语言关，实现留学梦想
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#consult-form"
                className="inline-flex items-center justify-center bg-white text-emerald-700 hover:bg-cyan-50 px-8 py-4 rounded-xl font-semibold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                免费试听课程
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 px-8 py-4 rounded-xl font-semibold transition-all border border-white/30"
              >
                了解课程详情
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
                  <div className="text-cyan-200 text-sm font-medium">{stat.label}</div>
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
            <span className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full mb-4">
              核心优势
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              为什么选择我们的英语培训
            </h2>
            <p className="text-gray-600 text-lg">
              专业团队，科学方法，助您快速提升英语成绩
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group bg-slate-50 rounded-2xl p-6 hover:bg-emerald-50 hover:shadow-lg transition-all duration-300 border border-transparent hover:border-emerald-200"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-200 rounded-2xl flex items-center justify-center text-emerald-600 mb-5 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-full mb-4">
              精品课程
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              满足不同目标分数需求
            </h2>
            <p className="text-gray-600 text-lg">
              科学分层教学，从基础到冲刺，总有一款适合您
            </p>
          </div>

          {/* Course Tabs */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-white rounded-xl p-1 shadow-sm">
              <button
                onClick={() => setActiveCourse('ielts')}
                className={`px-8 py-3 rounded-lg font-medium transition-all ${
                  activeCourse === 'ielts'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                雅思课程
              </button>
              <button
                onClick={() => setActiveCourse('toefl')}
                className={`px-8 py-3 rounded-lg font-medium transition-all ${
                  activeCourse === 'toefl'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                托福课程
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses[activeCourse].map((course, index) => (
              <div 
                key={index} 
                className={`group bg-white rounded-2xl overflow-hidden transition-all duration-300 ${
                  course.popular 
                    ? 'shadow-card-hover ring-2 ring-emerald-500 scale-105' 
                    : 'shadow-card hover:shadow-card-hover'
                }`}
              >
                {course.popular && (
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-center py-2 text-sm font-medium">
                    🔥 最受欢迎
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{course.name}</h3>
                  <p className={`font-medium mb-4 ${activeCourse === 'ielts' ? 'text-emerald-600' : 'text-blue-600'}`}>
                    {course.target}
                  </p>
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {course.duration}
                  </div>
                  <ul className="space-y-2 mb-6">
                    {course.features.map((f, i) => (
                      <li key={i} className="flex items-center text-gray-600 text-sm">
                        <svg className={`w-4 h-4 mr-2 ${activeCourse === 'ielts' ? 'text-emerald-500' : 'text-blue-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-gray-400 text-sm">课程费用</span>
                      <div className="text-2xl font-bold text-gray-900">{course.price}</div>
                    </div>
                    <button className={`px-6 py-2 rounded-lg font-medium transition-all ${
                      activeCourse === 'ielts'
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}>
                      立即报名
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teachers Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-4 py-1.5 bg-amber-50 text-amber-700 text-sm font-medium rounded-full mb-4">
              名师团队
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              资深教师一对一指导
            </h2>
            <p className="text-gray-600 text-lg">
              雅思8.5+/托福110+高分教师，平均8年以上教学经验
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teachers.map((teacher, index) => (
              <div 
                key={index} 
                className="group bg-slate-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={teacher.avatar} 
                    alt={teacher.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-bold text-lg">{teacher.name}</h3>
                    <p className="text-white/80 text-sm">{teacher.title}</p>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                      {teacher.score}
                    </span>
                    <span className="text-gray-500 text-xs">{teacher.experience}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{teacher.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-4 py-1.5 bg-white/10 text-white/80 text-sm font-medium rounded-full mb-4 border border-white/20">
              学习流程
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              科学的学习路径
            </h2>
            <p className="text-cyan-200 text-lg">
              五步教学法，确保学习效果最大化
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {process.map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10 hover:bg-white/20 transition-colors">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <div className="text-3xl font-bold text-emerald-400 mb-2">{item.step}</div>
                  <h3 className="font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-cyan-200/80 text-sm">{item.desc}</p>
                </div>
                {index < 4 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 translate-x-1/2 z-10">
                    <svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-4 py-1.5 bg-rose-50 text-rose-700 text-sm font-medium rounded-full mb-4">
              学员成绩
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              他们用成绩证明实力
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: '李同学', before: '雅思5.5', after: '雅思7.0', duration: '3个月', school: '英国曼彻斯特大学录取' },
              { name: '张同学', before: '托福75', after: '托福105', duration: '4个月', school: '美国纽约大学录取' },
              { name: '王同学', before: '雅思6.0', after: '雅思7.5', duration: '2个月', school: '澳洲悉尼大学录取' }
            ].map((student, index) => (
              <div key={index} className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-gray-900">{student.name}</h4>
                  <span className="text-emerald-600 text-sm font-medium">{student.duration}</span>
                </div>
                <div className="flex items-center justify-between mb-4 bg-white rounded-xl p-4">
                  <div className="text-center">
                    <div className="text-gray-400 text-xs mb-1">入学前</div>
                    <div className="text-gray-500 font-medium">{student.before}</div>
                  </div>
                  <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  <div className="text-center">
                    <div className="text-emerald-600 text-xs mb-1">结课后</div>
                    <div className="text-emerald-700 font-bold text-lg">{student.after}</div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{student.school}</p>
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
              <span className="inline-block px-4 py-1.5 bg-cyan-50 text-cyan-700 text-sm font-medium rounded-full mb-4">
                立即预约
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                免费试听 + 水平测试
              </h2>
              <p className="text-gray-600 text-lg">
                填写信息，我们的课程顾问将在24小时内与您联系
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
                <p className="text-gray-600 mb-6">感谢您的预约，我们的课程顾问将在24小时内与您联系安排试听</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
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
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
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
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
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
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        placeholder="请输入您的邮箱"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">意向考试</label>
                      <select
                        name="targetExam"
                        value={formData.targetExam}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
                      >
                        <option value="">请选择</option>
                        <option value="雅思">雅思 IELTS</option>
                        <option value="托福">托福 TOEFL</option>
                        <option value="两者">两者都需要</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">当前水平</label>
                      <select
                        name="currentLevel"
                        value={formData.currentLevel}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
                      >
                        <option value="">请选择</option>
                        <option value="零基础">零基础</option>
                        <option value="基础">基础 (4-5分/40-60)</option>
                        <option value="中级">中级 (5-6分/60-80)</option>
                        <option value="高级">高级 (6-7分/80-100)</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">目标分数</label>
                    <div className="flex flex-wrap gap-3">
                      {['6.0/80分', '6.5/90分', '7.0/100分', '7.5+/110+'].map((score) => (
                        <button
                          key={score}
                          type="button"
                          onClick={() => setFormData({ ...formData, targetScore: score })}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            formData.targetScore === score
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-gray-600 hover:bg-slate-200'
                          }`}
                        >
                          {score}
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
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      placeholder="请描述您的英语学习目标、计划考试时间、目标院校等信息..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white py-4 rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 disabled:opacity-50"
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
                      '立即预约免费试听'
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
              关于英语培训的常见疑问
            </h2>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((item, index) => (
              <div key={index} className="bg-slate-50 rounded-xl p-6">
                <h4 className="font-bold text-gray-900 mb-2 flex items-start">
                  <span className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm mr-3 flex-shrink-0">Q</span>
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

export default EnglishTraining;
