/**
 * 错题本页面
 * 功能：查看错题、标记掌握、错题重练
 */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle2,
  Trash2,
  RotateCcw,
  BookOpen,
  ChevronRight,
  Filter,
  GraduationCap,
  Calendar
} from 'lucide-react';

const EXAM_TYPES = [
  { value: 'ielts', label: '雅思' },
  { value: 'toefl', label: '托福' }
];

const SUBJECTS = [
  { value: 'listening', label: '听力' },
  { value: 'reading', label: '阅读' },
  { value: 'writing', label: '写作' },
  { value: 'speaking', label: '口语' }
];

function WrongBook() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [wrongQuestions, setWrongQuestions] = useState([]);
  const [stats, setStats] = useState({ total: 0, mastered: 0 });
  const [filters, setFilters] = useState({ exam_type: '', subject: '' });
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20, total: 0 });

  useEffect(() => {
    fetchData();
    fetchStats();
  }, [filters, pagination.page]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        user_id: 0,
        page: pagination.page,
        pageSize: pagination.pageSize,
        ...filters
      });
      const res = await fetch(`/api/exam/wrong-book?${query}`);
      const result = await res.json();
      if (result.success) {
        setWrongQuestions(result.data.list);
        setPagination(prev => ({ ...prev, total: result.data.pagination.total }));
      }
    } catch (error) {
      console.error('获取错题本失败', error);
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/exam/wrong-book/stats?user_id=0');
      const result = await res.json();
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('获取统计失败', error);
    }
  };

  // 标记掌握
  const handleMaster = async (id) => {
    try {
      const res = await fetch(`/api/exam/wrong-book/${id}/master`, {
        method: 'POST'
      });
      const result = await res.json();
      if (result.success) {
        setWrongQuestions(prev => prev.filter(q => q.id !== id));
        fetchStats();
      }
    } catch (error) {
      console.error('标记掌握失败', error);
    }
  };

  // 移除错题
  const handleRemove = async (id) => {
    if (!confirm('确定从错题本移除？')) return;
    try {
      const res = await fetch(`/api/exam/wrong-book/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setWrongQuestions(prev => prev.filter(q => q.id !== id));
        fetchStats();
      }
    } catch (error) {
      console.error('移除失败', error);
    }
  };

  // 开始错题重练
  const startWrongBookPractice = () => {
    navigate(`/practice/exam?mode=wrong_book&exam_type=${filters.exam_type || 'ielts'}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-red-500 to-orange-500 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">错题本</h1>
              <p className="text-red-100">温故知新，针对性突破薄弱环节</p>
            </div>
            <div className="mt-6 md:mt-0 flex gap-4">
              <div className="bg-white/20 backdrop-blur rounded-xl px-6 py-4 text-center">
                <div className="text-3xl font-bold">{stats.total}</div>
                <div className="text-sm text-red-100">待复习</div>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-xl px-6 py-4 text-center">
                <div className="text-3xl font-bold">{stats.mastered}</div>
                <div className="text-sm text-red-100">已掌握</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 操作栏 */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">筛选:</span>
              </div>
              <select
                value={filters.exam_type}
                onChange={(e) => setFilters(prev => ({ ...prev, exam_type: e.target.value }))}
                className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#2C5F7C]"
              >
                <option value="">全部类型</option>
                {EXAM_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <select
                value={filters.subject}
                onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
                className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#2C5F7C]"
              >
                <option value="">全部科目</option>
                {SUBJECTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            <button
              onClick={startWrongBookPractice}
              disabled={wrongQuestions.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              错题重练
            </button>
          </div>
        </div>

        {/* 错题列表 */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C5F7C]"></div>
          </div>
        ) : wrongQuestions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">太棒了！</h3>
            <p className="text-gray-500 mb-6">你的错题本为空，继续保持！</p>
            <Link
              to="/practice"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#2C5F7C] text-white rounded-xl hover:bg-[#1e4a61] transition-colors"
            >
              去刷题
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {wrongQuestions.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs font-medium">
                        错{item.wrong_count}次
                      </span>
                      <span className="text-sm text-gray-500">
                        {EXAM_TYPES.find(t => t.value === item.question.exam_type)?.label}
                      </span>
                      <span className="text-sm text-gray-500">
                        {SUBJECTS.find(s => s.value === item.question.subject)?.label}
                      </span>
                      <span className="text-sm text-gray-400">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {new Date(item.last_wrong_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                      {item.question.title?.replace(/<[^>]+>/g, '')}
                    </h3>

                    {item.question.options && (
                      <div className="text-sm text-gray-500 mb-3">
                        选项: {item.question.options.map(o => o.key).join(', ')}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleMaster(item.id)}
                      className="flex items-center gap-1 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      已掌握
                    </button>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="flex items-center gap-1 px-4 py-2 text-gray-400 hover:text-red-500 transition-colors text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      移除
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* 分页 */}
            {pagination.total > pagination.pageSize && (
              <div className="flex justify-center gap-2 mt-6">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50"
                >
                  上一页
                </button>
                <span className="px-4 py-2">
                  {pagination.page} / {Math.ceil(pagination.total / pagination.pageSize)}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50"
                >
                  下一页
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default WrongBook;
