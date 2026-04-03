import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSchoolDetail, getSchools } from '../utils/api';
import DOMPurify from 'dompurify';

function SchoolDetail() {
  const { id } = useParams();
  const [school, setSchool] = useState(null);
  const [relatedSchools, setRelatedSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        const res = await getSchoolDetail(id);
        if (res.success) {
          setSchool(res.data);
          // Fetch related schools from same country
          const relatedRes = await getSchools({ country: res.data.country, limit: 4 });
          if (relatedRes.success) {
            setRelatedSchools(relatedRes.data.list.filter(s => s.id !== parseInt(id)).slice(0, 3));
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSchool();
  }, [id]);

  const getCountryFlag = (country) => {
    const flags = {
      '香港': '🇭🇰', '澳门': '🇲🇴', '中国': '🇨🇳', '英国': '🇬🇧',
      '美国': '🇺🇸', '澳大利亚': '🇦🇺', '加拿大': '🇨🇦', '新加坡': '🇸🇬'
    };
    return flags[country] || '🌏';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  if (!school) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center bg-white rounded-2xl shadow-card p-10">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">学校不存在</h2>
          <p className="text-gray-500 mb-6">抱歉，未找到该学校的详细信息</p>
          <Link to="/schools" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回院校库
          </Link>
        </div>
      </div>
    );
  }

  const parseRequirements = () => {
    if (!school.requirements) return null;
    if (typeof school.requirements === 'object') return school.requirements;
    try {
      return JSON.parse(school.requirements);
    } catch {
      return null;
    }
  };
  const requirements = parseRequirements();

  // Sample data for demonstration
  const highlights = school.features || ['世界级师资', '国际化视野', '科研实力强', '就业率高'];
  const faculties = school.faculties || [
    { name: '商学院', majors: ['金融学', '会计学', '市场营销', '国际商务'] },
    { name: '工程学院', majors: ['计算机科学', '电子工程', '机械工程'] },
    { name: '文学院', majors: ['中文', '英文', '历史', '哲学'] }
  ];
  const masterPrograms = school.master_categories || [
    { name: '商科类', majors: ['MBA', '金融硕士', '会计硕士'] },
    { name: '工程类', majors: ['计算机硕士', '数据科学', '人工智能'] }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="relative h-[400px] lg:h-[500px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          {school.banner && !imageError ? (
            <>
              <img 
                src={school.banner} 
                alt={`${school.name_cn}校园`}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent" />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-900 via-primary-800 to-blue-900" />
          )}
        </div>
        
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-end pb-12">
          {/* Breadcrumb */}
          <div className="flex items-center text-white/60 text-sm mb-6">
            <Link to="/" className="hover:text-white transition-colors">首页</Link>
            <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link to="/schools" className="hover:text-white transition-colors">院校库</Link>
            <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white">{school.name_cn}</span>
          </div>
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="w-20 h-20 lg:w-28 lg:h-28 bg-white rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden">
              {school.logo ? (
                <img 
                  src={school.logo} 
                  alt={`${school.name_cn} Logo`}
                  className="w-full h-full object-contain p-2"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = getCountryFlag(school.country);
                    e.target.parentElement.classList.add('text-5xl', 'lg:text-6xl');
                  }}
                />
              ) : (
                <span className="text-5xl lg:text-6xl">{getCountryFlag(school.country)}</span>
              )}
            </div>
            <div className="text-white flex-1">
              <h1 className="text-3xl lg:text-5xl font-bold mb-2">{school.name_cn}</h1>
              <p className="text-lg lg:text-xl text-white/80 mb-4">{school.name_en}</p>
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {school.country} · {school.city}
                </span>
                {school.rank && (
                  <span className="flex items-center bg-amber-500 text-white px-4 py-2 rounded-xl font-medium">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    QS 全球排名 #{school.rank}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-card p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4">
            <div className="text-2xl font-bold text-primary-600">{school.rank || 'TOP 100'}</div>
            <div className="text-gray-500 text-sm">QS排名</div>
          </div>
          <div className="text-center p-4 border-l border-gray-100">
            <div className="text-2xl font-bold text-primary-600">{faculties.length}+</div>
            <div className="text-gray-500 text-sm">学院数量</div>
          </div>
          <div className="text-center p-4 border-l border-gray-100">
            <div className="text-2xl font-bold text-primary-600">{school.tuition || '详询'}</div>
            <div className="text-gray-500 text-sm">学费/年</div>
          </div>
          <div className="text-center p-4 border-l border-gray-100">
            <div className="text-2xl font-bold text-primary-600">{requirements?.['语言要求'] || '雅思6.5+'}</div>
            <div className="text-gray-500 text-sm">语言要求</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <section className="bg-white rounded-2xl shadow-card p-6 lg:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                学校简介
              </h2>
              <div 
                className="text-gray-600 leading-relaxed text-base prose prose-slate max-w-none
                  prose-h2:text-xl prose-h2:font-bold prose-h2:text-gray-900 prose-h2:mt-6 prose-h2:mb-4
                  prose-h3:text-lg prose-h3:font-semibold prose-h3:text-gray-800 prose-h3:mt-4 prose-h3:mb-2
                  prose-p:mb-4 prose-p:text-gray-600
                  prose-ul:list-disc prose-ul:pl-5 prose-ul:mb-4
                  prose-li:mb-2 prose-li:text-gray-600
                  prose-strong:font-semibold prose-strong:text-gray-800"
                dangerouslySetInnerHTML={{ 
                  __html: school.description 
                    ? DOMPurify.sanitize(school.description)
                    : `<p>${school.name_cn}（${school.name_en}）是${school.country}著名的高等学府，在教学和科研方面享有盛誉。学校致力于培养具有国际视野的优秀人才，为学生提供优质的教育资源和广阔的发展平台。</p>`
                }}
              />
            </section>

            {/* Highlights */}
            <section className="bg-white rounded-2xl shadow-card p-6 lg:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                特色亮点
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {highlights.map((item, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-4 text-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                      <span className="text-2xl">{['🎯', '🏆', '📚', '💼'][i]}</span>
                    </div>
                    <span className="text-gray-700 font-medium text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Faculties */}
            <section className="bg-white rounded-2xl shadow-card p-6 lg:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                院系设置
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {faculties.map((faculty, index) => (
                  <div key={index} className="border border-gray-100 rounded-xl p-4 hover:border-emerald-200 hover:shadow-md transition-all group">
                    <h3 className="font-bold text-gray-800 mb-3 group-hover:text-emerald-600 transition-colors">{faculty.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {faculty.majors.map((major, idx) => (
                        <span key={idx} className="bg-gray-50 text-gray-600 px-3 py-1 rounded-lg text-sm">
                          {major}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Master Programs */}
            <section className="bg-white rounded-2xl shadow-card p-6 lg:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                硕士专业
              </h2>
              <div className="space-y-4">
                {masterPrograms.map((category, index) => (
                  <div key={index} className="bg-purple-50/50 border border-purple-100 rounded-xl p-5">
                    <h3 className="font-bold text-purple-700 mb-3 flex items-center">
                      <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-2 text-sm">
                        {index + 1}
                      </span>
                      {category.name}
                    </h3>
                    <div className="flex flex-wrap gap-2 ml-10">
                      {category.majors.map((major, idx) => (
                        <span key={idx} className="bg-white text-purple-600 px-4 py-1.5 rounded-lg text-sm shadow-sm border border-purple-100">
                          {major}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Related Schools */}
            {relatedSchools.length > 0 && (
              <section className="bg-white rounded-2xl shadow-card p-6 lg:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  同地区推荐院校
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {relatedSchools.map((s) => (
                    <Link 
                      key={s.id} 
                      to={`/schools/${s.id}`}
                      className="group block border border-gray-100 rounded-xl p-4 hover:border-primary-200 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{getCountryFlag(s.country)}</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-800 truncate group-hover:text-primary-600 transition-colors">{s.name_cn}</h3>
                          <p className="text-gray-500 text-sm truncate">{s.name_en}</p>
                        </div>
                      </div>
                      {s.rank && (
                        <div className="mt-2 text-xs text-amber-600 font-medium">
                          QS #{s.rank}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Quick Consult */}
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center">
                  <svg className="w-5 h-5 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  快速咨询
                </h3>
                
                <div className="space-y-4">
                  {school.tuition && (
                    <div className="flex items-start p-4 bg-slate-50 rounded-xl">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3 shadow-sm">
                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-0.5">学费范围</div>
                        <div className="font-semibold text-gray-800">{school.tuition}</div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start p-4 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3 shadow-sm">
                      <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-0.5">所在地区</div>
                      <div className="font-semibold text-gray-800">{school.country} {school.city}</div>
                    </div>
                  </div>
                  
                  {requirements && Object.keys(requirements).length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-700 mb-3 text-sm">申请要求</h4>
                      <div className="space-y-2 text-sm">
                        {Object.entries(requirements).map(([key, value]) => (
                          <div key={key} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                            <span className="text-gray-500">{key}</span>
                            <span className="font-medium text-gray-800">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 space-y-3">
                    {school.website && (
                      <a
                        href={school.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-xl font-medium transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        访问官网
                      </a>
                    )}
                    <Link
                      to="/contact"
                      className="flex items-center justify-center w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-3 rounded-xl font-medium transition-all shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      立即咨询
                    </Link>
                  </div>
                </div>
              </div>

              {/* Hot Majors */}
              <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl shadow-card p-6 text-white">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                  </svg>
                  热门专业推荐
                </h3>
                <div className="space-y-2">
                  {['金融学', '计算机科学', '工商管理', '数据科学'].map((major, i) => (
                    <div key={i} className="flex items-center bg-white/10 rounded-lg px-3 py-2">
                      <span className="w-6 h-6 bg-white/20 rounded flex items-center justify-center text-xs mr-2">
                        {i + 1}
                      </span>
                      <span>{major}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SchoolDetail;
