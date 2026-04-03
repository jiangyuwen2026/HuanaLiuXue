import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAbout } from '../utils/api';

function About() {
  const [activeTab, setActiveTab] = useState('mission');
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAbout();
        if (res.success) {
          setAboutData(res.data);
        }
      } catch (error) {
        console.error('获取关于我们数据失败:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // 默认数据（当后端数据未加载时）
  const defaultData = {
    stats: [],
    values: [],
    timeline: [],
    team: [],
    partners: [],
    advantages: []
  };

  const data = aboutData || defaultData;

  // 获取图标组件
  const getIcon = (iconName) => {
    const icons = {
      shield: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      users: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      globe: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
      heart: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    };
    return icons[iconName] || icons.shield;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section 
        className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-blue-900 py-20 lg:py-28 overflow-hidden"
        style={data.hero_background ? {
          backgroundImage: `linear-gradient(to bottom right, rgba(30, 58, 138, 0.95), rgba(37, 99, 235, 0.9)), url(${data.hero_background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 bg-white/10 text-white/90 text-sm font-medium rounded-full mb-6 border border-white/20">
              {data.hero_subtitle || '关于华南留学'}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {data.hero_title || '助力学子实现全球教育梦想'}
            </h1>
            <p className="text-lg md:text-xl text-blue-100 leading-relaxed">
              {data.hero_description || '华南留学是一家专业的国际教育咨询机构，致力于帮助学生进入世界顶尖学府。'}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {data.stats && data.stats.length > 0 && (
        <section className="container mx-auto px-4 -mt-12 relative z-10 mb-20">
          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {data.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-1">{stat.value}</div>
                  <div className="text-gray-900 font-medium">{stat.label}</div>
                  <div className="text-gray-500 text-sm">{stat.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              { key: 'mission', label: data.mission_title || '我们的使命' },
              { key: 'vision', label: data.vision_title || '我们的愿景' },
              { key: 'values', label: '核心价值观' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-slate-100 text-gray-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="max-w-4xl mx-auto">
            {activeTab === 'mission' && (
              <div className="text-center animate-fade-in">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{data.mission_title || '我们的使命'}</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {data.mission_content || '我们坚信每位学生都应享有优质国际教育的机会...'}
                </p>
              </div>
            )}

            {activeTab === 'vision' && (
              <div className="text-center animate-fade-in">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{data.vision_title || '我们的愿景'}</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {data.vision_content || '成为中国最受信赖的国际教育服务机构...'}
                </p>
              </div>
            )}

            {activeTab === 'values' && data.values && data.values.length > 0 && (
              <div className="text-center animate-fade-in">
                <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">核心价值观</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  {data.values.map((value, index) => (
                    <div key={index} className="bg-slate-50 rounded-xl p-6 text-left">
                      <div className={`w-12 h-12 bg-gradient-to-br ${value.color || 'from-gray-500 to-gray-600'} rounded-xl flex items-center justify-center text-white mb-4`}>
                        {getIcon(value.icon)}
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 mb-2">{value.title}</h3>
                      <p className="text-gray-600 text-sm">{value.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Timeline */}
      {data.timeline && data.timeline.length > 0 && (
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-block px-4 py-1.5 bg-amber-50 text-amber-700 text-sm font-medium rounded-full mb-4">
                发展历程
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                匠心历程
              </h2>
              <p className="text-gray-600 text-lg">
                从初创到行业领先，我们始终坚持专业与品质
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {data.timeline.map((item, index) => (
                <div key={index} className="flex gap-6 mb-8 last:mb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {item.year?.slice(-2) || index + 1}
                    </div>
                    {index < data.timeline.length - 1 && (
                      <div className="w-0.5 h-full bg-primary-200 mt-4" />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow">
                      <span className="text-primary-600 font-bold text-sm">{item.year}</span>
                      <h3 className="text-xl font-bold text-gray-900 mt-1 mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      {data.advantages && data.advantages.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full mb-4">
                  为什么选择我们
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  {data.advantages_title || '专业团队，值得信赖'}
                </h2>
                <p className="text-gray-600 text-lg mb-8">
                  {data.advantages_subtitle || '我们深知留学申请对学生和家庭的重要性...'}
                </p>
                <div className="space-y-6">
                  {data.advantages.map((item, index) => (
                    <div key={index} className="flex group">
                      <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center group-hover:from-primary-600 group-hover:to-primary-700 transition-all duration-300">
                        <span className="text-primary-600 group-hover:text-white font-bold transition-colors">{item.icon}</span>
                      </div>
                      <div className="ml-4">
                        <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-gray-600 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src={data.advantages_image || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80"}
                    alt="团队"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-card p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">98% 录取成功率</p>
                      <p className="text-gray-500 text-sm">2024年度数据</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Team Section */}
      {data.team && data.team.length > 0 && (
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-block px-4 py-1.5 bg-purple-50 text-purple-700 text-sm font-medium rounded-full mb-4">
                核心团队
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {data.team_title || '认识我们的团队'}
              </h2>
              <p className="text-gray-600 text-lg">
                {data.team_subtitle || '专业的顾问团队，拥有丰富的国际教育咨询经验'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.team.map((member, index) => (
                <div key={index} className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300">
                  <div className="relative h-56 overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200">
                    {member.avatar ? (
                      <img 
                        src={member.avatar} 
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary-400">
                        <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="font-bold text-lg">{member.name}</h3>
                      <p className="text-white/80 text-sm">{member.title}</p>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-gray-600 text-sm">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Partners */}
      {data.partners && data.partners.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-full mb-4">
                合作院校
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {data.partners_title || '全球顶尖院校合作伙伴'}
              </h2>
              <p className="text-gray-600 text-lg">
                {data.partners_subtitle || '与全球100+顶尖院校建立紧密合作关系'}
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              {data.partners.map((partner, index) => (
                <div 
                  key={index} 
                  className="px-6 py-3 bg-slate-50 rounded-xl text-gray-700 font-medium hover:bg-primary-50 hover:text-primary-600 transition-colors cursor-default"
                >
                  {partner}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-900 via-primary-800 to-blue-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              开启您的留学之旅
            </h2>
            <p className="text-lg text-blue-100 mb-10">
              让我们帮助您找到最适合的院校和专业，实现您的梦想。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center bg-white text-primary-700 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                免费咨询
              </Link>
              <Link
                to="/schools"
                className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 px-8 py-4 rounded-xl font-semibold transition-all border border-white/40"
              >
                浏览院校
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
