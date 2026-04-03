import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getNewsDetail, getHotNews } from '../utils/api';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

// 配置 marked 选项
marked.setOptions({
  headerIds: false,
  mangle: false,
  breaks: true,
  gfm: true
});

function NewsDetail() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [hotNews, setHotNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [newsRes, hotRes] = await Promise.all([
          getNewsDetail(id),
          getHotNews()
        ]);
        if (newsRes.success) setNews(newsRes.data);
        if (hotRes.success) {
          setHotNews(hotRes.data.filter(n => n.id !== parseInt(id)).slice(0, 5));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

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

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('链接已复制到剪贴板');
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryStyle = (category) => {
    const styles = {
      '留学攻略': 'bg-primary-600',
      '院校动态': 'bg-accent-500',
      '签证指南': 'bg-emerald-500',
      '语言考试': 'bg-purple-500',
      '奖学金': 'bg-amber-500',
      '移民政策': 'bg-rose-500',
      '留学生活': 'bg-cyan-500'
    };
    return styles[category] || 'bg-primary-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-card p-12 max-w-md">
          <div className="text-6xl mb-4">📰</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">资讯不存在</h2>
          <p className="text-gray-500 mb-6">该资讯可能已被删除或暂时无法访问</p>
          <Link 
            to="/news" 
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回资讯列表
          </Link>
        </div>
      </div>
    );
  }

  // 如果内容包含HTML标签，直接使用；否则用marked转换Markdown
  const rawContent = news.content || '';
  const hasHtmlTags = /<[a-z][\s\S]*>/i.test(rawContent);
  const sanitizedContent = hasHtmlTags 
    ? DOMPurify.sanitize(rawContent)
    : DOMPurify.sanitize(marked(rawContent));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50">
        <div 
          className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Hero Section - Consistent with site */}
      <div className="relative min-h-[60vh] md:min-h-[70vh] flex items-end">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${news.cover || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80'})`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900/95 via-primary-800/70 to-primary-900/30" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        {/* Content */}
        <div className="relative w-full container mx-auto px-4 pb-16 pt-32">
          {/* Breadcrumb */}
          <nav className="flex items-center text-white/70 text-sm mb-6">
            <Link to="/" className="hover:text-white transition-colors">首页</Link>
            <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link to="/news" className="hover:text-white transition-colors">资讯</Link>
            <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white">正文</span>
          </nav>

          {/* Category */}
          <span className={`inline-block ${getCategoryStyle(news.category)} text-white px-4 py-1.5 rounded-full text-sm font-medium mb-4`}>
            {news.category}
          </span>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight max-w-4xl">
            {news.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-white/90">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-white">{news.author || '华南留学'}</p>
                <p className="text-white/60 text-xs">{news.source || '原创'}</p>
              </div>
            </div>
            
            <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <svg className="w-4 h-4 mr-2 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">{formatDate(news.published_at)}</span>
            </div>
            
            <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <svg className="w-4 h-4 mr-2 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="text-sm">{news.view_count} 阅读</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          {/* Article Content */}
          <div className="lg:col-span-8">
            {/* Summary Card */}
            {news.summary && (
              <div className="bg-gradient-to-r from-primary-50 to-blue-50 border-l-4 border-primary-500 rounded-r-xl p-6 mb-8">
                <p className="text-gray-700 leading-relaxed font-medium">
                  {news.summary}
                </p>
              </div>
            )}

            {/* Content */}
            <article className="bg-white rounded-2xl shadow-card p-8 md:p-10 border border-gray-100">
              <div 
                className="prose prose-lg prose-slate max-w-none
                  prose-headings:text-gray-900 prose-headings:font-bold
                  prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                  prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-4
                  prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-gray-900
                  prose-img:rounded-xl prose-img:shadow-lg prose-img:mx-auto
                  prose-video:rounded-xl prose-video:shadow-lg prose-video:w-full prose-video:max-w-full
                  prose-iframe:rounded-xl prose-iframe:shadow-lg prose-iframe:w-full prose-iframe:max-w-full
                  prose-ul:list-disc prose-ul:pl-5 prose-li:text-gray-600 prose-li:mb-2
                  prose-ol:list-decimal prose-ol:pl-5
                  prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:bg-slate-50 prose-blockquote:p-4 prose-blockquote:rounded-r-lg prose-blockquote:italic
                  [&_.ql-align-center]:text-center [&_.ql-align-right]:text-right [&_.ql-align-justify]:text-justify
                  [&_.ql-size-small]:text-sm [&_.ql-size-large]:text-xl [&_.ql-size-huge]:text-2xl
                  [&_img]:max-w-full [&_img]:h-auto
                  first:prose-p:mt-0"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />

              {/* Tags */}
              {news.tags && Array.isArray(news.tags) && news.tags.length > 0 && (
                <div className="mt-10 pt-8 border-t border-gray-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {news.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm hover:bg-slate-200 transition-colors cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Share & Navigation */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={handleShare}
                className="flex items-center px-6 py-3 bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all text-gray-700 hover:text-primary-600"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                分享文章
              </button>

              <Link
                to="/news"
                className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                更多资讯
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Author Card */}
            <div className="bg-white rounded-2xl shadow-card p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                关于作者
              </h3>
              <div className="flex items-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-xl font-bold">
                  {(news.author || '华')[0]}
                </div>
                <div className="ml-4">
                  <p className="font-bold text-gray-900">{news.author || '华南留学'}</p>
                  <p className="text-sm text-gray-500">专业留学顾问</p>
                </div>
              </div>
              <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                专注于为学生提供专业的留学规划和申请指导，帮助数千名学生成功进入世界顶尖名校。
              </p>
              <Link
                to="/contact"
                className="mt-4 block w-full text-center py-3 bg-slate-100 text-gray-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
              >
                联系我
              </Link>
            </div>

            {/* Hot News */}
            <div className="bg-white rounded-2xl shadow-card p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
                热门资讯
              </h3>
              <div className="space-y-4">
                {hotNews.map((item, index) => (
                  <Link
                    key={item.id}
                    to={`/news/${item.id}`}
                    className="flex items-start gap-3 group"
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-colors">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm text-gray-700 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {item.view_count} 阅读
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA Card */}
            <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-blue-900 rounded-2xl shadow-lg p-6 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">需要更多帮助？</h3>
              <p className="text-white/80 text-sm mb-4">
                我们的专业顾问团队随时为您提供一对一留学咨询服务
              </p>
              <Link
                to="/contact"
                className="block w-full text-center py-3 bg-white text-primary-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                免费咨询
              </Link>
            </div>

            {/* Back to List */}
            <Link
              to="/news"
              className="flex items-center justify-center w-full py-4 bg-white rounded-2xl shadow-card text-gray-700 hover:text-primary-600 hover:shadow-card-hover transition-all"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回资讯列表
            </Link>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      {hotNews.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">相关推荐</h2>
              <Link to="/news" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
                查看更多
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {hotNews.slice(0, 3).map(item => (
                <Link
                  key={item.id}
                  to={`/news/${item.id}`}
                  className="group bg-slate-50 rounded-2xl overflow-hidden hover:shadow-card-hover transition-all border border-gray-100"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={item.cover || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80'} 
                      alt={item.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`${getCategoryStyle(item.category)} text-white px-2 py-1 rounded text-xs font-medium`}>
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {item.view_count} 阅读
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default NewsDetail;
