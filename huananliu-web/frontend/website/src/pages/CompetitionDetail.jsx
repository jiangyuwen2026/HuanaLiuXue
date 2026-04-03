import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { submitMessage } from '../utils/api';
import DOMPurify from 'dompurify';
import api from '../utils/api';

const CompetitionDetail = () => {
  const { slug } = useParams();
  const [competition, setCompetition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    grade: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // 分类映射
  const categoryMap = {
    math: { name: '数学竞赛', color: 'from-blue-500 to-indigo-600', bgColor: 'bg-blue-50', textColor: 'text-blue-600', lightColor: 'blue' },
    physics: { name: '物理竞赛', color: 'from-purple-500 to-violet-600', bgColor: 'bg-purple-50', textColor: 'text-purple-600', lightColor: 'purple' },
    chemistry: { name: '化学竞赛', color: 'from-emerald-500 to-teal-600', bgColor: 'bg-emerald-50', textColor: 'text-emerald-600', lightColor: 'emerald' },
    biology: { name: '生物竞赛', color: 'from-rose-500 to-pink-600', bgColor: 'bg-rose-50', textColor: 'text-rose-600', lightColor: 'rose' },
    computer: { name: '计算机竞赛', color: 'from-cyan-500 to-blue-600', bgColor: 'bg-cyan-50', textColor: 'text-cyan-600', lightColor: 'cyan' },
    business: { name: '商科竞赛', color: 'from-amber-500 to-orange-600', bgColor: 'bg-amber-50', textColor: 'text-amber-600', lightColor: 'amber' }
  };

  // 难度映射
  const levelMap = {
    beginner: { label: '入门级', color: 'green' },
    intermediate: { label: '中级', color: 'blue' },
    advanced: { label: '高级', color: 'purple' }
  };

  // 获取竞赛详情数据
  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        const res = await api.get(`/competitions/detail/${slug}`);
        if (res.success && res.data) {
          setCompetition(res.data);
        }
      } catch (error) {
        console.error('获取竞赛详情失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompetition();
  }, [slug]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitMessage({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        country: categoryMap[competition?.category]?.name || '竞赛咨询',
        message: `竞赛: ${competition?.name} (${slug}), 年级: ${formData.grade}, 备注: ${formData.message}`
      });
      setSubmitted(true);
    } catch (error) {
      setSubmitted(true);
    }
    setSubmitting(false);
  };

  // 安全的HTML渲染
  const createMarkup = (html) => {
    if (!html) return { __html: '' };
    return { __html: DOMPurify.sanitize(html) };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-violet-600 rounded-full"></div>
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">竞赛信息未找到</h2>
          <Link to="/competition" className="text-violet-600 hover:underline">返回竞赛规划</Link>
        </div>
      </div>
    );
  }

  const categoryInfo = categoryMap[competition.category] || categoryMap.math;
  const levelInfo = levelMap[competition.level] || { label: '中级', color: 'blue' };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className={`relative bg-gradient-to-br ${categoryInfo.color} py-16 lg:py-20 overflow-hidden`}>
        {/* 背景装饰 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
        
        <div className="relative container mx-auto px-4">
          <Link to="/competition" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors text-sm">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回竞赛规划
          </Link>
          
          <div className="max-w-4xl">
            {competition.hero_tag && (
              <span className={`inline-block px-3 py-1 bg-white/20 text-white text-xs font-medium rounded-full mb-4 backdrop-blur-sm`}>
                {competition.hero_tag}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">{competition.name}</h1>
            {competition.name_en && (
              <p className="text-lg text-white/70 mb-4">{competition.name_en}</p>
            )}
            {competition.hero_short_desc && (
              <p className="text-xl text-white/90 mb-6 max-w-2xl">{competition.hero_short_desc}</p>
            )}
            
            {/* 统计信息 */}
            <div className="flex flex-wrap gap-6 mt-8">
              {competition.participants && (
                <div className="flex items-center text-white/90">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>全球 {competition.participants} 参赛者</span>
                </div>
              )}
              {competition.countries && (
                <div className="flex items-center text-white/90">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{competition.countries} 国家参与</span>
                </div>
              )}
              {competition.difficulty_score && (
                <div className="flex items-center text-white/90">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>难度 {competition.difficulty_score}/10</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tab Navigation */}
            <div className="bg-white rounded-xl shadow-card p-2 sticky top-20 z-30">
              <div className="flex flex-wrap gap-1">
                {[
                  { id: 'overview', label: '竞赛概述', icon: '📋' },
                  { id: 'format', label: '赛制大纲', icon: '📝' },
                  { id: 'timeline', label: '时间节点', icon: '📅' },
                  { id: 'awards', label: '奖项设置', icon: '🏆' },
                  { id: 'resources', label: '备考资源', icon: '📚' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? `bg-${categoryInfo.lightColor}-50 text-${categoryInfo.lightColor}-600`
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-2xl shadow-card p-6 lg:p-8">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">竞赛概述</h2>
                  
                  {/* Overview Content */}
                  {competition.overview && (
                    <div 
                      className="prose prose-slate max-w-none"
                      dangerouslySetInnerHTML={createMarkup(competition.overview)}
                    />
                  )}

                  {/* Eligibility */}
                  {competition.eligibility && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">参赛资格</h3>
                      <div className="bg-slate-50 rounded-xl p-5">
                        <p className="text-gray-700">{competition.eligibility}</p>
                      </div>
                    </div>
                  )}

                  {/* Recognition */}
                  {competition.recognition && (
                    <div className="mt-6 flex items-start gap-3 p-4 bg-violet-50 rounded-xl border border-violet-100">
                      <svg className="w-5 h-5 text-violet-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      <div>
                        <h4 className="font-semibold text-violet-900">认可度</h4>
                        <p className="text-violet-700 text-sm mt-1">{competition.recognition}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Format Tab */}
              {activeTab === 'format' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">竞赛形式与大纲</h2>
                  
                  {competition.format && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">竞赛形式</h3>
                      <div 
                        className="prose prose-slate max-w-none"
                        dangerouslySetInnerHTML={createMarkup(competition.format)}
                      />
                    </div>
                  )}

                  {competition.syllabus && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">考试大纲</h3>
                      <div 
                        className="prose prose-slate max-w-none"
                        dangerouslySetInnerHTML={createMarkup(competition.syllabus)}
                      />
                    </div>
                  )}

                  {competition.scoring && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">评分标准</h3>
                      <div className="bg-slate-50 rounded-xl p-5">
                        <p className="text-gray-700">{competition.scoring}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Timeline Tab */}
              {activeTab === 'timeline' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">竞赛时间节点</h2>
                  
                  {competition.timeline && competition.timeline.length > 0 ? (
                    <div className="space-y-4">
                      {competition.timeline.map((item, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-3 h-3 rounded-full bg-${categoryInfo.lightColor}-500`}></div>
                            {index < competition.timeline.length - 1 && (
                              <div className="w-0.5 flex-1 bg-gray-200 my-2"></div>
                            )}
                          </div>
                          <div className="flex-1 pb-6">
                            <div className="bg-slate-50 rounded-xl p-4">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-sm font-semibold text-${categoryInfo.lightColor}-600`}>{item.date}</span>
                              </div>
                              <h4 className="font-medium text-gray-900">{item.title}</h4>
                              {item.description && (
                                <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">暂无时间节点信息</p>
                  )}
                </div>
              )}

              {/* Awards Tab */}
              {activeTab === 'awards' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">奖项设置</h2>
                  
                  {competition.awards && (
                    <div 
                      className="prose prose-slate max-w-none"
                      dangerouslySetInnerHTML={createMarkup(competition.awards)}
                    />
                  )}

                  {competition.award_details && competition.award_details.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">奖项详情</h3>
                      <div className="space-y-3">
                        {competition.award_details.map((award, index) => (
                          <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                            <span className="text-2xl">🏅</span>
                            <div>
                              <h4 className="font-semibold text-gray-900">{award.level}</h4>
                              {award.requirement && (
                                <p className="text-sm text-gray-600 mt-1">条件：{award.requirement}</p>
                              )}
                              {award.benefit && (
                                <p className="text-sm text-gray-600 mt-1">权益：{award.benefit}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {competition.score_history && competition.score_history.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">历年分数线</h3>
                      <div className="overflow-hidden rounded-xl border border-gray-200">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left font-medium text-gray-700">年份</th>
                              <th className="px-4 py-3 text-left font-medium text-gray-700">分数线</th>
                              <th className="px-4 py-3 text-left font-medium text-gray-700">备注</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {competition.score_history.map((score, index) => (
                              <tr key={index} className="bg-white">
                                <td className="px-4 py-3 text-gray-900">{score.year}</td>
                                <td className="px-4 py-3 font-medium text-gray-900">{score.cutoff}</td>
                                <td className="px-4 py-3 text-gray-600">{score.note}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Resources Tab */}
              {activeTab === 'resources' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">备考资源</h2>
                  
                  {competition.resources && competition.resources.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {competition.resources.map((resource, index) => (
                        <div key={index} className="p-4 bg-slate-50 rounded-xl hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">
                              {resource.type === 'course' && '📺'}
                              {resource.type === 'material' && '📄'}
                              {resource.type === 'video' && '🎥'}
                              {resource.type === 'tool' && '🛠️'}
                            </span>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{resource.title}</h4>
                              {resource.description && (
                                <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                              )}
                              {resource.link && (
                                <a 
                                  href={resource.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-sm text-violet-600 hover:text-violet-700 mt-2"
                                >
                                  查看资源
                                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">暂无备考资源</p>
                  )}

                  {competition.recommended_books && competition.recommended_books.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">推荐书籍</h3>
                      <div className="space-y-3">
                        {competition.recommended_books.map((book, index) => (
                          <div key={index} className="flex gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                            <span className="text-3xl">📖</span>
                            <div>
                              <h4 className="font-semibold text-gray-900">{book.title}</h4>
                              {book.author && (
                                <p className="text-sm text-gray-600">作者：{book.author}</p>
                              )}
                              {book.description && (
                                <p className="text-sm text-gray-600 mt-1">{book.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-8 text-white">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">需要专业的竞赛规划指导？</h3>
                  <p className="text-white/80">我们的金牌导师团队将为您量身定制备赛方案</p>
                </div>
                <a
                  href="#consult-form"
                  className="px-8 py-3 bg-white text-violet-700 rounded-xl font-semibold hover:bg-violet-50 transition-colors whitespace-nowrap"
                >
                  免费获取规划方案
                </a>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">竞赛信息</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-500">竞赛类别</span>
                  <span className={`px-2 py-1 ${categoryInfo.bgColor} ${categoryInfo.textColor} rounded-lg text-xs font-medium`}>
                    {categoryInfo.name}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-500">难度等级</span>
                  <span className={`px-2 py-1 bg-${levelInfo.color}-50 text-${levelInfo.color}-600 rounded-lg text-xs font-medium`}>
                    {levelInfo.label}
                  </span>
                </div>
                {competition.difficulty_score && (
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-500">难度评分</span>
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[...Array(10)].map((_, i) => (
                          <div 
                            key={i}
                            className={`w-2 h-2 rounded-full mr-0.5 ${i < competition.difficulty_score ? 'bg-violet-500' : 'bg-gray-200'}`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-900 font-medium">{competition.difficulty_score}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Official Link */}
              {competition.official_url && (
                <a
                  href={competition.official_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex items-center justify-center w-full py-3 border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:border-violet-500 hover:text-violet-600 transition-colors"
                >
                  访问官网
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>

            {/* Consultation Form */}
            <div id="consult-form" className="bg-white rounded-2xl shadow-card p-6">
              <h3 className="font-bold text-gray-900 mb-1">预约咨询</h3>
              <p className="text-sm text-gray-500 mb-4">获取专业竞赛规划建议</p>
              
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-900 font-medium">提交成功！</p>
                  <p className="text-gray-500 text-sm mt-1">我们将尽快与您联系</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="您的姓名"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:bg-white transition-all"
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="联系电话"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:bg-white transition-all"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="邮箱（选填）"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:bg-white transition-all"
                  />
                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:bg-white transition-all"
                  >
                    <option value="">选择年级</option>
                    <option value="8年级及以下">8年级及以下</option>
                    <option value="9年级">9年级</option>
                    <option value="10年级">10年级</option>
                    <option value="11年级">11年级</option>
                    <option value="12年级">12年级</option>
                  </select>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="备注信息（选填）"
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:bg-white transition-all resize-none"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-violet-600 to-purple-700 text-white py-3.5 rounded-xl font-semibold hover:from-violet-700 hover:to-purple-800 transition-all disabled:opacity-50 shadow-lg shadow-violet-200"
                  >
                    {submitting ? '提交中...' : '立即预约'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionDetail;
