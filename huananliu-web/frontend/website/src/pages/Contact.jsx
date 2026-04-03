import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { submitMessage, getSiteConfig } from '../utils/api';

function Contact() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    country: '',
    education: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [config, setConfig] = useState({});
  const [configLoading, setConfigLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await getSiteConfig();
        if (res.success) {
          setConfig(res.data);
        }
      } catch (error) {
        console.error('获取配置失败:', error);
      } finally {
        setConfigLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const countries = [
    { name: '香港', flag: '🇭🇰' },
    { name: '澳门', flag: '🇲🇴' },
    { name: '新加坡', flag: '🇸🇬' },
    { name: '英国', flag: '🇬🇧' },
    { name: '美国', flag: '🇺🇸' },
    { name: '澳大利亚', flag: '🇦🇺' },
    { name: '加拿大', flag: '🇨🇦' },
    { name: '其他', flag: '🌍' }
  ];

  const educations = ['高中在读', '高中毕业', '本科在读', '本科毕业', '硕士在读', '硕士毕业'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await submitMessage({
        name: form.name,
        phone: form.phone,
        email: form.email,
        country: form.country,
        message: `学历: ${form.education}, 咨询内容: ${form.message}`
      });
      if (res.success) {
        setSuccess(true);
        setForm({ name: '', phone: '', email: '', country: '', education: '', message: '' });
      }
    } catch (error) {
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: '电话咨询',
      content: config.phone || '+86 400 888 8888',
      desc: config.phone_time || '周一至周日 9:00-21:00',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: '邮箱联系',
      content: config.email || 'info@huananliu.com',
      desc: config.email_reply || '24小时内回复',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: '公司地址',
      content: config.address || '广州市天河区珠江新城',
      desc: config.address_note || '欢迎预约到访咨询',
      color: 'from-violet-500 to-purple-600'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: '在线咨询',
      content: config.online_title || '7×24小时在线',
      desc: config.online_desc || '随时为您解答疑问',
      color: 'from-amber-500 to-orange-600'
    }
  ];

  const faqs = [
    { q: '咨询是免费的吗？', a: '是的，我们提供免费的初步留学咨询服务。您可以拨打热线或在线留言，我们的顾问将为您解答疑问。' },
    { q: '多久能收到回复？', a: '在线咨询我们会在24小时内回复，电话咨询即时接通。如需详细规划，建议预约面对面咨询。' },
    { q: '可以预约线下咨询吗？', a: '当然可以！我们欢迎学生和家长预约到访，进行面对面的深度交流。请提前电话预约，我们将为您安排专属顾问。' },
    { q: '你们服务哪些国家？', a: '我们主要服务香港、澳门、新加坡、英国、美国、澳大利亚、加拿大等主流留学目的地。' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-800 via-blue-900 to-cyan-900 py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-400/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium rounded-full mb-6 border border-white/20">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              专业顾问一对一服务
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              联系我们<br />
              <span className="text-cyan-300">开启留学之旅</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-200 max-w-2xl mx-auto leading-relaxed">
              专业留学顾问团队随时为您服务，解答您的所有疑问，助您圆梦名校
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="container mx-auto px-4 -mt-16 relative z-10 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactInfo.map((info, index) => (
            <div key={index} className="group bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 p-6 text-center border border-gray-100">
              <div className={`w-16 h-16 bg-gradient-to-br ${info.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                {info.icon}
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{info.title}</h3>
              <p className="text-primary-600 font-semibold mb-1">{info.content}</p>
              <p className="text-gray-500 text-sm">{info.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-full mb-4">
                在线咨询
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                免费留学评估
              </h2>
              <p className="text-gray-600 text-lg">
                填写以下信息，我们的资深顾问将在24小时内与您联系
              </p>
            </div>

            {success ? (
              <div className="bg-white rounded-2xl shadow-card p-12 text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">提交成功！</h3>
                <p className="text-gray-600 mb-6">感谢您的留言，我们的顾问将在24小时内与您联系</p>
                <button 
                  onClick={() => setSuccess(false)} 
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  继续留言 →
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                        {countries.map(c => (
                          <option key={c.name} value={c.name}>{c.flag} {c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">当前学历</label>
                    <div className="flex flex-wrap gap-3">
                      {educations.map((edu) => (
                        <button
                          key={edu}
                          type="button"
                          onClick={() => setForm({ ...form, education: edu })}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            form.education === edu
                              ? 'bg-primary-600 text-white'
                              : 'bg-slate-100 text-gray-600 hover:bg-slate-200'
                          }`}
                        >
                          {edu}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">咨询内容 *</label>
                    <textarea 
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      rows="5"
                      placeholder="请描述您的留学意向、目标院校、专业方向或其他问题..."
                      required
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
                      '提交咨询'
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
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-full mb-4">
              常见问题
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              您可能想了解
            </h2>
            <p className="text-gray-600 text-lg">
              关于咨询服务的常见疑问
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-2 flex items-start">
                  <span className="w-6 h-6 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center text-sm mr-3 flex-shrink-0">Q</span>
                  {item.q}
                </h4>
                <p className="text-gray-600 ml-9">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full mb-4">
              来访指引
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              欢迎预约到访
            </h2>
            <p className="text-gray-600 text-lg">
              我们期待与您面对面交流，为您提供更详细的留学规划
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="bg-slate-100 rounded-2xl overflow-hidden h-80 flex items-center justify-center relative">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{config.address_full || '广州市天河区珠江新城华夏路30号'}</h3>
                <p className="text-gray-500">地铁3号线/5号线珠江新城站B出口</p>
              </div>
              <div className="absolute top-8 left-8 w-20 h-20 bg-primary-200/50 rounded-full blur-xl" />
              <div className="absolute bottom-8 right-8 w-32 h-32 bg-amber-200/50 rounded-full blur-xl" />
            </div>
            
            <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>营业时间：{config.business_hours || '周一至周日 9:00-21:00'}</span>
              </div>
              <a 
                href={`tel:${(config.phone || '+86 400 888 8888').replace(/\s/g, '')}`}
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                预约到访
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-slate-800 via-blue-900 to-cyan-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-rose-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              开启你的留学之旅
            </h2>
            <p className="text-lg text-blue-200 mb-10">
              专业团队，全程陪伴，助你实现留学梦想
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`tel:${(config.phone || '+86 400 888 8888').replace(/\s/g, '')}`}
                className="inline-flex items-center justify-center bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                立即拨打电话
              </a>
              <Link
                to="/apply"
                className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 px-8 py-4 rounded-xl font-semibold transition-all border border-white/40"
              >
                了解更多服务
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
