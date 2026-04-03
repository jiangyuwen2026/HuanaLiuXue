import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCases, getFeaturedCases, getTestimonials } from '../utils/api';

function Cases() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [featuredCases, setFeaturedCases] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await getCases({ limit: 20 });
        if (res.success) setCases(res.data.list);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);

  // 获取明星案例
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await getFeaturedCases(6);
        if (res.success && res.data.length > 0) {
          setFeaturedCases(res.data);
        }
      } catch (error) {
        console.error('获取明星案例失败:', error);
      } finally {
        setFeaturedLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  // 获取学生留言
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await getTestimonials(10);
        if (res.success && res.data.length > 0) {
          setTestimonials(res.data);
        }
      } catch (error) {
        console.error('获取留言失败:', error);
      } finally {
        setTestimonialsLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const stats = [
    { value: '5000+', label: '成功案例', desc: '圆梦世界名校' },
    { value: '98%', label: '录取成功率', desc: '专业服务保障' },
    { value: '85%', label: '奖学金获得率', desc: '经济负担减轻' },
    { value: 'TOP50', label: '名校录取', desc: '世界顶尖学府' }
  ];

  const filters = [
    { key: 'all', label: '全部案例' },
    { key: '香港', label: '香港' },
    { key: '英国', label: '英国' },
    { key: '美国', label: '美国' },
    { key: '新加坡', label: '新加坡' }
  ];

  // 根据筛选条件过滤案例
  const filteredCases = cases.filter(c => {
    if (activeFilter === 'all') return true;
    return c.target_country === activeFilter;
  });

  // 明星案例现在从API获取
  // 默认背景配色方案（当后台未设置时使用）
  const defaultBgColors = [
    'from-blue-500 to-cyan-600',
    'from-violet-500 to-purple-600',
    'from-amber-500 to-orange-600',
    'from-emerald-500 to-teal-600',
    'from-rose-500 to-pink-600',
    'from-indigo-500 to-blue-600'
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium rounded-full mb-6 border border-white/20">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              真实案例见证实力
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              每一个成功背后<br />
              <span className="text-cyan-300">都是专业与坚持</span>
            </h1>
            <p className="text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto leading-relaxed">
              真实案例，见证实力。每一位学生的成功录取，都是我们专业服务的最好证明
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 -mt-12 relative z-10 mb-16">
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-1">{stat.value}</div>
                <div className="text-gray-900 font-medium">{stat.label}</div>
                <div className="text-gray-500 text-sm">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cases */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-4 py-1.5 bg-amber-50 text-amber-700 text-sm font-medium rounded-full mb-4">
              明星案例
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              他们已成功圆梦名校
            </h2>
            <p className="text-gray-600 text-lg">
              每一个Offer背后，都有我们的专业付出
            </p>
          </div>

          {featuredLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
            </div>
          ) : featuredCases.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>暂无明星案例展示</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCases.map((item, index) => (
              <Link 
                key={item.id || index} 
                to={`/cases/${item.id}`}
                className={`relative bg-gradient-to-br ${item.bg || defaultBgColors[index % defaultBgColors.length]} rounded-2xl p-6 text-white overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-3xl backdrop-blur-sm">
                      {item.avatar}
                    </div>
                    <div className="ml-3">
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <p className="text-white/80 text-sm">{item.score}</p>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
                    <p className="text-amber-300 text-xs font-medium mb-1">录取院校</p>
                    <p className="font-bold text-xl">{item.school}</p>
                    <p className="text-white/80 text-sm">{item.major}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm">{item.result}</span>
                    <span className="text-white/80 text-sm">{item.highlight}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
                  activeFilter === filter.key
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Cases List */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCases.map((c) => (
                  <Link 
                    key={c.id} 
                    to={`/cases/${c.id}`}
                    className="group bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden border border-gray-100"
                  >
                    <div className="h-48 bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center relative overflow-hidden">
                      {c.cover ? (
                        <>
                          <img 
                            src={c.cover} 
                            alt={c.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        </>
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 group-hover:opacity-100 opacity-0 transition-opacity" />
                          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform">
                            🎉
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-lg">
                          {c.target_country === '香港' ? '🇭🇰' : 
                           c.target_country === '英国' ? '🇬🇧' : 
                           c.target_country === '美国' ? '🇺🇸' : 
                           c.target_country === '新加坡' ? '🇸🇬' : '🌏'}
                        </span>
                        <div>
                          <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                            {c.student_name || '学生'}
                          </h3>
                          <span className="text-gray-500 text-sm">{c.target_country}</span>
                        </div>
                      </div>
                      
                      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-1">{c.title}</h4>
                      
                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 mb-3">
                        <div className="flex items-center text-emerald-700">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="font-medium text-sm">{c.admission_result}</span>
                        </div>
                      </div>
                      
                      {c.scholarship && (
                        <div className="flex items-center text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                          </svg>
                          <span>奖学金: {c.scholarship}</span>
                        </div>
                      )}
                      
                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-gray-500 text-sm">查看详情</span>
                        <span className="text-emerald-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {filteredCases.length === 0 && (
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">📋</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {activeFilter === 'all' ? '暂无案例数据' : `暂无${filters.find(f => f.key === activeFilter)?.label}案例`}
                  </h3>
                  <p className="text-gray-500">
                    {activeFilter === 'all' ? '敬请期待更多成功案例' : '请查看其他地区的案例'}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Testimonial Section - 从右向左滚动轮播 */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4 mb-12">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full mb-4">
              真实评价
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              听听他们怎么说
            </h2>
            <p className="text-gray-600 text-lg">
              来自成功录取学员的真实反馈
            </p>
          </div>
        </div>

        {/* 轮播容器 */}
        <div className="relative">
          {/* 渐变遮罩 - 左侧 */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          {/* 渐变遮罩 - 右侧 */}
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          
          {testimonialsLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>暂无学员留言</p>
            </div>
          ) : (
            <div className="flex animate-scroll-left">
              {/* 复制两份数据实现无缝滚动 */}
              {[...testimonials, ...testimonials].map((item, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-[400px] mx-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 relative"
                >
                  <div className="absolute top-4 right-4 text-6xl text-emerald-200 font-serif leading-none">"</div>
                  <div className="relative z-10">
                    <p className="text-gray-700 leading-relaxed mb-4 line-clamp-4">
                      {item.content}
                    </p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                        {item.student_name ? item.student_name[0] : '学'}
                      </div>
                      <div className="ml-3">
                        <p className="font-bold text-gray-900">{item.student_name}</p>
                        <p className="text-emerald-600 text-sm">{item.school} · {item.major}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CSS动画 */}
        <style>{`
          @keyframes scroll-left {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-scroll-left {
            animation: scroll-left 30s linear infinite;
          }
          .animate-scroll-left:hover {
            animation-play-state: paused;
          }
        `}</style>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              开启你的成功之旅
            </h2>
            <p className="text-lg text-emerald-100 mb-10">
              加入华南留学，让我们一起创造属于你的成功故事
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center bg-white text-emerald-700 hover:bg-emerald-50 px-8 py-4 rounded-xl font-semibold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              立即咨询
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Cases;
