import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBanners, getHotSchools, getHotConsultants, getHotNews, getPublicServices } from '../utils/api';

function Home() {
  const [banners, setBanners] = useState([]);
  const [schools, setSchools] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [news, setNews] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannersRes, schoolsRes, consultantsRes, newsRes, servicesRes] = await Promise.all([
          getBanners(),
          getHotSchools(),
          getHotConsultants(),
          getHotNews(),
          getPublicServices()
        ]);
        
        if (bannersRes.success) setBanners(bannersRes.data);
        if (schoolsRes.success) setSchools(schoolsRes.data);
        if (consultantsRes.success) setConsultants(consultantsRes.data);
        if (newsRes.success) setNews(newsRes.data);
        if (servicesRes.success) setServices(servicesRes.data);
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Auto rotate banners
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  const stats = [
    { value: '98%', label: '录取成功率', desc: '远超行业平均水平' },
    { value: '5000+', label: '成功案例', desc: '覆盖全球顶尖名校' },
    { value: '100+', label: '合作院校', desc: '官方合作伙伴' },
    { value: '15年', label: '行业经验', desc: '专注留学申请服务' }
  ];

  // 图标映射
  const iconMap = {
    graduation: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
    book: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    trophy: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    flask: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    language: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
    ),
    plane: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
    home: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    document: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  };

  const whyChooseUs = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: '专业团队',
      desc: '经验丰富的顾问团队，深谙全球顶尖院校录取规则',
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: '成功保障',
      desc: '98%录取成功率，数千学生成功进入世界名校',
      color: 'bg-amber-50 text-amber-600'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: '个性化服务',
      desc: '量身定制申请方案，全程一对一专业指导',
      color: 'bg-blue-50 text-blue-600'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden">
        {banners.length > 0 ? (
          <>
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentBanner ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 via-primary-800/70 to-transparent z-10" />
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            
            <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
              <div className="max-w-2xl">
                <span className="inline-flex items-center px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium rounded-full mb-6 border border-white/20">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mr-2 animate-pulse" />
                  专业留学服务，助您圆梦名校
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  {banners[currentBanner]?.title || '您的梦想院校，从这里启航'}
                </h1>
                <p className="text-lg md:text-xl text-white/80 mb-8 max-w-lg">
                  专业团队全程指导，帮助数千名学生成功进入世界顶尖名校，开启精彩的国际教育之旅。
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center bg-white text-primary-700 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                  >
                    免费咨询
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  <Link
                    to="/schools"
                    className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold transition-all border border-white/30"
                  >
                    探索院校
                  </Link>
                </div>
                
                {/* Stats */}
                <div className="flex gap-8 mt-12 pt-8 border-t border-white/20">
                  {stats.slice(0, 3).map((stat, index) => (
                    <div key={index}>
                      <div className="text-3xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm text-white/60">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {banners.length > 1 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBanner(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentBanner ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="relative h-full bg-gradient-to-br from-primary-900 via-primary-800 to-blue-900">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10" />
            <div className="relative container mx-auto px-4 h-full flex items-center">
              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                  您的梦想院校，从这里启航
                </h1>
                <p className="text-lg md:text-xl text-white/80 mb-8">
                  专业指导，开启国际教育之旅
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center bg-white text-primary-700 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold transition-all"
                >
                  免费咨询
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-4 py-1.5 bg-primary-50 text-primary-700 text-sm font-medium rounded-full mb-4">
              我们的服务
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              一站式留学解决方案
            </h2>
            <p className="text-gray-600 text-lg">
              从申请规划到背景提升，全方位助力您的名校之路
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.length > 0 ? (
              services.map((service, index) => (
                <Link
                  key={service.id || index}
                  to={service.link || '/services'}
                  className="group bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-gray-100 hover:border-primary-200"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${service.color || 'from-blue-500 to-blue-600'} rounded-xl flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                    {iconMap[service.icon] || iconMap['graduation']}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {service.description || service.subtitle || ''}
                  </p>
                  <div className="flex items-center text-primary-600 font-medium text-sm">
                    了解更多
                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </Link>
              ))
            ) : (
              // 默认展示空状态
              <div className="col-span-full text-center py-12 text-gray-500">
                暂无服务数据，请在后台管理中添加
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Schools */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <span className="inline-block px-4 py-1.5 bg-amber-50 text-amber-700 text-sm font-medium rounded-full mb-3">
                热门院校
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                世界顶尖名校推荐
              </h2>
            </div>
            <Link to="/schools" className="mt-4 md:mt-0 group flex items-center text-primary-600 hover:text-primary-700 font-semibold">
              查看全部院校
              <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools.slice(0, 6).map((school, index) => (
              <Link
                key={school.id}
                to={`/schools/${school.id}`}
                className="group bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden"
              >
                <div className="relative h-48 overflow-hidden">
                  {school.banner ? (
                    <img 
                      src={school.banner} 
                      alt={school.name_cn}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-100 via-primary-200 to-primary-300 flex items-center justify-center">
                      <span className="text-6xl">🎓</span>
                    </div>
                  )}
                  {school.rank && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/95 backdrop-blur-sm text-primary-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                        QS #{school.rank}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    {/* 学校LOGO */}
                    {school.logo ? (
                      <img 
                        src={school.logo} 
                        alt={school.name_cn}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-100"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-700 font-bold text-lg">
                        {school.name_cn ? school.name_cn.charAt(0) : '🎓'}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary-600 transition-colors">
                        {school.name_cn}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <span>
                          {school.country === '英国' ? '🇬🇧' : 
                           school.country === '美国' ? '🇺🇸' : 
                           school.country === '澳大利亚' ? '🇦🇺' : 
                           school.country === '加拿大' ? '🇨🇦' : 
                           school.country === '新加坡' ? '🇸🇬' : 
                           school.country === '香港' ? '🇭🇰' : 
                           school.country === '澳门' ? '🇲🇴' : '🌏'}
                        </span>
                        <span>{school.country}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mb-4">{school.name_en}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-600">
                      学费: <span className="text-primary-600 font-medium">{school.tuition || '详询'}</span>
                    </span>
                    <span className="text-primary-600 text-sm font-medium">
                      查看详情 →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full mb-4">
              为什么选择我们
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              专业值得信赖
            </h2>
            <p className="text-gray-600 text-lg">
              我们致力于帮助学生实现国际教育梦想，提供专业、贴心的留学服务
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyChooseUs.map((item, index) => (
              <div 
                key={index}
                className="relative bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 border border-gray-100 group"
              >
                <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                <div className="absolute top-6 right-6 text-6xl font-bold text-gray-100 group-hover:text-primary-100 transition-colors">
                  0{index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Team */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-purple-50 text-purple-700 text-sm font-medium rounded-full mb-3">
              核心团队
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              认识我们的团队
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              专业的顾问团队，拥有丰富的国际教育咨询经验
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {consultants.slice(0, 4).map((consultant) => (
              <Link
                key={consultant.id}
                to={`/consultants/${consultant.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                {/* Avatar Image */}
                <div className="relative h-64 overflow-hidden">
                  {consultant.avatar ? (
                    <img 
                      src={consultant.avatar} 
                      alt={consultant.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <span className="text-6xl font-bold text-gray-400">{consultant.name?.charAt(0)}</span>
                    </div>
                  )}
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {/* Name & Title on Image */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-xl font-bold text-white mb-1">{consultant.name}</h3>
                    <p className="text-white/90 text-sm">{consultant.title}</p>
                  </div>
                </div>
                
                {/* Bio */}
                <div className="p-4">
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {consultant.bio || `${consultant.name}是${consultant.title}，拥有丰富的留学咨询经验，专注于为学生提供专业的留学规划和申请指导服务。`}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link 
              to="/consultants" 
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold transition-colors"
            >
              查看全部顾问
              <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Hot News */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <span className="inline-block px-4 py-1.5 bg-rose-50 text-rose-700 text-sm font-medium rounded-full mb-3">
                热门文章
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                留学动态与攻略
              </h2>
            </div>
            <Link to="/news" className="mt-4 md:mt-0 group flex items-center text-primary-600 hover:text-primary-700 font-semibold">
              查看全部资讯
              <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.slice(0, 3).map((item) => (
              <Link
                key={item.id}
                to={`/news/${item.id}`}
                className="group bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="relative h-48 overflow-hidden">
                  {item.cover ? (
                    <img 
                      src={item.cover} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-rose-100 via-purple-100 to-blue-100 flex items-center justify-center">
                      <span className="text-5xl">📰</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/95 backdrop-blur-sm text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {item.summary}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{item.author}</span>
                    <span className="text-primary-600">
                      阅读更多 →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-900 via-primary-800 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-5" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 bg-white/20 text-white text-sm font-medium rounded-full mb-6 border border-white/30">
              开启留学之旅
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              让您的留学梦想成为现实
            </h2>
            <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
              让我们的专家团队助您圆梦世界名校，现在预约可获得免费留学规划咨询
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center bg-white text-primary-700 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                预约免费咨询
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 px-8 py-4 rounded-xl font-semibold transition-all border border-white/40"
              >
                了解更多
              </Link>
            </div>
            
            <div className="mt-12 pt-8 border-t border-white/20">
              <p className="text-blue-200 text-sm mb-4">受到众多学生和家长的信赖</p>
              <div className="flex flex-wrap justify-center gap-8 text-blue-200/70">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">官方认证机构</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm">4.9/5 客户评分</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">隐私安全保障</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
