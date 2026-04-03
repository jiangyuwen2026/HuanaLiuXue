/**
 * 在线做题界面
 * 功能：答题、计时、题目导航、提交答案
 */
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  MoreHorizontal,
  AlertCircle,
  CheckCircle2,
  Circle,
  Headphones,
  Send,
  Timer
} from 'lucide-react';

function PracticeExam() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get('mode') || 'practice';
  const examType = searchParams.get('exam_type') || 'ielts';
  const subject = searchParams.get('subject');

  const [loading, setLoading] = useState(true);
  const [examId, setExamId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { question_id: { answer, time_spent } }
  const [markedQuestions, setMarkedQuestions] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  // 开始考试
  useEffect(() => {
    startExam();
  }, []);

  // 计时器
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const startExam = async () => {
    try {
      const body = {
        mode,
        exam_type: examType,
        ...(subject && { subject }),
        question_count: mode === 'exam' ? 40 : 20,
        user_id: 0
      };

      const res = await fetch('/api/exam/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const result = await res.json();
      if (result.success) {
        setExamId(result.data.exam_id);
        setQuestions(result.data.questions);
        setTimeLeft(result.data.time_limit || 0);
        setStartTime(Date.now());
        setQuestionStartTime(Date.now());
      }
    } catch (error) {
      console.error('开始考试失败', error);
    }
    setLoading(false);
  };

  // 格式化时间
  const formatTime = (seconds) => {
    if (!seconds) return '--:--';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // 选择答案
  const selectAnswer = (answer) => {
    const currentQuestion = questions[currentIndex];
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: {
        question_id: currentQuestion.id,
        user_answer: answer,
        time_spent: (prev[currentQuestion.id]?.time_spent || 0) + timeSpent
      }
    }));

    // 如果是单选题，自动下一题
    if (currentQuestion.type === 'single_choice') {
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          goToQuestion(currentIndex + 1);
        }
      }, 300);
    }
  };

  // 多选题处理
  const toggleMultipleAnswer = (option) => {
    const currentQuestion = questions[currentIndex];
    const currentAnswer = answers[currentQuestion.id]?.user_answer || '';
    const currentArr = currentAnswer ? currentAnswer.split(',') : [];
    
    let newAnswer;
    if (currentArr.includes(option)) {
      newAnswer = currentArr.filter(a => a !== option).join(',');
    } else {
      newAnswer = [...currentArr, option].sort().join(',');
    }

    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: {
        question_id: currentQuestion.id,
        user_answer: newAnswer,
        time_spent: prev[currentQuestion.id]?.time_spent || 0
      }
    }));
  };

  // 跳转到指定题目
  const goToQuestion = (index) => {
    // 记录当前题目用时
    const currentQuestion = questions[currentIndex];
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        question_id: currentQuestion.id,
        time_spent: (prev[currentQuestion.id]?.time_spent || 0) + timeSpent
      }
    }));

    setCurrentIndex(index);
    setQuestionStartTime(Date.now());
  };

  // 标记题目
  const toggleMark = () => {
    const currentQuestion = questions[currentIndex];
    setMarkedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion.id)) {
        newSet.delete(currentQuestion.id);
      } else {
        newSet.add(currentQuestion.id);
      }
      return newSet;
    });
  };

  // 提交答案
  const handleSubmit = async () => {
    if (!examId) return;

    // 最后一次更新用时
    const currentQuestion = questions[currentIndex];
    const finalTimeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    const finalAnswers = {
      ...answers,
      [currentQuestion.id]: {
        ...answers[currentQuestion.id],
        question_id: currentQuestion.id,
        time_spent: (answers[currentQuestion.id]?.time_spent || 0) + finalTimeSpent
      }
    };

    try {
      const res = await fetch(`/api/exam/${examId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 0,
          answers: Object.values(finalAnswers)
        })
      });

      const result = await res.json();
      if (result.success) {
        navigate(`/practice/report/${examId}`);
      }
    } catch (error) {
      console.error('提交失败', error);
      alert('提交失败，请重试');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C5F7C] mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载题目...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">暂无符合条件的题目</p>
          <button
            onClick={() => navigate('/practice')}
            className="mt-4 px-6 py-2 bg-[#2C5F7C] text-white rounded-lg"
          >
            返回刷题首页
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentQuestion.id]?.user_answer || '';
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/practice')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-bold text-lg">在线练习</h1>
              <p className="text-sm text-gray-500">
                {examType === 'ielts' ? '雅思' : '托福'}
                {subject && ` · ${subject === 'listening' ? '听力' : subject === 'reading' ? '阅读' : subject === 'writing' ? '写作' : '口语'}`}
              </p>
            </div>
          </div>

          {/* 计时器 */}
          {timeLeft > 0 && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              timeLeft < 300 ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
            }`}>
              <Clock className="w-5 h-5" />
              <span className="font-mono font-bold text-xl">{formatTime(timeLeft)}</span>
            </div>
          )}

          {/* 进度 */}
          <div className="text-right">
            <div className="text-sm text-gray-500">
              已答 {answeredCount}/{questions.length} 题
            </div>
            <div className="w-32 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-[#2C5F7C] transition-all"
                style={{ width: `${(answeredCount / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 题目区域 */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              {/* 题目信息 */}
              <div className="flex items-center justify-between mb-6">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  第 {currentIndex + 1} / {questions.length} 题
                </span>
                <button
                  onClick={toggleMark}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
                    markedQuestions.has(currentQuestion.id)
                      ? 'bg-orange-100 text-orange-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-orange-50'
                  }`}
                >
                  <Flag className="w-4 h-4" />
                  {markedQuestions.has(currentQuestion.id) ? '已标记' : '标记'}
                </button>
              </div>

              {/* 听力音频 */}
              {currentQuestion.audio_url && (
                <div className="mb-6 p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Headphones className="w-6 h-6 text-blue-600" />
                    <span className="font-medium">听力音频</span>
                    <audio
                      src={currentQuestion.audio_url}
                      controls
                      className="flex-1"
                      onPlay={() => setAudioPlaying(true)}
                      onPause={() => setAudioPlaying(false)}
                    />
                  </div>
                </div>
              )}

              {/* 阅读材料 */}
              {currentQuestion.passage && (
                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-medium text-gray-700 mb-2">阅读材料</h4>
                  <div className="text-gray-600 text-sm leading-relaxed max-h-60 overflow-y-auto">
                    {currentQuestion.passage}
                  </div>
                </div>
              )}

              {/* 题目内容 */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 leading-relaxed">
                  {currentQuestion.title}
                </h3>
                {currentQuestion.content && (
                  <div className="mt-4 text-gray-700" dangerouslySetInnerHTML={{ __html: currentQuestion.content }} />
                )}
              </div>

              {/* 选项 */}
              <div className="space-y-3">
                {currentQuestion.options?.map((option) => {
                  const isSelected = currentAnswer.includes(option.key);
                  const isMultiple = currentQuestion.type === 'multiple_choice';

                  return (
                    <button
                      key={option.key}
                      onClick={() => isMultiple ? toggleMultipleAnswer(option.key) : selectAnswer(option.key)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'border-[#2C5F7C] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-medium flex-shrink-0 ${
                        isSelected
                          ? 'bg-[#2C5F7C] text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {isMultiple ? (isSelected ? '✓' : option.key) : option.key}
                      </span>
                      <span className="pt-1">{option.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* 写作题输入框 */}
              {['essay', 'short_answer'].includes(currentQuestion.type) && (
                <div className="mt-6">
                  <textarea
                    value={currentAnswer}
                    onChange={(e) => selectAnswer(e.target.value)}
                    placeholder="请输入你的答案..."
                    className="w-full h-64 p-4 border-2 border-gray-200 rounded-xl focus:border-[#2C5F7C] focus:outline-none resize-none"
                  />
                </div>
              )}

              {/* 导航按钮 */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <button
                  onClick={() => goToQuestion(currentIndex - 1)}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  上一题
                </button>

                {currentIndex < questions.length - 1 ? (
                  <button
                    onClick={() => goToQuestion(currentIndex + 1)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2C5F7C] text-white hover:bg-[#1e4a61] transition-colors"
                  >
                    下一题
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowSubmitConfirm(true)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                    提交答案
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 侧边栏 - 题目导航 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-4 sticky top-24">
              <h3 className="font-bold mb-4">题目导航</h3>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, idx) => {
                  const isAnswered = !!answers[q.id]?.user_answer;
                  const isMarked = markedQuestions.has(q.id);
                  const isCurrent = idx === currentIndex;

                  return (
                    <button
                      key={q.id}
                      onClick={() => goToQuestion(idx)}
                      className={`relative w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                        isCurrent
                          ? 'bg-[#2C5F7C] text-white'
                          : isAnswered
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {idx + 1}
                      {isMarked && !isCurrent && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-100" />
                  <span className="text-gray-600">已作答</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-100" />
                  <span className="text-gray-600">未作答</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#2C5F7C]" />
                  <span className="text-gray-600">当前题</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-100 relative">
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full" />
                  </div>
                  <span className="text-gray-600">已标记</span>
                </div>
              </div>

              <button
                onClick={() => setShowSubmitConfirm(true)}
                className="w-full mt-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
              >
                提交答案
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 提交确认弹窗 */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">确认提交？</h3>
            <div className="space-y-2 mb-6">
              <p className="text-gray-600">
                总题数: <span className="font-bold">{questions.length}</span>
              </p>
              <p className="text-gray-600">
                已作答: <span className="font-bold text-green-600">{answeredCount}</span>
              </p>
              <p className="text-gray-600">
                未作答: <span className="font-bold text-orange-600">{questions.length - answeredCount}</span>
              </p>
              {questions.length - answeredCount > 0 && (
                <p className="text-orange-600 text-sm">
                  还有 {questions.length - answeredCount} 道题未作答，提交后无法修改。
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
              >
                继续答题
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
              >
                确认提交
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PracticeExam;
