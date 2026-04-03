import { useState } from 'react';
import { Link } from 'react-router-dom';
import { submitAppointment } from '../utils/api';

function Appointment() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    wechat: '',
    visit_date: '',
    visit_time: '',
    purpose: '',
    content: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  const purposes = [
    { value: '留学咨询', label: '留学咨询', desc: '了解留学规划、院校选择' },
    { value: '申请规划', label: '申请规划', desc: '制定个性化申请方案' },
    { value: '文书指导', label: '文书指导', desc: '个人陈述、推荐信等文书辅导' },
    { value: '签证办理', label: '签证办理', desc: '签证材料准备及面试指导' },
    { value: '语言培训', label: '语言培训', desc: '雅思、托福等语言考试辅导' },
    { value: '其他', label: '其他咨询', desc: '其他留学相关问题' }
  ];

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = '请输入您的姓名';
    if (!formData.phone.trim()) {
      newErrors.phone = '请输入联系电话';
    } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = '请输入有效的手机号码';
    }
    if (!formData.visit_date) newErrors.visit_date = '请选择到访日期';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      const res = await submitAppointment(formData);
      if (res.success) {
        setSubmitted(true);
      } else {
        alert(res.message || '提交失败，请稍后重试');
      }
    } catch (error) {
      alert('提交失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // 获取今天的日期字符串用于min属性
  const today = new Date().toISOString().split('T')[0];
  // 获取30天后的日期
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">预约提交成功！</h2>
              <p className="text-gray-600 mb-8">
                感谢您预约到访华南留学。我们的顾问将在24小时内与您联系确认具体事宜。
              </p>
              <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
                <h3 className="font-semibold text-gray-900 mb-4">预约信息</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">姓名：</span>{formData.name}</p>
                  <p><span className="text-gray-500">电话：</span>{formData.phone}</p>
                  <p><span className="text-gray-500">到访日期：</span>{formData.visit_date}</p>
                  {formData.visit_time && <p><span className="text-gray-500">到访时间：</span>{formData.visit_time}</p>}
                  {formData.purpose && <p><span className="text-gray-500">咨询目的：</span>{formData.purpose}</p>}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/" className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                  返回首页
                </Link>
                <button 
                  onClick={() => { setSubmitted(false); setFormData({ name: '', phone: '', email: '', wechat: '', visit_date: '', visit_time: '', purpose: '', content: '' }); }}
                  className="px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
                >
                  继续预约
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-blue-900 py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <nav className="flex items-center justify-center text-white/70 text-sm mb-6">
              <Link to="/" className="hover:text-white transition-colors">首页</Link>
              <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-white">预约到访</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">预约到访咨询</h1>
            <p className="text-xl text-white/80">面对面深度沟通，为您定制专属留学方案</p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">填写预约信息</h2>
                
                <div className="space-y-6">
                  {/* 基本信息 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        您的姓名 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-500' : 'border-gray-200'} focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all`}
                        placeholder="请输入真实姓名"
                      />
                      {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        联系电话 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-500' : 'border-gray-200'} focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all`}
                        placeholder="请输入手机号码"
                      />
                      {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        电子邮箱
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                        placeholder="选填，用于接收资料"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        微信号
                      </label>
                      <input
                        type="text"
                        name="wechat"
                        value={formData.wechat}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                        placeholder="选填，方便在线沟通"
                      />
                    </div>
                  </div>

                  {/* 预约时间 */}
                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4">选择到访时间</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          到访日期 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="visit_date"
                          value={formData.visit_date}
                          onChange={handleChange}
                          min={today}
                          max={maxDateStr}
                          className={`w-full px-4 py-3 rounded-xl border ${errors.visit_date ? 'border-red-500' : 'border-gray-200'} focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all`}
                        />
                        {errors.visit_date && <p className="mt-1 text-sm text-red-500">{errors.visit_date}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          到访时间
                        </label>
                        <select
                          name="visit_time"
                          value={formData.visit_time}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-white"
                        >
                          <option value="">请选择时间段</option>
                          <optgroup label="上午">
                            {timeSlots.slice(0, 6).map(time => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </optgroup>
                          <optgroup label="下午">
                            {timeSlots.slice(6).map(time => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </optgroup>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 咨询目的 */}
                  <div className="pt-4 border-t border-gray-100">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      咨询目的
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {purposes.map(purpose => (
                        <label
                          key={purpose.value}
                          className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                            formData.purpose === purpose.value
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-100 hover:border-gray-200'
                          }`}
                        >
                          <input
                            type="radio"
                            name="purpose"
                            value={purpose.value}
                            checked={formData.purpose === purpose.value}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <div className="font-semibold text-gray-900">{purpose.label}</div>
                          <div className="text-xs text-gray-500 mt-1">{purpose.desc}</div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 补充说明 */}
                  <div className="pt-4 border-t border-gray-100">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      补充说明
                    </label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all resize-none"
                      placeholder="请简要描述您的留学意向、背景情况或特殊需求，以便我们更好地为您服务..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-primary-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        提交中...
                      </span>
                    ) : '确认预约'}
                  </button>
                </div>
              </form>
            </div>

            {/* Sidebar Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Office Info */}
              <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">公司地址</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mr-3 flex-shrink-0">
                      <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">华南留学服务中心</p>
                      <p className="text-sm text-gray-500 mt-1">广州市天河区珠江新城华夏路30号</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mr-3 flex-shrink-0">
                      <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">营业时间</p>
                      <p className="text-sm text-gray-500 mt-1">周一至周日 9:00-18:00</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mr-3 flex-shrink-0">
                      <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">咨询电话</p>
                      <p className="text-sm text-gray-500 mt-1">400-888-8888</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl shadow-lg p-6 text-white">
                <h3 className="font-bold text-lg mb-4">温馨提示</h3>
                <ul className="space-y-3 text-sm text-white/90">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>请提前1-3天预约，以便我们安排专业顾问</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>请携带相关学历证明、成绩单等材料</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>首次咨询免费，时长约30-60分钟</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>如需取消预约，请提前24小时告知</span>
                  </li>
                </ul>
              </div>

              {/* Trust Badges */}
              <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">为什么选择我们</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3">
                    <div className="text-2xl font-bold text-primary-600">10年+</div>
                    <div className="text-xs text-gray-500">行业经验</div>
                  </div>
                  <div className="text-center p-3">
                    <div className="text-2xl font-bold text-primary-600">5000+</div>
                    <div className="text-xs text-gray-500">成功案例</div>
                  </div>
                  <div className="text-center p-3">
                    <div className="text-2xl font-bold text-primary-600">98%</div>
                    <div className="text-xs text-gray-500">录取率</div>
                  </div>
                  <div className="text-center p-3">
                    <div className="text-2xl font-bold text-primary-600">50+</div>
                    <div className="text-xs text-gray-500">专业顾问</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Appointment;
