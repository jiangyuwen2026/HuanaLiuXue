import { useState } from 'react';
import { Link } from 'react-router-dom';
import { submitMessage } from '../utils/api';

const Research = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    grade: '',
    interestField: '',
    targetLevel: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeField, setActiveField] = useState('cs');

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
        country: formData.interestField,
        message: `年级: ${formData.grade}, 目标水平: ${formData.targetLevel}, 备注: ${formData.message}`
      });
      if (res.success) {
        setSubmitted(true);
        setFormData({
          name: '', phone: '', email: '', grade: '',
          interestField: '', targetLevel: '', message: ''
        });
      }
    } catch (error) {
      setSubmitted(true);
    }
    setSubmitting(false);
  };

  const stats = [
    { value: '100+', label: '合作导师', desc: '顶尖院校教授' },
    { value: '90%', label: '论文发表率', desc: 'EI/CPCI/SCI' },
    { value: '500+', label: '科研学员', desc: '累计培养' },
    { value: 'TOP50', label: '名校录取', desc: '藤校/G5占比' }
  ];

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      title: '前沿课题选择',
      desc: '对接最新科研热点，提供符合兴趣的跨学科研究方向'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: '顶尖导师指导',
      desc: 'MIT、斯坦福、哈佛、清北等顶尖院校的教授/博士指导'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: '学术论文发表',
      desc: '指导发表EI/CPCI国际会议论文或SCI期刊论文'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: '独立研究成果',
      desc: '完成独立研究项目，获得可展示的科研成果和推荐信'
    }
  ];

  const researchFields = {
    cs: {
      name: '计算机科学',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      icon: '💻',
      topics: ['人工智能', '机器学习', '深度学习', '计算机视觉', '自然语言处理', '网络安全', '区块链', '数据科学']
    },
    engineering: {
      name: '工程技术',
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      icon: '⚙️',
      topics: ['电子工程', '机械工程', '材料科学', '能源工程', '机器人', '自动化', '航空航天', '生物医学工程']
    },
    biomed: {
      name: '生物医学',
      color: 'from-rose-500 to-pink-600',
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-600',
      icon: '🧬',
      topics: ['基因工程', '生物信息学', '药物研发', '神经科学', '免疫学', '癌症研究', '干细胞', '公共卫生']
    },
    business: {
      name: '商科经济',
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
      icon: '📊',
      topics: ['数据分析', '金融科技', '行为经济学', '市场营销', '供应链管理', '创业研究', 'ESG', '国际贸易']
    },
    social: {
      name: '社会科学',
      color: 'from-violet-500 to-purple-600',
      bgColor: 'bg-violet-50',
      textColor: 'text-violet-600',
      icon: '🌍',
      topics: ['心理学', '社会学', '教育学', '国际关系', '公共政策', '传媒研究', '环境研究', '性别研究']
    },
    math: {
      name: '数理统计',
      color: 'from-indigo-500 to-blue-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      icon: '📈',
      topics: ['概率统计', '数学建模', '优化理论', '量化金融', '运筹学', '图论', '密码学', '数值分析']
    }
  };

  const programs = [
    {
      name: '科研启蒙项目',
      duration: '1-2个月',
      suitable: '9-10年级',
      features: ['科研方法论入门', '文献阅读训练', '研究课题初探', '项目证书'],
      outcome: '科研思维建立',
      price: '¥15,800',
      tag: '入门首选'
    },
    {
      name: '科研提升项目',
      duration: '3-6个月',
      suitable: '10-11年级',
      features: ['完整科研流程', '导师一对一指导', '研究报告产出', '导师推荐信'],
      outcome: '高质量研究报告',
      price: '¥38,800',
      tag: '热门推荐'
    },
    {
      name: '论文发表项目',
      duration: '6-12个月',
      suitable: '11-12年级',
      features: ['EI/CPCI会议发表', 'SCI期刊指导', '独立作者论文', '名校申请加分'],
      outcome: '国际会议/期刊论文',
      price: '¥68,800',
      tag: '冲刺名校'
    }
  ];

  const mentors = [
    {
      name: 'Prof. Smith',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      title: 'MIT 计算机教授',
      research: '人工智能与机器学习',
      papers: 'Nature/Science 20+',
      students: '指导50+学生发表论文'
    },
    {
      name: 'Prof. Johnson',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face',
      title: '斯坦福 生物教授',
      research: '生物医学工程',
      papers: 'Cell/Science 15+',
      students: '30+学生进藤校'
    },
    {
      name: 'Dr. Li',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face',
      title: '清华 经济学副教授',
      research: '行为经济学',
      papers: 'SSCI期刊30+',
      students: '20+学生发表论文'
    },
    {
      name: 'Prof. Wang',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face',
      title: '哈佛 心理学博士',
      research: '认知神经科学',
      papers: 'Neuron/Nature 10+',
      students: '15+学生进Top10'
    }
  ];

  const successCases = [
    {
      name: '陈同学',
      grade: '11年级',
      field: '计算机科学',
      achievement: 'AI医疗影像识别研究，发表IEEE会议论文',
      result: '录取 卡内基梅隆大学'
    },
    {
      name: '林同学',
      grade: '12年级',
      field: '生物医学',
      achievement: 'CRISPR基因编辑研究，发表SCI期刊论文',
      result: '录取 约翰霍普金斯大学'
    },
    {
      name: '赵同学',
      grade: '11年级',
      field: '经济学',
      achievement: '数字货币市场分析研究，发表CPCI会议论文',
      result: '录取 宾夕法尼亚大学沃顿商学院'
    }
  ];

  const processSteps = [
    { step: '01', title: '兴趣评估', desc: '了解学术兴趣与目标', icon: '🎯' },
    { step: '02', title: '导师匹配', desc: '匹配合适的科研导师', icon: '👨‍🏫' },
    { step: '03', title: '课题确定', desc: '确定具体研究方向', icon: '🔬' },
    { step: '04', title: '科研开展', desc: '系统开展研究工作', icon: '📊' },
    { step: '05', title: '论文撰写', desc: '指导完成学术论文', icon: '✍️' },
    { step: '06', title: '成果发表', desc: '协助投稿与发表', icon: '📄' }
  ];

  const faqs = [
    { q: '没有科研基础可以参加吗？', a: '当然可以！我们有针对不同基础的课程体系。科研启蒙项目专门为零基础学生设计，导师会从最基础的科研方法论开始教学。' },
    { q: '科研项目对申请有多大帮助？', a: '科研经历是顶尖名校（尤其是藤校和G5）非常看重的要素。独立完成的科研成果、发表的论文以及导师的推荐信，都是申请中的重要加分项。' },
    { q: '论文发表需要多长时间？', a: 'EI/CPCI国际会议论文通常需要6-9个月，SCI期刊论文则需要12-18个月。我们会根据申请时间节点，为您规划最合适的发表方案。' },
    { q: '导师都是什么背景？', a: '我们的导师来自MIT、斯坦福、哈佛、牛津、剑桥、清北等世界顶尖院校，均为相关领域的教授或博士，具有丰富的科研和指导经验。' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-blue-800 to-cyan-900 py-20 lg:py-28 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center px-4 py-1.5 bg-white/10 backdrop-blur-sm text-cyan-300 text-sm font-medium rounded-full mb-6 border border-white/20">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              90% 论文发表成功率
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              科研背景提升<br />
              <span className="text-cyan-300">助力冲刺顶尖名校</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed mb-10">
              与世界顶尖院校教授合作，完成独立科研项目，
              发表国际论文，获得权威推荐信
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#consult-form"
                className="inline-flex items-center justify-center bg-white text-indigo-700 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                免费科研评估
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 px-8 py-4 rounded-xl font-semibold transition-all border border-white/30"
              >
                了解项目详情
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
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-full mb-4">
              核心优势
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              为什么选择我们的科研项目
            </h2>
            <p className="text-gray-600 text-lg">
              专业的科研指导，帮助你产出高质量的研究成果
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group bg-slate-50 rounded-2xl p-6 hover:bg-blue-50 hover:shadow-lg transition-all duration-300 border border-transparent hover:border-blue-200"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-200 rounded-2xl flex items-center justify-center text-blue-600 mb-5 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Fields */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full mb-4">
              研究领域
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              涵盖多学科前沿领域
            </h2>
            <p className="text-gray-600 text-lg">
              覆盖STEM、商科、社科等多个学科方向
            </p>
          </div>

          {/* Field Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {Object.entries(researchFields).map(([key, field]) => (
              <button
                key={key}
                onClick={() => setActiveField(key)}
                className={`flex items-center px-5 py-2.5 rounded-xl font-medium transition-all ${
                  activeField === key
                    ? `bg-gradient-to-r ${field.color} text-white shadow-lg`
                    : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
                }`}
              >
                <span className="mr-2">{field.icon}</span>
                {field.name}
              </button>
            ))}
          </div>
          
          <div className="bg-white rounded-2xl shadow-card p-8">
            <div className="flex items-center mb-6">
              <span className="text-4xl mr-3">{researchFields[activeField].icon}</span>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{researchFields[activeField].name}</h3>
                <p className="text-gray-500">热门研究方向</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {researchFields[activeField].topics.map((topic, i) => (
                <span 
                  key={i} 
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    researchFields[activeField].bgColor
                  } ${researchFields[activeField].textColor} hover:shadow-md cursor-pointer`}
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-4 py-1.5 bg-amber-50 text-amber-700 text-sm font-medium rounded-full mb-4">
              项目类型
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              适合不同阶段的科研项目
            </h2>
            <p className="text-gray-600 text-lg">
              从科研启蒙到论文发表，总有一款适合你
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {programs.map((program, index) => (
              <div 
                key={index} 
                className={`group relative bg-white rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer ${
                  program.tag === '热门推荐' 
                    ? 'shadow-card-hover ring-2 ring-blue-500 md:scale-105' 
                    : 'shadow-card hover:shadow-card-hover'
                } hover:md:-translate-y-3 hover:ring-2 hover:ring-blue-400`}
              >
                {/* Hover Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-blue-50/0 to-blue-100/0 group-hover:from-blue-50/50 group-hover:via-blue-50/30 group-hover:to-cyan-50/50 transition-all duration-500 opacity-0 group-hover:opacity-100" />
                
                <div className={`absolute top-0 right-0 text-white text-xs px-3 py-1 rounded-bl-lg z-10 ${
                  program.tag === '入门首选' ? 'bg-emerald-500' :
                  program.tag === '热门推荐' ? 'bg-blue-500' : 'bg-violet-500'
                }`}>
                  {program.tag}
                </div>
                <div className="relative z-10 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">{program.name}</h3>
                  <div className="flex items-center text-blue-600 font-medium mb-1">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {program.duration}
                  </div>
                  <p className="text-gray-500 text-sm mb-4">适合: {program.suitable}</p>
                  <ul className="space-y-2 mb-4">
                    {program.features.map((f, i) => (
                      <li key={i} className="flex items-center text-gray-600 text-sm group-hover:translate-x-1 transition-transform duration-300" style={{transitionDelay: `${i * 50}ms`}}>
                        <svg className="w-4 h-4 mr-2 text-blue-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="bg-slate-50 rounded-xl p-3 mb-4 group-hover:bg-blue-50 transition-colors duration-300">
                    <span className="text-gray-500 text-xs">预期产出</span>
                    <p className="text-gray-900 font-medium group-hover:text-blue-700 transition-colors">{program.outcome}</p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-gray-400 text-sm">项目费用</span>
                      <div className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{program.price}</div>
                    </div>
                    <button className="px-6 py-2 bg-blue-600 group-hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
                      了解详情
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mentors Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-4 py-1.5 bg-rose-50 text-rose-700 text-sm font-medium rounded-full mb-4">
              顶尖导师
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              世界名校教授亲自指导
            </h2>
            <p className="text-gray-600 text-lg">
              来自MIT、斯坦福、哈佛、清北等顶尖院校的教授团队
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mentors.map((mentor, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
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
                  <p className="text-gray-600 text-sm mb-2">{mentor.research}</p>
                  <div className="flex items-center mb-2">
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded">
                      {mentor.papers}
                    </span>
                  </div>
                  <p className="text-blue-600 text-sm font-medium">{mentor.students}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Cases */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-4 py-1.5 bg-white/10 text-white/80 text-sm font-medium rounded-full mb-4 border border-white/20">
              成功案例
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              用科研成果敲开名校大门
            </h2>
            <p className="text-blue-200 text-lg">
              他们的成功，也可以是你的未来
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {successCases.map((student, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {student.name[0]}
                  </div>
                  <div className="ml-3">
                    <h4 className="font-bold text-white">{student.name}</h4>
                    <p className="text-blue-200 text-sm">{student.grade} · {student.field}</p>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 mb-4">
                  <p className="text-cyan-300 text-sm font-medium mb-1">科研成果</p>
                  <p className="text-white text-sm">{student.achievement}</p>
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
              六步科研服务体系
            </h2>
            <p className="text-gray-600 text-lg">
              系统化的科研路径，确保高质量产出
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {processSteps.map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-slate-50 rounded-2xl p-5 text-center hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-200">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className="text-2xl font-bold text-blue-400 mb-1">{item.step}</div>
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
                免费科研背景评估
              </h2>
              <p className="text-gray-600 text-lg">
                填写信息，我们的科研顾问将为您制定个性化方案
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
                <p className="text-gray-600 mb-6">感谢您的预约，我们的科研顾问将在24小时内与您联系</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
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
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="请输入您的邮箱"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">当前年级</label>
                      <select
                        name="grade"
                        value={formData.grade}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                      >
                        <option value="">请选择</option>
                        <option value="9年级及以下">9年级及以下</option>
                        <option value="10年级">10年级（高一）</option>
                        <option value="11年级">11年级（高二）</option>
                        <option value="12年级">12年级（高三）</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">感兴趣领域</label>
                      <select
                        name="interestField"
                        value={formData.interestField}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                      >
                        <option value="">请选择</option>
                        <option value="计算机科学">计算机科学</option>
                        <option value="工程技术">工程技术</option>
                        <option value="生物医学">生物医学</option>
                        <option value="商科经济">商科经济</option>
                        <option value="社会科学">社会科学</option>
                        <option value="数理统计">数理统计</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">目标水平</label>
                    <div className="flex flex-wrap gap-3">
                      {['科研启蒙', '研究报告', '会议论文', '期刊论文'].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setFormData({ ...formData, targetLevel: level })}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            formData.targetLevel === level
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-gray-600 hover:bg-slate-200'
                          }`}
                        >
                          {level}
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
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="请描述您的科研兴趣、目标院校、计划申请的专业等信息..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-4 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 disabled:opacity-50"
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
            <span className="inline-block px-4 py-1.5 bg-purple-50 text-purple-700 text-sm font-medium rounded-full mb-4">
              常见问题
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              关于科研提升的常见疑问
            </h2>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((item, index) => (
              <div key={index} className="bg-slate-50 rounded-xl p-6">
                <h4 className="font-bold text-gray-900 mb-2 flex items-start">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm mr-3 flex-shrink-0">Q</span>
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

export default Research;
