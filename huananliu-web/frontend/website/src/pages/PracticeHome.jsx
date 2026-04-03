/**
 * 雅思/托福刷题首页
 * 功能：选择练习模式、查看学习统计、进入错题本
 */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Clock,
  Trophy,
  Target,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  GraduationCap,
  Headphones,
  PenTool,
  MessageCircle,
  BarChart3,
  RotateCcw,
  Shuffle
} from 'lucide-react';

const EXAM_TYPES = [
  { value: 'ielts', label: '雅思', color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50' },
  { value: 'toefl', label: '托福', color: 'from-green-500 to-green-600', bgColor: 'bg-green-50' }
];

const SUBJECTS = [
  { value: 'listening', label: '听力', icon: Headphones, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  { value: 'reading', label: '阅读', icon: BookOpen, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { value: 'writing', label: '写作', icon: PenTool, color: 'text-orange-600', bgColor: 'bg-orange-50' },
  { value: 'speaking', label: '口语', icon: MessageCircle, color: 'text-pink-600', bgColor: 'bg-pink-50' }
];

const PRACTICE_MODES = [
  {
    key: 'practice',
    title: '专项练习',
    desc: '按科目分类针对性练习',
    icon: Target,
    color: 'from-blue-500 to-blue-600'
  },
  {
    key: 'exam',
    title: '模拟考试',
    desc: '全真模考，检验水平',
    icon: Clock,
    color: 'from-purple-500 to-purple-600'
  },
  {
    key: 'wrong_book',
    title: '错题重练',
    desc: '针对性攻克薄弱点',
    icon: AlertCircle,
    color: 'from-red-500 to-red-600'
  },
  {
    key: 'random',
    title: '随机练习',
    desc: '随机抽题，巩固知识',
    icon: Shuffle,
    color: 'from-green-500 to-green-600'
  }
];

function PracticeHome() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_exams: 0,
    total_answers: 0,
    accuracy: 0,
    wrong_count: 0,
    today_exams: 0,
    recent_study_days: 0
  });
  const [selectedExam, setSelectedExam] = useState('ielts');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/exam/stats/overview?user_id=0');
      const result = await res.json();
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('获取统计失败', error);
    }
    setLoading(false);
  };

  // 开始练习
  const startPractice = (mode, subject = null) => {
    const params = new URLSearchParams({
      mode,
      exam_type: selectedExam,
      ...(subject && { subject })
    });
    navigate(`/english-training/exam?${params}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#2C5F7C] to-[#3A7CA5] text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                雅思/托福在线刷题
              </h1>
              <p className="text-xl text-blue-100 mb-6">
                海量真题 + 智能分析 + 错题本，助你高效备考
              </p>
              <div className="flex gap-4">
                {EXAM_TYPES.map(type => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedExam(type.value)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      selectedExam === type.value
                        ? 'bg-white text-[#2C5F7C] shadow-lg'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* 学习数据卡片 */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 min-w-[300px]">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                学习数据
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">{stats.total_exams}</div>
                  <div className="text-sm text-blue-100">总练习次数</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{stats.accuracy}%</div>
                  <div className="text-sm text-blue-100">平均正确率</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{stats.total_answers}</div>
                  <div className="text-sm text-blue-100">答题总数</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{stats.recent_study_days}</div>
                  <div className="text-sm text-blue-100">连续学习(天)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 练习模式 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-[#2C5F7C]" />
            选择练习模式
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRACTICE_MODES.map(mode => (
              <div
                key={mode.key}
                onClick={() => startPractice(mode.key)}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${mode.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <mode.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{mode.title}</h3>
                <p className="text-gray-500 text-sm">{mode.desc}</p>
                <div className="mt-4 flex items-center text-[#2C5F7C] font-medium group-hover:gap-2 transition-all">
                  开始练习 <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 专项练习 - 按科目 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-[#2C5F7C]" />
            专项练习
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SUBJECTS.map(subject => (
              <div
                key={subject.value}
                onClick={() => startPractice('practice', subject.value)}
                className={`${subject.bgColor} rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-all group`}
              >
                <div className={`w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <subject.icon className={`w-6 h-6 ${subject.color}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{subject.label}</h3>
                <p className="text-gray-500 text-sm mt-1">针对性训练</p>
              </div>
            ))}
          </div>
        </section>

        {/* 快捷入口 */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/english-training/wrong-book"
            className="bg-red-50 rounded-2xl p-6 hover:shadow-lg transition-all flex items-center gap-4"
          >
            <div className="w-14 h-14 rounded-xl bg-red-500 flex items-center justify-center">
              <AlertCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">错题本</h3>
              <p className="text-gray-500 text-sm">{stats.wrong_count} 道错题待复习</p>
            </div>
          </Link>

          <Link
            to="/english-training/leaderboard"
            className="bg-blue-50 rounded-2xl p-6 hover:shadow-lg transition-all flex items-center gap-4"
          >
            <div className="w-14 h-14 rounded-xl bg-blue-500 flex items-center justify-center">
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">排行榜</h3>
              <p className="text-gray-500 text-sm">查看学习排名</p>
            </div>
          </Link>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">今日目标</h3>
              <p className="text-gray-500 text-sm">已完成 {stats.today_exams} 次练习</p>
            </div>
          </div>
        </section>

        {/* 备考建议 */}
        <section className="mt-12 bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">备考建议</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">听力练习</h4>
                <p className="text-gray-500 text-sm mt-1">
                  每天坚持听1-2套真题，注意同义替换和关键词抓取。推荐在安静环境下练习。
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">阅读技巧</h4>
                <p className="text-gray-500 text-sm mt-1">
                  先读题目再读文章，掌握略读和寻读技巧。注意段落主旨和细节理解。
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                <PenTool className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">写作提升</h4>
                <p className="text-gray-500 text-sm mt-1">
                  积累高频话题词汇和句型，每周至少练习2篇，注意结构和逻辑。
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">口语准备</h4>
                <p className="text-gray-500 text-sm mt-1">
                  多练习 Part 2 的流利度，准备常见话题素材。可以录音自查。
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default PracticeHome;
