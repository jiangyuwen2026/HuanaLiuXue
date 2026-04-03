import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getStudyNews, getStudyNewsDetail } from '../utils/api';

function StudyNews() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState([]);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [category, setCategory] = useState('');

  const categories = [
    { value: '', label: '全部' },
    { value: '申请动态', label: '申请动态' },
    { value: '签证资讯', label: '签证资讯' },
    { value: '语言考试', label: '语言考试' },
    { value: '奖学金', label: '奖学金' },
    { value: '政策解读', label: '政策解读' },
    { value: '招生政策', label: '招生政策' },
    { value: '专业动态', label: '专业动态' }
  ];

  useEffect(() => {
    if (id) {
      fetchDetail();
    } else {
      fetchList();
    }
  }, [id, pagination.current, category]);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await getStudyNews({
        page: pagination.current,
        limit: pagination.pageSize,
        category
      });
      if (res.success) {
        setNewsList(res.data.list);
        setPagination({ ...pagination, total: res.data.total });
      }
    } catch (error) {
      console.error('Failed to fetch study news:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await getStudyNewsDetail(id);
      if (res.success) {
        setDetail(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch detail:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  if (id && detail) {
    return (
      <div className="min-h-screen bg-slate-50">
        <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-blue-900 py-16">
          <div className="container mx-auto px-4">
            <button onClick={() => navigate('/study-news')} className="text-white/80 hover:text-white flex items-center gap-2 mb-6">
              ← 返回列表
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-white">{detail.title}</h1>
          </div>
        </section>
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-card p-8">
              <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b">
                {detail.category && <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full">{detail.category}</span>}
                <span className="text-gray-500">{detail.publish_date}</span>
              </div>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: detail.content || detail.summary }} />
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-blue-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">留学快讯</h1>
          <p className="text-blue-100">获取最新留学资讯、政策解读和申请动态</p>
        </div>
      </section>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map(cat => (
              <button key={cat.value} onClick={() => setCategory(cat.value)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${category === cat.value ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                {cat.label}
              </button>
            ))}
          </div>
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-card divide-y">
            {newsList.length === 0 ? (
              <div className="py-16 text-center text-gray-500">暂无相关快讯</div>
            ) : (
              newsList.map(item => (
                <Link key={item.id} to={`/study-news/${item.id}`} className="flex items-start gap-4 p-6 hover:bg-gray-50 transition-colors">
                  <span className="text-primary-600 font-semibold min-w-[60px]">{item.time_display}</span>
                  <div className="flex-1">
                    {item.category && <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded">{item.category}</span>}
                    <h3 className="text-gray-800 font-medium mt-1">{item.title}</h3>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default StudyNews;
