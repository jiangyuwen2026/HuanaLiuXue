import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getNews, getNewsCategories, getLatestStudyNews, getRecommendedNews } from '../utils/api';

function News() {
  const [news, setNews] = useState([]);
  const [headlines, setHeadlines] = useState([]);
  const [currentHeadline, setCurrentHeadline] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [studyNews, setStudyNews] = useState([]);
  const [recommendedNews, setRecommendedNews] = useState([]);

  useEffect(() => {
    getNewsCategories().then(res => res.success && setCategories(res.data));
  }, []);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getNews({ category, limit: 20 });
        if (res.success) setNews(res.data.list);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [category]);

  useEffect(() => {
    const fetchHeadlines = async () => {
      try {
        const res = await fetch('/api/headlines');
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setHeadlines(data.data);
        }
      } catch (error) {
        console.error('获取头条失败:', error);
      }
    };
    fetchHeadlines();
  }, []);

  useEffect(() => {
    const fetchStudyNews = async () => {
      try {
        const res = await getLatestStudyNews(6);
        if (res.success) {
          setStudyNews(res.data);
        }
      } catch (error) {
        console.error('获取留学快讯失败:', error);
      }
    };
    fetchStudyNews();
  }, []);

  // 获取推荐阅读
  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const res = await getRecommendedNews(6);
        if (res.success && res.data.length > 0) {
          setRecommendedNews(res.data);
        }
      } catch (error) {
        console.error('获取推荐阅读失败:', error);
      }
    };
    fetchRecommended();
  }, []);

  useEffect(() => {
    if (headlines.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentHeadline((prev) => (prev + 1) % headlines.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [headlines.length]);

  const hotTags = ['香港留学', '英国G5', '美国藤校', '澳洲八大', '新加坡', '雅思备考', '文书写作', '面试技巧'];

  const currentHeadlineData = headlines[currentHeadline] || {
    title: '2025年全球留学趋势报告：亚洲留学热度持续攀升',
    summary: '最新报告显示，香港、新加坡等亚洲留学目的地申请量同比增长35%...',
    cover: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80'
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative bg-gradient-to-br from-slate-800 via-blue-900 to-cyan-900 py-20 lg:py-28 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium rounded-full mb-6 border border-white/20">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              掌握第一手留学资讯
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              留学资讯与攻略<br />
              <span className="text-cyan-300">助你申请无忧</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-200 max-w-2xl mx-auto leading-relaxed">
              最新留学政策解读、申请攻略、院校动态，助你掌握第一手留学信息
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 -mt-8 relative z-10 mb-12">
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={() => setCategory('')} className={`px-6 py-2.5 rounded-xl font-medium transition-all ${!category ? 'bg-primary-600 text-white shadow-lg' : 'bg-slate-50 text-gray-600 hover:bg-slate-100'}`}>全部资讯</button>
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)} className={`px-6 py-2.5 rounded-xl font-medium transition-all ${category === c ? 'bg-primary-600 text-white shadow-lg' : 'bg-slate-50 text-gray-600 hover:bg-slate-100'}`}>{c}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {headlines.length > 0 ? (
                <div className="relative">
                  <Link to={currentHeadlineData.link_type === 'news' && currentHeadlineData.link_id ? `/news/${currentHeadlineData.link_id}` : '#'} className="group block relative rounded-2xl overflow-hidden h-80 lg:h-[420px] shadow-card hover:shadow-card-hover transition-all duration-300">
                    <img src={currentHeadlineData.cover || 'https://via.placeholder.com/800x400'} alt={currentHeadlineData.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">今日头条</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3 group-hover:text-cyan-200 transition-colors">{currentHeadlineData.title}</h2>
                      <p className="text-gray-200 text-sm line-clamp-2 mb-4">{currentHeadlineData.summary}</p>
                    </div>
                  </Link>
                  {headlines.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {headlines.map((_, idx) => (
                        <button key={idx} onClick={() => setCurrentHeadline(idx)} className={`h-2 rounded-full transition-all ${idx === currentHeadline ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/70'}`} />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-80 lg:h-[420px] bg-gray-100 rounded-2xl flex items-center justify-center">加载中...</div>
              )}
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 flex items-center">
                  <span className="w-2 h-2 bg-rose-500 rounded-full mr-2 animate-pulse"></span>
                  留学快讯
                </h3>
              </div>
              <div className="space-y-4">
                {studyNews.length === 0 ? (
                  <div className="text-sm text-gray-500 py-4">暂无快讯</div>
                ) : (
                  studyNews.map((item) => (
                    <Link 
                      key={item.id} 
                      to={`/study-news/${item.id}`}
                      className="flex items-start space-x-3 group cursor-pointer pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                      <span className="text-xs text-primary-600 font-mono bg-primary-50 px-2 py-0.5 rounded shrink-0">{item.time_display}</span>
                      <p className="text-sm text-gray-600 line-clamp-2 group-hover:text-primary-600 transition-colors">{item.title}</p>
                    </Link>
                  ))
                )}
              </div>
              <div className="mt-6 pt-5 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">订阅留学周报</h4>
                <div className="flex space-x-2">
                  <input type="email" placeholder="输入邮箱地址" className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" />
                  <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">订阅</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <span className="inline-block w-1.5 h-7 bg-primary-600 rounded-full mr-3"></span>
                  热门资讯
                </h2>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 text-sm text-primary-600 bg-primary-50 rounded-xl font-medium">最新</button>
                  <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors">最热</button>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin h-12 w-12 border-b-2 border-primary-600 rounded-full"></div>
                </div>
              ) : news.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  <div className="mb-4">
                    <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <p>该分类暂无资讯</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* 分类筛选时显示所有新闻，不跳过第一条 */}
                  {(category ? news : news.slice(1)).map(item => (
                    <Link key={item.id} to={`/news/${item.id}`} className="group flex bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300">
                      <div className="w-56 h-36 flex-shrink-0 relative overflow-hidden">
                        <img src={item.cover || 'https://via.placeholder.com/300x200'} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute top-3 left-3">
                          <span className="bg-white/95 backdrop-blur-sm text-primary-600 text-xs font-semibold px-2.5 py-1 rounded-full">{item.category || '资讯'}</span>
                        </div>
                      </div>
                      <div className="flex-1 p-5 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">{item.title}</h3>
                          <p className="text-gray-600 text-sm line-clamp-2">{item.summary}</p>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 space-x-4 mt-3">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            {new Date(item.published_at).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            {item.view_count || 0}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <div className="text-center mt-10">
                <Link to="/news" className="inline-flex items-center px-8 py-3.5 bg-white text-primary-600 rounded-xl font-semibold shadow-card hover:shadow-card-hover transition-all group">
                  查看更多资讯
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-card">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                  热门标签
                </h3>
                <div className="flex flex-wrap gap-2">
                  {hotTags.map((tag, index) => (
                    <Link key={index} to={`/news?tag=${tag}`} className="px-3 py-1.5 bg-slate-50 text-gray-600 text-sm rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors">{tag}</Link>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-card">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                  推荐阅读
                </h3>
                <div className="space-y-4">
                  {recommendedNews.length === 0 ? (
                    <div className="text-sm text-gray-500 py-4">暂无推荐</div>
                  ) : (
                    recommendedNews.map((item, index) => (
                      <Link key={item.id} to={`/news/${item.id}`} className="flex items-start space-x-3 group">
                        <span className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${index < 3 ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'}`}>{index + 1}</span>
                        <div>
                          <h4 className="text-sm text-gray-800 line-clamp-2 group-hover:text-primary-600 transition-colors">{item.title}</h4>
                          <span className="text-xs text-gray-400 mt-1">阅读 {item.view_count || 0}</span>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-6 text-white shadow-card">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                </div>
                <h3 className="font-bold text-lg mb-2">免费留学评估</h3>
                <p className="text-sm text-primary-100 mb-4">专业顾问1对1解答，定制留学方案</p>
                <Link to="/contact" className="block w-full py-3 bg-white text-primary-600 rounded-xl font-semibold text-sm text-center hover:bg-primary-50 transition-colors shadow-lg">立即咨询</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default News;
