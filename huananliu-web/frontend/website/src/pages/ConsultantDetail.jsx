import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getConsultantDetail, getCases } from '../utils/api';

function ConsultantDetail() {
  const { id } = useParams();
  const [consultant, setConsultant] = useState(null);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConsultantDetail();
  }, [id]);

  const fetchConsultantDetail = async () => {
    setLoading(true);
    try {
      const [consultantRes, casesRes] = await Promise.all([
        getConsultantDetail(id),
        getCases({ consultant_id: id, limit: 3 })
      ]);
      
      if (consultantRes.success) {
        setConsultant(consultantRes.data);
      }
      if (casesRes.success) {
        setCases(casesRes.data.list);
      }
    } catch (error) {
      console.error('Failed to fetch consultant detail:', error);
    } finally {
      setLoading(false);
    }
  };

  // 渲染星级评分
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="half">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#e5e7eb" />
              </linearGradient>
            </defs>
            <path fill="url(#half)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600" />
        </div>
      </div>
    );
  }

  if (!consultant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center bg-white rounded-2xl shadow-card p-10">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">顾问不存在</h2>
          <p className="text-gray-500 mb-6">抱歉，未找到该顾问的详细信息</p>
          <Link to="/consultants" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回顾问列表
          </Link>
        </div>
      </div>
    );
  }

  const specialties = consultant.specialties ? 
    (typeof consultant.specialties === 'string' ? JSON.parse(consultant.specialties) : consultant.specialties) : 
    [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-blue-900 py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="relative container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center text-white/60 text-sm mb-6">
            <Link to="/" className="hover:text-white transition-colors">首页</Link>
            <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link to="/consultants" className="hover:text-white transition-colors">顾问团队</Link>
            <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white">{consultant.name}</span>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl">
                {consultant.avatar ? (
                  <img 
                    src={consultant.avatar} 
                    alt={consultant.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=400&q=80';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                    <span className="text-5xl font-bold text-primary-700">{consultant.name.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            {/* Info */}
            <div className="text-center lg:text-left flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">{consultant.name}</h1>
              <p className="text-xl text-blue-200 mb-4">{consultant.title}</p>
              
              {/* Rating */}
              <div className="flex items-center justify-center lg:justify-start gap-1 mb-4">
                {renderStars(parseFloat(consultant.rating))}
                <span className="ml-2 text-white font-semibold">{consultant.rating}</span>
                <span className="text-white/60 text-sm ml-1">({consultant.success_cases} 个成功案例)</span>
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                <span className="flex items-center bg-white/10 backdrop-blur-sm text-white/90 px-4 py-1.5 rounded-lg text-sm border border-white/20">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {consultant.region}
                </span>
                <span className="flex items-center bg-white/10 backdrop-blur-sm text-white/90 px-4 py-1.5 rounded-lg text-sm border border-white/20">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {consultant.experience} 年经验
                </span>
                <span className="flex items-center bg-white/10 backdrop-blur-sm text-white/90 px-4 py-1.5 rounded-lg text-sm border border-white/20">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {consultant.service_type}
                </span>
              </div>
            </div>
            
            {/* CTA */}
            <div className="flex flex-col gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center bg-white text-primary-700 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold transition-all shadow-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                预约咨询
              </Link>
              <Link
                to="/consultants"
                className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 px-8 py-3 rounded-xl font-semibold transition-all border border-white/30"
              >
                返回列表
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            <div className="bg-white rounded-2xl shadow-card p-6 lg:p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                个人简介
              </h2>
              <p className="text-gray-600 leading-relaxed">{consultant.bio}</p>
            </div>

            {/* Education */}
            {consultant.education && (
              <div className="bg-white rounded-2xl shadow-card p-6 lg:p-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                  </div>
                  教育背景
                </h2>
                <div className="flex items-center p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mr-4">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{consultant.education}</p>
                    <p className="text-gray-500 text-sm">高等教育学位</p>
                  </div>
                </div>
              </div>
            )}

            {/* Specialties */}
            {specialties.length > 0 && (
              <div className="bg-white rounded-2xl shadow-card p-6 lg:p-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  专业领域
                </h2>
                <div className="flex flex-wrap gap-3">
                  {specialties.map((specialty, index) => (
                    <span key={index} className="px-4 py-2 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 font-medium rounded-xl border border-amber-200">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Success Cases */}
            {cases.length > 0 && (
              <div className="bg-white rounded-2xl shadow-card p-6 lg:p-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  成功案例
                </h2>
                <div className="space-y-4">
                  {cases.map((caseItem, index) => (
                    <div key={index} className="border border-gray-100 rounded-xl p-4 hover:border-primary-200 hover:bg-primary-50/30 transition-colors">
                      <h3 className="font-semibold text-gray-800 mb-2">{caseItem.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{caseItem.story}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-2xl shadow-card p-6 lg:sticky lg:top-24">
              <h3 className="text-lg font-bold text-gray-800 mb-5">快速咨询</h3>
              
              <div className="space-y-4">
                <div className="flex items-start p-4 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3 shadow-sm">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-0.5">服务类型</div>
                    <div className="font-semibold text-gray-800">{consultant.service_type}</div>
                  </div>
                </div>
                
                <div className="flex items-start p-4 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3 shadow-sm">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-0.5">所在地区</div>
                    <div className="font-semibold text-gray-800">{consultant.region}</div>
                  </div>
                </div>
                
                <div className="flex items-start p-4 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3 shadow-sm">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-0.5">从业年限</div>
                    <div className="font-semibold text-gray-800">{consultant.experience} 年</div>
                  </div>
                </div>

                <div className="pt-4">
                  <Link
                    to="/contact"
                    className="flex items-center justify-center w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-3 rounded-xl font-medium transition-all shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    立即预约
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsultantDetail;
