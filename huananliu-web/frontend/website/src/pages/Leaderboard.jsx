/**
 * 排行榜页面
 * 功能：展示模考成绩排名、个人排名
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Medal,
  Clock,
  Target,
  TrendingUp,
  User,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Crown
} from 'lucide-react';

const EXAM_TYPES = [
  { value: 'ielts', label: '雅思', color: 'blue' },
  { value: 'toefl', label: '托福', color: 'green' }
];

const PERIODS = [
  { value: 'all', label: '总榜' },
  { value: 'monthly', label: '月榜' },
  { value: 'weekly', label: '周榜' }
];

function Leaderboard() {
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats] = useState({});
  const [userRank, setUserRank] = useState(null);
  const [filters, setFilters] = useState({
    exam_type: 'ielts',
    period: 'all'
  });
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20, total: 0 });

  useEffect(() => {
    fetchLeaderboard();
    fetchStats();
    fetchUserRank();
  }, [filters, pagination.page]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        ...filters,
        page: pagination.page,
        pageSize: pagination.pageSize
      });
      const res = await fetch(`/api/leaderboard?${query}`);
      const result = await res.json();
      if (result.success) {
        setLeaderboard(result.data.list);
        setPagination(prev => ({ ...prev, total: result.data.pagination.total }));
      }
    } catch (error) {
      console.error('获取排行榜失败', error);
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`/api/leaderboard/stats/overview?exam_type=${filters.exam_type}`);
      const result = await res.json();
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('获取统计失败', error);
    }
  };

  const fetchUserRank = async () => {
    try {
      const res = await fetch(`/api/leaderboard/user/0?exam_type=${filters.exam_type}`);
      const result = await res.json();
      if (result.success) {
        setUserRank(result.data);
      }
    } catch (error) {
      console.error('获取用户排名失败', error);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="w-6 text-center font-bold text-gray-500">{rank}</span>;
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}分${s}秒`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-yellow-500 to-amber-500 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                <Trophy className="w-10 h-10" />
                排行榜
              </h1>
              <p className="text-amber-100">与全国考生一较高下</p>
            </div>
            <div className="mt-6 md:mt-0 flex gap-4">
              <div className="bg-white/20 backdrop-blur rounded-xl px-6 py-4 text-center">
                <div className="text-3xl font-bold">{stats.total_participants || 0}</div>
                <div className="text-sm text-amber-100">参与人数</div>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-xl px-6 py-4 text-center">
                <div className="text-3xl font-bold">{stats.highest_score || 0}</div>
                <div className="text-sm text-amber-100">最高分</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 个人排名卡片 */}
        {userRank && userRank.has_record && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2C5F7C] to-[#3A7CA5] flex items-center justify-center text-white font-bold text-xl">
                  {userRank.rank}
                </div>
                <div>
                  <div className="text-sm text-gray-500">我的排名</div>
                  <div className="text-2xl font-bold text-gray-900">
                    前 {userRank.top_percent}%
                  </div>
                  <div className="text-sm text-gray-500">
                    共参加 {userRank.total_exams} 次模考
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">最佳成绩</div>
                <div className="text-3xl font-bold text-[#2C5F7C]">
                  {userRank.best_score}分
                </div>
                <div className="text-sm text-gray-500">
                  正确率 {userRank.best_accuracy}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 筛选 */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">考试类型:</span>
              <div className="flex gap-2">
                {EXAM_TYPES.map(type => (
                  <button
                    key={type.value}
                    onClick={() => setFilters(prev => ({ ...prev, exam_type: type.value }))}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filters.exam_type === type.value
                        ? `bg-${type.color}-500 text-white`
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-6 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">时间:</span>
              <div className="flex gap-2">
                {PERIODS.map(period => (
                  <button
                    key={period.value}
                    onClick={() => setFilters(prev => ({ ...prev, period: period.value }))}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filters.period === period.value
                        ? 'bg-[#2C5F7C] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 排行榜 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">排名</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">用户</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">得分</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">正确率</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">用时</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">考试时间</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C5F7C] mx-auto"></div>
                    </td>
                  </tr>
                ) : leaderboard.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      暂无数据
                    </td>
                  </tr>
                ) : (
                  leaderboard.map((item) => (
                    <tr
                      key={item.exam_id}
                      className={item.user.id === 0 ? 'bg-blue-50' : 'hover:bg-gray-50'}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center w-10">
                          {getRankIcon(item.rank)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {item.user.avatar ? (
                            <img
                              src={item.user.avatar}
                              alt={item.user.nickname}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2C5F7C] to-[#3A7CA5] flex items-center justify-center text-white font-medium">
                              {item.user.nickname.charAt(0)}
                            </div>
                          )}
                          <span className="font-medium">
                            {item.user.id === 0 ? '我' : item.user.nickname}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-2xl font-bold text-[#2C5F7C]">{item.score}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Target className="w-4 h-4 text-green-500" />
                          <span>{item.accuracy}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{formatTime(item.time_spent)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 分页 */}
          {!loading && leaderboard.length > 0 && (
            <div className="px-6 py-4 border-t flex items-center justify-between">
              <span className="text-sm text-gray-500">
                共 {pagination.total} 人
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="px-4 py-2">
                  {pagination.page} / {Math.ceil(pagination.total / pagination.pageSize)}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
                  className="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 提示 */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>排行榜每小时更新一次，只显示模考模式的成绩</p>
          <Link to="/practice" className="text-[#2C5F7C] hover:underline mt-2 inline-block">
            去刷题提升排名 →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
