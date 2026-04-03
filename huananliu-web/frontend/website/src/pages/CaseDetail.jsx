import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCaseDetail, getHotCases } from '../utils/api';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

function CaseDetail() {
  const { id } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [hotCases, setHotCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const fetch = async () => {
      try {
        const [caseRes, hotRes] = await Promise.all([
          getCaseDetail(id),
          getHotCases()
        ]);
        if (caseRes.success) setCaseData(caseRes.data);
        if (hotRes.success) {
          setHotCases(hotRes.data.filter(c => c.id !== parseInt(id)).slice(0, 3));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [caseData]);

  // 滚动进度
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 获取国家国旗
  const getCountryFlag = (country) => {
    const flags = {
      '英国': '🇬🇧', '美国': '🇺🇸', '澳大利亚': '🇦🇺', '加拿大': '🇨🇦',
      '新西兰': '🇳🇿', '爱尔兰': '🇮🇪', '新加坡': '🇸🇬', '香港': '🇭🇰',
      '澳门': '🇲🇴', '日本': '🇯🇵', '韩国': '🇰🇷', '德国': '🇩🇪',
      '法国': '🇫🇷', '荷兰': '🇳🇱', '瑞典': '🇸🇪', '瑞士': '🇨🇭'
    };
    return flags[country] || '🌍';
  };

  // 获取国家主题色
  const getCountryColor = (country) => {
    const colors = {
      '英国': 'from-red-500 to-blue-600',
      '美国': 'from-blue-500 to-red-500',
      '澳大利亚': 'from-blue-400 to-yellow-400',
      '加拿大': 'from-red-500 to-red-600',
      '新加坡': 'from-red-400 to-red-500',
      '香港': 'from-red-500 to-red-600',
    };
    return colors[country] || 'from-primary-500 to-primary-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-primary-200 rounded-full" />
            <div className="absolute inset-0 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-gray-500 animate-pulse">加载中...</p>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 max-w-md border border-white/50">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">案例不存在</h2>
          <p className="text-gray-500 mb-8">该案例可能已被删除或暂时无法访问</p>
          <Link 
            to="/cases" 
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回案例列表
          </Link>
        </div>
      </div>
    );
  }

  const { consultant, school } = caseData;
  const sanitizedStory = DOMPurify.sanitize(marked(caseData.story || ''));
  const caseImages = caseData.images || [];
  const themeGradient = getCountryColor(caseData.target_country);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50">
        <div 
          className="h-full bg-gradient-to-r from-primary-500 via-accent-500 to-primary-600 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Hero Section - Glassmorphism Style */}
      <div className="relative min-h-[70vh] flex items-end overflow-hidden">
        {/* Dynamic Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${themeGradient} opacity-90`} />
        
        {/* Animated Mesh Gradient */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative container mx-auto px-4 pb-24 pt-32">
          {/* Breadcrumb */}
          <nav className="flex items-center text-white/80 text-sm mb-8 animate-fade-in">
            <Link to="/" className="hover:text-white transition-colors">首页</Link>
            <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link to="/cases" className="hover:text-white transition-colors">成功案例</Link>
            <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white font-medium">案例详情</span>
          </nav>

          <div className="max-w-4xl">
            {/* Success Badge with Glow */}
            <div className="inline-flex items-center bg-white/20 backdrop-blur-md border border-white/30 text-white px-5 py-2.5 rounded-full text-sm font-bold mb-6 shadow-lg animate-slide-down">
              <span className="w-2.5 h-2.5 bg-green-400 rounded-full mr-3 animate-pulse" />
              录取成功
            </div>

            {/* Title with Text Gradient */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight drop-shadow-lg">
              {caseData.title}
            </h1>

            {/* Meta Pills */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3 shadow-lg hover:bg-white/25 transition-all cursor-default">
                <span className="text-3xl mr-3 filter drop-shadow">{getCountryFlag(caseData.target_country)}</span>
                <div>
                  <div className="text-white/70 text-xs">目标国家</div>
                  <div className="text-white font-bold">{caseData.target_country}</div>
                </div>
              </div>
              
              <div className="flex items-center bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3 shadow-lg hover:bg-white/25 transition-all cursor-default">
                <svg className="w-6 h-6 mr-3 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <div>
                  <div className="text-white/70 text-xs">目标专业</div>
                  <div className="text-white font-bold">{caseData.target_major}</div>
                </div>
              </div>

              {caseData.scholarship && (
                <div className="flex items-center bg-gradient-to-r from-amber-400/90 to-orange-500/90 border border-amber-300/50 rounded-2xl px-5 py-3 shadow-lg shadow-amber-500/30">
                  <svg className="w-6 h-6 mr-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <div>
                    <div className="text-white/90 text-xs">奖学金</div>
                    <div className="text-white font-bold">{caseData.scholarship}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="url(#grad1)" fillOpacity="0.1"/>
            <path d="M0 120L60 115C120 110 240 100 360 95C480 90 600 90 720 92C840 94 960 98 1080 100C1200 102 1320 102 1380 102L1440 102V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" fillOpacity="0.05"/>
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="white" />
                <stop offset="100%" stopColor="white" stopOpacity="0.5"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Admission Result Card - Floating */}
      <div className="relative -mt-16 z-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div id="admission-card" className={`animate-on-scroll transition-all duration-700 ${isVisible['admission-card'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-primary-900/10 p-8 border border-white/50">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Large Avatar */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-accent-400 rounded-2xl blur-xl opacity-30 scale-110" />
                  {caseData.avatar ? (
                    <img 
                      src={caseData.avatar} 
                      alt={caseData.student_name}
                      className="relative w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-xl"
                    />
                  ) : (
                    <div className="relative w-28 h-28 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-xl">
                      {(caseData.student_name || '学')[0]}
                    </div>
                  )}
                  <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg border-4 border-white">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>

                {/* Admission Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="text-sm text-gray-500 uppercase tracking-wider font-medium mb-1">成功录取</div>
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                    {caseData.admission_result}
                  </h2>
                  {school && (
                    <p className="text-gray-600 text-lg">{school.name_en}</p>
                  )}
                </div>

                {/* Stats */}
                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center mb-2">
                      <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{caseData.view_count || 0}</div>
                    <div className="text-xs text-gray-500">浏览</div>
                  </div>
                  {caseData.scholarship && (
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center mb-2">
                        <svg className="w-8 h-8 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <div className="text-2xl font-bold text-amber-600">有</div>
                      <div className="text-xs text-gray-500">奖学金</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-6xl mx-auto">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Student Profile Card */}
            <div id="profile-card" className={`animate-on-scroll bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100 transition-all duration-700 ${isVisible['profile-card'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg shadow-primary-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                学生档案
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: '👤', label: '学生姓名', value: caseData.student_name || '匿名', color: 'from-blue-500 to-blue-600' },
                  { icon: '🏫', label: '原就读学校', value: caseData.original_school || '未填写', color: 'from-purple-500 to-purple-600' },
                  { icon: '🌍', label: '目标国家', value: caseData.target_country, color: 'from-green-500 to-green-600' },
                  { icon: '📚', label: '目标专业', value: caseData.target_major, color: 'from-orange-500 to-orange-600' },
                ].map((item, idx) => (
                  <div key={idx} className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg hover:shadow-gray-200/50 transition-all hover:-translate-y-1">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-lg mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                      {item.icon}
                    </div>
                    <div className="text-gray-400 text-xs mb-1">{item.label}</div>
                    <div className="font-bold text-gray-900 text-sm">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Gallery - Interactive */}
            {caseImages.length > 0 && (
              <div id="gallery" className={`animate-on-scroll transition-all duration-700 delay-100 ${isVisible['gallery'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
                  <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg shadow-accent-500/30">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    精彩瞬间
                  </h3>
                  
                  {/* Main Image */}
                  <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 bg-gray-100">
                    <img 
                      src={caseImages[activeImage]} 
                      alt={`案例图片 ${activeImage + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      <span className="text-white/90 text-sm font-medium bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full">
                        {activeImage + 1} / {caseImages.length}
                      </span>
                    </div>
                  </div>
                  
                  {/* Thumbnails */}
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {caseImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(idx)}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all ${
                          activeImage === idx 
                            ? 'ring-2 ring-primary-500 ring-offset-2 scale-105' 
                            : 'opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt={`缩略图 ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Story Content */}
            <div id="story" className={`animate-on-scroll bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 md:p-10 border border-gray-100 transition-all duration-700 delay-200 ${isVisible['story'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h3 className="font-bold text-xl text-gray-900 mb-8 flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg shadow-green-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                申请历程
              </h3>
              <div 
                className="prose prose-lg prose-slate max-w-none
                  prose-headings:text-gray-900 prose-headings:font-bold
                  prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-6 prose-h2:text-primary-800
                  prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-gray-800
                  prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-6
                  prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-gray-900 prose-strong:font-bold
                  prose-img:rounded-2xl prose-img:shadow-xl prose-img:mx-auto
                  prose-ul:list-disc prose-ul:pl-6 prose-li:text-gray-600 prose-li:mb-3
                  prose-ol:list-decimal prose-ol:pl-6
                  prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:bg-gradient-to-r prose-blockquote:from-primary-50 prose-blockquote:to-transparent prose-blockquote:p-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic
                  first:prose-p:mt-0"
                dangerouslySetInnerHTML={{ __html: sanitizedStory }}
              />
            </div>

            {/* Share */}
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => navigator.clipboard.writeText(window.location.href).then(() => alert('链接已复制'))}
                className="group flex items-center px-6 py-3.5 bg-white rounded-2xl shadow-lg shadow-gray-200/50 hover:shadow-xl transition-all text-gray-700 hover:text-primary-600 border border-gray-100"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-primary-50 flex items-center justify-center mr-3 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </div>
                <span className="font-medium">分享案例</span>
              </button>

              <Link
                to="/cases"
                className="group flex items-center px-6 py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-2xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all"
              >
                <span className="font-medium">更多案例</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Consultant Card */}
            {consultant && (
              <div id="consultant" className={`animate-on-scroll bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 border border-gray-100 transition-all duration-700 ${isVisible['consultant'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    {consultant.avatar ? (
                      <img 
                        src={consultant.avatar} 
                        alt={consultant.name}
                        className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-xl"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-xl">
                        {consultant.name?.charAt(0)}
                      </div>
                    )}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center shadow-lg border-4 border-white">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <h4 className="font-bold text-lg text-gray-900 mt-4">{consultant.name}</h4>
                  <p className="text-primary-600 text-sm font-medium">{consultant.title}</p>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">服务类型</span>
                    <span className="text-gray-900 font-medium">{consultant.service_type || '留学申请'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">从业经验</span>
                    <span className="text-gray-900 font-medium">{consultant.experience || 5}+ 年</span>
                  </div>
                </div>

                <Link
                  to={`/consultants/${consultant.id}`}
                  className="block w-full text-center py-3.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  查看顾问详情
                </Link>
              </div>
            )}

            {/* CTA Card */}
            <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-blue-700 rounded-3xl shadow-2xl shadow-primary-500/30 p-8 text-white relative overflow-hidden">
              {/* Decorative Circles */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-5">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl mb-3">想获得同样的录取？</h3>
                <p className="text-white/80 text-sm mb-6 leading-relaxed">
                  我们的专业顾问团队可以为您提供一对一的留学规划服务，助您圆梦名校
                </p>
                <Link
                  to="/contact"
                  className="block w-full text-center py-4 bg-white text-primary-700 rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all"
                >
                  免费咨询
                </Link>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-4">案例数据</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-2xl">
                  <div className="text-2xl font-bold text-primary-600">{caseData.view_count || 0}</div>
                  <div className="text-xs text-gray-500 mt-1">浏览次数</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-2xl">
                  <div className="text-2xl font-bold text-accent-600">{hotCases.length + 1}</div>
                  <div className="text-xs text-gray-500 mt-1">相关案例</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Cases */}
      {hotCases.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-white to-slate-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10 max-w-6xl mx-auto">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">相关案例</h2>
                <p className="text-gray-500">更多成功案例供您参考</p>
              </div>
              <Link to="/cases" className="group flex items-center px-6 py-3 bg-white rounded-2xl shadow-lg text-primary-600 font-semibold hover:shadow-xl transition-all">
                查看全部
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {hotCases.map((item, idx) => (
                <Link
                  key={item.id}
                  to={`/cases/${item.id}`}
                  className="group bg-white rounded-3xl shadow-lg shadow-gray-200/50 overflow-hidden hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300 border border-gray-100"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl">{getCountryFlag(item.target_country)}</span>
                      <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-bold">
                        {item.target_country}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-3">
                      {item.title}
                    </h3>
                    <div className="flex items-center text-primary-600 font-medium text-sm mb-4">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {item.admission_result}
                    </div>
                    {item.consultant && (
                      <div className="flex items-center pt-4 border-t border-gray-100">
                        {item.consultant.avatar ? (
                          <img src={item.consultant.avatar} alt={item.consultant.name} className="w-8 h-8 rounded-lg object-cover mr-2" />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-xs font-bold mr-2">
                            {item.consultant.name?.charAt(0)}
                          </div>
                        )}
                        <span className="text-sm text-gray-600">{item.consultant.name}</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Add custom animation styles */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-slide-down {
          animation: slide-down 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

export default CaseDetail;
