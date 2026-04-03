/**
 * 答题报告页面
 * 功能：展示得分、正确率、答题详情、解析
 */
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Target,
  TrendingUp,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Share2,
  Award,
  BarChart3,
  Flag
} from 'lucide-react';

const SUBJECT_LABELS = {
  listening: '听力',
  reading: '阅读',
  writing: '写作',
  speaking: '口语'
};

const DIFFICULTY_LABELS = {
  1: '简单',
  2: '中等',
  3: '困难'
};

function ExamReport() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnalysis, setShowAnalysis] = useState(true);

  useEffect(() => {
    fetchReport();
  }, [examId]);

  const fetchReport = async () => {
    try {
      const res = await fetch(`/api/exam/${examId}/report`);
      const result = await res.json();
      if (result.success) {
        setReport(result.data);
      }
    } catch (error) {
      console.error('获取报告失败', error);
    }
    setLoading(false);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}分${s}秒`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C5F7C]"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p>报告不存在</p>
          <Link to="/practice" className="text-[#2C5F7C] hover:underline mt-2 inline-block">
            返回刷题首页
          </Link>
        </div>
      </div>
    );
  }

  const { exam, subject_stats, tag_stats, answers } = report;
  const currentAnswer = answers[currentQuestionIndex];
  const currentQuestion = currentAnswer?.question;

  // 计算得分等级
  const getScoreLevel = (accuracy) => {
    if (accuracy >= 90) return { label: '优秀', color: 'text-green-600', bgColor: 'bg-green-50' };
    if (accuracy >= 75) return { label: '良好', color: 'text-blue-600', bgColor: 'bg-blue-50' };
    if (accuracy >= 60) return { label: '及格', color: 'text-orange-600', bgColor: 'bg-orange-50' };
    return { label: '需努力', color: 'text-red-600', bgColor: 'bg-red-50' };
  };

  const scoreLevel = getScoreLevel(exam.accuracy);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/practice" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ChevronLeft className="w-5 h-5" />
            返回
          </Link>
          <h1 className="font-bold text-lg">练习报告</h1>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg" title="分享">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 成绩概览 */}
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* 得分圆环 */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#2C5F7C"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${(exam.accuracy / 100) * 440} 440`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-[#2C5F7C]">{exam.accuracy}%</span>
                <span className="text-sm text-gray-500">正确率</span>
              </div>
            </div>

            {/* 统计信息 */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-xl ${scoreLevel.bgColor}`}>
                <div className={`text-2xl font-bold ${scoreLevel.color}`}>{scoreLevel.label}</div>
                <div className="text-sm text-gray-600">评级</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">{exam.correct_count}/{exam.total_questions}</div>
                <div className="text-sm text-gray-600">答对题数</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">{formatTime(exam.time_spent)}</div>
                <div className="text-sm text-gray-600">用时</div>
              </div>
              <div className="p-4 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600">{exam.score}</div>
                <div className="text-sm text-gray-600">得分</div>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t">
            <button
              onClick={() => navigate('/english-training/wrong-book')}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Flag className="w-4 h-4" />
              错题重练
            </button>
            <button
              onClick={() => navigate('/english-training')}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              再来一套
            </button>
            <button
              onClick={() => navigate('/english-training/leaderboard')}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              排行榜
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧 - 能力分析 */}
          <div className="space-y-6">
            {/* 科目分析 */}
            {Object.keys(subject_stats).length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#2C5F7C]" />
                  科目分析
                </h3>
                <div className="space-y-4">
                  {Object.entries(subject_stats).map(([subject, stat]) => (
                    <div key={subject}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{SUBJECT_LABELS[subject] || subject}</span>
                        <span className="text-sm text-gray-500">{stat.correct}/{stat.total} ({stat.accuracy}%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            stat.accuracy >= 80 ? 'bg-green-500' :
                            stat.accuracy >= 60 ? 'bg-blue-500' : 'bg-orange-500'
                          }`}
                          style={{ width: `${stat.accuracy}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 知识点分析 */}
            {Object.keys(tag_stats).length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-[#2C5F7C]" />
                  知识点掌握
                </h3>
                <div className="space-y-3">
                  {Object.entries(tag_stats)
                    .sort((a, b) => b[1].accuracy - a[1].accuracy)
                    .map(([tag, stat]) => (
                      <div key={tag} className="flex items-center justify-between">
                        <span className="text-sm">{tag}</span>
                        <span className={`text-sm font-medium ${
                          stat.accuracy >= 80 ? 'text-green-600' :
                          stat.accuracy >= 60 ? 'text-blue-600' : 'text-orange-600'
                        }`}>
                          {stat.accuracy}%
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* 题目列表导航 */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-lg mb-4">题目列表</h3>
              <div className="grid grid-cols-5 gap-2">
                {answers.map((ans, idx) => {
                  const isCorrect = ans.is_correct === 1;
                  const isCurrent = idx === currentQuestionIndex;

                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`relative w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                        isCurrent
                          ? 'bg-[#2C5F7C] text-white'
                          : isCorrect
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-4 mt-4 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-green-100" />
                  <span className="text-gray-600">正确</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-red-100" />
                  <span className="text-gray-600">错误</span>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧 - 题目详情 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              {currentQuestion && (
                <>
                  {/* 题目头部 */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        第 {currentQuestionIndex + 1} 题
                      </span>
                      <span className="text-sm text-gray-500">
                        {SUBJECT_LABELS[currentQuestion.subject]}
                      </span>
                      <span className="text-sm text-gray-500">
                        难度: {DIFFICULTY_LABELS[currentQuestion.difficulty]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {currentAnswer.is_correct === 1 ? (
                        <span className="flex items-center gap-1 text-green-600 font-medium">
                          <CheckCircle2 className="w-5 h-5" />
                          正确
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600 font-medium">
                          <XCircle className="w-5 h-5" />
                          错误
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 题目内容 */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 leading-relaxed mb-4">
                      {currentQuestion.title}
                    </h3>

                    {/* 选项 */}
                    {currentQuestion.options && (
                      <div className="space-y-2">
                        {currentQuestion.options.map((option) => {
                          const userAnswer = currentAnswer.user_answer || '';
                          const correctAnswer = currentQuestion.correct_answer;
                          const isSelected = userAnswer.includes(option.key);
                          const isCorrect = option.key === correctAnswer;

                          let className = 'w-full text-left p-4 rounded-xl border-2 flex items-start gap-3 ';
                          if (isCorrect) {
                            className += 'border-green-500 bg-green-50';
                          } else if (isSelected && !isCorrect) {
                            className += 'border-red-500 bg-red-50';
                          } else {
                            className += 'border-gray-200';
                          }

                          return (
                            <div key={option.key} className={className}>
                              <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-medium flex-shrink-0 ${
                                isCorrect ? 'bg-green-500 text-white' :
                                isSelected ? 'bg-red-500 text-white' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {isCorrect ? '✓' : isSelected ? '✗' : option.key}
                              </span>
                              <span className="pt-1">{option.text}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* 写作题显示 */}
                    {['essay', 'short_answer'].includes(currentQuestion.type) && (
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-xl">
                          <h4 className="font-medium text-gray-700 mb-2">你的答案</h4>
                          <p className="text-gray-600 whitespace-pre-wrap">{currentAnswer.user_answer || '未作答'}</p>
                        </div>
                        {currentQuestion.sample_answer && (
                          <div className="p-4 bg-green-50 rounded-xl">
                            <h4 className="font-medium text-green-700 mb-2">参考答案</h4>
                            <p className="text-gray-600 whitespace-pre-wrap">{currentQuestion.sample_answer}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 解析 */}
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h4 className="font-bold text-[#2C5F7C] mb-3 flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      答案解析
                    </h4>
                    <div className="space-y-3">
                      <p>
                        <span className="font-medium">正确答案：</span>
                        <span className="text-green-600 font-bold">{currentQuestion.correct_answer}</span>
                      </p>
                      {currentQuestion.answer_analysis && (
                        <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ 
                          __html: currentQuestion.answer_analysis 
                        }} />
                      )}
                    </div>
                  </div>

                  {/* 导航 */}
                  <div className="flex justify-between mt-6 pt-6 border-t">
                    <button
                      onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                      disabled={currentQuestionIndex === 0}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-gray-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      上一题
                    </button>
                    <button
                      onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                      disabled={currentQuestionIndex === answers.length - 1}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#2C5F7C] text-white hover:bg-[#1e4a61] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      下一题
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExamReport;
