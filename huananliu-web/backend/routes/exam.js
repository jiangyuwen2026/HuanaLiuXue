/**
 * ============================================================================
 * 练习/考试系统 API 路由
 * ============================================================================
 * 功能：在线刷题、模考、错题本、答题报告
 * 路径: /api/exam
 * ============================================================================
 */

const express = require('express');
const router = express.Router();
const { Op, Sequelize } = require('sequelize');
const {
  Question,
  QuestionCategory,
  QuestionTag,
  User,
  UserExam,
  UserAnswer,
  UserWrongQuestion,
  ExamPaper
} = require('../models');

// ============================================================================
// 辅助函数
// ============================================================================

/**
 * 自动判分
 * @param {string} userAnswer 用户答案
 * @param {string} correctAnswer 正确答案
 * @param {string} type 题型
 * @returns {object} { isCorrect: boolean, score: number }
 */
function autoJudge(userAnswer, correctAnswer, type) {
  if (!userAnswer) return { isCorrect: 0, score: 0 };
  
  // 客观题自动判分
  const objectiveTypes = ['single_choice', 'true_false_not_given', 'fill_blank'];
  
  if (objectiveTypes.includes(type)) {
    const normalizedUser = userAnswer.toString().trim().toUpperCase();
    const normalizedCorrect = correctAnswer.toString().trim().toUpperCase();
    const isCorrect = normalizedUser === normalizedCorrect;
    return { isCorrect: isCorrect ? 1 : 0, score: isCorrect ? 1 : 0 };
  }
  
  // 多选题
  if (type === 'multiple_choice') {
    const userArr = userAnswer.toString().split('').sort();
    const correctArr = correctAnswer.toString().split('').sort();
    const isCorrect = JSON.stringify(userArr) === JSON.stringify(correctArr);
    return { isCorrect: isCorrect ? 1 : 0, score: isCorrect ? 1 : 0 };
  }
  
  // 主观题需要人工批改
  return { isCorrect: 3, score: 0 }; // 3 = 待批改
}

/**
 * 更新错题本
 */
async function updateWrongBook(userId, questionId, isCorrect) {
  if (isCorrect === 1) return; // 答对了不记录
  
  const [record, created] = await UserWrongQuestion.findOrCreate({
    where: { user_id: userId, question_id: questionId },
    defaults: {
      wrong_count: 1,
      last_wrong_at: new Date(),
      is_mastered: 0
    }
  });
  
  if (!created) {
    await record.update({
      wrong_count: record.wrong_count + 1,
      last_wrong_at: new Date()
    });
  }
}

// ============================================================================
// 练习模式 API
// ============================================================================

/**
 * POST /api/exam/start
 * 开始练习/考试
 * Body: { mode, exam_type, subject, category_id, tag_id, question_count, paper_id, user_id }
 */
router.post('/start', async (req, res) => {
  try {
    const {
      mode = 'practice',
      exam_type,
      subject,
      category_id,
      tag_id,
      question_count = 20,
      paper_id,
      user_id = 0  // 临时使用，后续从 JWT 获取
    } = req.body;

    let questions = [];
    let title = '';
    let examType = exam_type;
    let subj = subject;

    // 模考模式
    if (mode === 'exam' && paper_id) {
      const paper = await ExamPaper.findByPk(paper_id, {
        include: [{
          model: Question,
          as: 'questions',
          through: { attributes: [] },
          where: { status: 1 }
        }]
      });
      
      if (!paper) {
        return res.status(404).json({ success: false, message: '试卷不存在' });
      }
      
      questions = paper.questions;
      title = paper.title;
      examType = paper.exam_type;
      subj = paper.subject;
    }
    // 错题重练模式
    else if (mode === 'wrong_book') {
      const wrongRecords = await UserWrongQuestion.findAll({
        where: { user_id: userId, is_mastered: 0 },
        include: [{
          model: Question,
          as: 'question',
          where: { status: 1 }
        }],
        limit: parseInt(question_count),
        order: [['last_wrong_at', 'DESC']]
      });
      
      questions = wrongRecords.map(r => r.question);
      title = '错题重练';
    }
    // 普通练习模式
    else {
      const where = { status: 1 };
      if (exam_type) where.exam_type = exam_type;
      if (subject) where.subject = subject;
      if (category_id) where.category_id = category_id;

      const queryOptions = {
        where,
        limit: parseInt(question_count),
        order: mode === 'random' ? Sequelize.literal('RAND()') : [['id', 'DESC']],
        include: [
          { model: QuestionCategory, as: 'category', attributes: ['id', 'name'] }
        ]
      };

      // 按标签筛选
      if (tag_id) {
        queryOptions.include.push({
          model: QuestionTag,
          as: 'tags',
          where: { id: tag_id },
          through: { attributes: [] }
        });
      }

      questions = await Question.findAll(queryOptions);
      
      // 生成标题
      const modeLabels = {
        practice: '专项练习',
        random: '随机练习',
        tag_practice: '知识点练习'
      };
      title = modeLabels[mode] || '练习';
      if (subject) {
        const subjectLabels = { listening: '听力', reading: '阅读', writing: '写作', speaking: '口语' };
        title += ` - ${subjectLabels[subject] || subject}`;
      }
    }

    if (questions.length === 0) {
      return res.status(400).json({ success: false, message: '未找到符合条件的题目' });
    }

    // 创建考试记录
    const exam = await UserExam.create({
      user_id: user_id,
      paper_id: paper_id || 0,
      exam_type: examType,
      subject: subj,
      mode,
      title,
      total_questions: questions.length,
      status: 0, // 进行中
      started_at: new Date()
    });

    // 返回题目（隐藏答案）
    const practiceQuestions = questions.map(q => {
      const json = q.toJSON();
      delete json.correct_answer;
      delete json.answer_analysis;
      return json;
    });

    res.json({
      success: true,
      data: {
        exam_id: exam.id,
        title: exam.title,
        mode: exam.mode,
        total_questions: exam.total_questions,
        time_limit: mode === 'exam' ? 10800 : 0, // 模考默认3小时
        questions: practiceQuestions
      }
    });
  } catch (error) {
    console.error('开始练习失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/exam/:id/submit
 * 提交答案
 * Body: { answers: [{ question_id, user_answer, time_spent }] }
 */
router.post('/:id/submit', async (req, res) => {
  try {
    const examId = req.params.id;
    const { answers, user_id = 0 } = req.body;

    const exam = await UserExam.findByPk(examId);
    if (!exam) {
      return res.status(404).json({ success: false, message: '考试记录不存在' });
    }

    if (exam.status === 1) {
      return res.status(400).json({ success: false, message: '该考试已提交' });
    }

    let correctCount = 0;
    let totalScore = 0;
    let answeredCount = 0;

    // 处理每道题的答案
    for (const answer of answers) {
      const { question_id, user_answer, time_spent = 0 } = answer;
      
      if (!user_answer) continue;
      answeredCount++;

      const question = await Question.findByPk(question_id);
      if (!question) continue;

      // 自动判分
      const judgeResult = autoJudge(user_answer, question.correct_answer, question.type);
      
      // 保存答题记录
      await UserAnswer.create({
        exam_id: examId,
        user_id,
        question_id,
        user_answer,
        is_correct: judgeResult.isCorrect,
        score: judgeResult.score,
        time_spent,
        answer_analysis: question.answer_analysis
      });

      // 更新统计
      if (judgeResult.isCorrect === 1) {
        correctCount++;
        totalScore += judgeResult.score;
      }

      // 更新错题本
      await updateWrongBook(user_id, question_id, judgeResult.isCorrect);
    }

    // 更新考试记录
    const timeSpent = Math.floor((Date.now() - new Date(exam.started_at).getTime()) / 1000);
    await exam.update({
      answered_questions: answeredCount,
      correct_count: correctCount,
      user_score: totalScore,
      time_spent: timeSpent,
      status: 1,
      submitted_at: new Date()
    });

    res.json({
      success: true,
      data: {
        exam_id: exam.id,
        total_questions: exam.total_questions,
        answered_questions: answeredCount,
        correct_count: correctCount,
        score: totalScore,
        accuracy: exam.total_questions > 0 
          ? Math.round((correctCount / exam.total_questions) * 100) 
          : 0,
        time_spent: timeSpent
      }
    });
  } catch (error) {
    console.error('提交答案失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/exam/:id/report
 * 获取考试报告
 */
router.get('/:id/report', async (req, res) => {
  try {
    const exam = await UserExam.findByPk(req.params.id, {
      include: [
        {
          model: UserAnswer,
          as: 'answers',
          include: [{
            model: Question,
            as: 'question',
            include: [
              { model: QuestionCategory, as: 'category', attributes: ['id', 'name'] },
              { model: QuestionTag, as: 'tags', through: { attributes: [] } }
            ]
          }]
        }
      ]
    });

    if (!exam) {
      return res.status(404).json({ success: false, message: '考试记录不存在' });
    }

    // 统计各科目正确率
    const subjectStats = {};
    const tagStats = {};
    
    exam.answers.forEach(answer => {
      const q = answer.question;
      if (!q) return;

      // 科目统计
      if (!subjectStats[q.subject]) {
        subjectStats[q.subject] = { total: 0, correct: 0 };
      }
      subjectStats[q.subject].total++;
      if (answer.is_correct === 1) {
        subjectStats[q.subject].correct++;
      }

      // 标签统计
      if (q.tags) {
        q.tags.forEach(tag => {
          if (!tagStats[tag.name]) {
            tagStats[tag.name] = { total: 0, correct: 0 };
          }
          tagStats[tag.name].total++;
          if (answer.is_correct === 1) {
            tagStats[tag.name].correct++;
          }
        });
      }
    });

    // 计算百分比
    Object.keys(subjectStats).forEach(key => {
      const stat = subjectStats[key];
      stat.accuracy = Math.round((stat.correct / stat.total) * 100);
    });

    Object.keys(tagStats).forEach(key => {
      const stat = tagStats[key];
      stat.accuracy = Math.round((stat.correct / stat.total) * 100);
    });

    res.json({
      success: true,
      data: {
        exam: {
          id: exam.id,
          title: exam.title,
          mode: exam.mode,
          total_questions: exam.total_questions,
          answered_questions: exam.answered_questions,
          correct_count: exam.correct_count,
          score: exam.user_score,
          accuracy: exam.total_questions > 0 
            ? Math.round((exam.correct_count / exam.total_questions) * 100) 
            : 0,
          time_spent: exam.time_spent,
          started_at: exam.started_at,
          submitted_at: exam.submitted_at
        },
        subject_stats: subjectStats,
        tag_stats: tagStats,
        answers: exam.answers
      }
    });
  } catch (error) {
    console.error('获取报告失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================================
// 错题本 API
// ============================================================================

/**
 * GET /api/exam/wrong-book
 * 获取错题本
 * Query: { user_id, exam_type, subject, page, pageSize }
 */
router.get('/wrong-book', async (req, res) => {
  try {
    const {
      user_id = 0,
      exam_type,
      subject,
      page = 1,
      pageSize = 20
    } = req.query;

    const where = { user_id, is_mastered: 0 };
    
    const include = [{
      model: Question,
      as: 'question',
      where: { status: 1 },
      include: [
        { model: QuestionCategory, as: 'category', attributes: ['id', 'name'] },
        { model: QuestionTag, as: 'tags', through: { attributes: [] } }
      ]
    }];

    if (exam_type) {
      include[0].where.exam_type = exam_type;
    }
    if (subject) {
      include[0].where.subject = subject;
    }

    const offset = (parseInt(page) - 1) * parseInt(pageSize);
    const limit = parseInt(pageSize);

    const { count, rows } = await UserWrongQuestion.findAndCountAll({
      where,
      include,
      order: [['last_wrong_at', 'DESC']],
      offset,
      limit,
      distinct: true
    });

    // 格式化返回数据
    const list = rows.map(record => ({
      id: record.id,
      wrong_count: record.wrong_count,
      last_wrong_at: record.last_wrong_at,
      question: record.question
    }));

    res.json({
      success: true,
      data: {
        list,
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          total: count,
          totalPages: Math.ceil(count / parseInt(pageSize))
        }
      }
    });
  } catch (error) {
    console.error('获取错题本失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/exam/wrong-book/:id/master
 * 标记错题已掌握
 */
router.post('/wrong-book/:id/master', async (req, res) => {
  try {
    const record = await UserWrongQuestion.findByPk(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: '记录不存在' });
    }

    await record.update({
      is_mastered: 1,
      mastered_at: new Date()
    });

    res.json({ success: true, message: '标记成功' });
  } catch (error) {
    console.error('标记掌握失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * DELETE /api/exam/wrong-book/:id
 * 从错题本移除
 */
router.delete('/wrong-book/:id', async (req, res) => {
  try {
    const record = await UserWrongQuestion.findByPk(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: '记录不存在' });
    }

    await record.destroy();
    res.json({ success: true, message: '移除成功' });
  } catch (error) {
    console.error('移除错题失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/exam/wrong-book/stats
 * 错题本统计
 */
router.get('/wrong-book/stats', async (req, res) => {
  try {
    const { user_id = 0 } = req.query;

    const total = await UserWrongQuestion.count({
      where: { user_id, is_mastered: 0 }
    });

    const mastered = await UserWrongQuestion.count({
      where: { user_id, is_mastered: 1 }
    });

    // 按科目统计
    const subjectStats = await UserWrongQuestion.findAll({
      where: { user_id, is_mastered: 0 },
      include: [{
        model: Question,
        as: 'question',
        attributes: ['subject']
      }],
      attributes: [
        [Sequelize.col('question.subject'), 'subject'],
        [Sequelize.fn('COUNT', '*'), 'count']
      ],
      group: ['question.subject'],
      raw: true
    });

    res.json({
      success: true,
      data: {
        total,
        mastered,
        pending: total,
        subject_stats: subjectStats
      }
    });
  } catch (error) {
    console.error('获取错题统计失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================================
// 学习记录 API
// ============================================================================

/**
 * GET /api/exam/history
 * 获取用户练习历史
 * Query: { user_id, mode, exam_type, page, pageSize }
 */
router.get('/history', async (req, res) => {
  try {
    const {
      user_id = 0,
      mode,
      exam_type,
      page = 1,
      pageSize = 20
    } = req.query;

    const where = { user_id };
    if (mode) where.mode = mode;
    if (exam_type) where.exam_type = exam_type;

    const offset = (parseInt(page) - 1) * parseInt(pageSize);
    const limit = parseInt(pageSize);

    const { count, rows } = await UserExam.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      offset,
      limit
    });

    res.json({
      success: true,
      data: {
        list: rows,
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          total: count,
          totalPages: Math.ceil(count / parseInt(pageSize))
        }
      }
    });
  } catch (error) {
    console.error('获取历史记录失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/exam/stats/overview
 * 用户学习数据概览
 */
router.get('/stats/overview', async (req, res) => {
  try {
    const { user_id = 0 } = req.query;

    // 总练习次数
    const totalExams = await UserExam.count({ where: { user_id } });

    // 总答题数
    const totalAnswers = await UserAnswer.count({ where: { user_id } });

    // 正确率
    const correctAnswers = await UserAnswer.count({
      where: { user_id, is_correct: 1 }
    });
    const accuracy = totalAnswers > 0 
      ? Math.round((correctAnswers / totalAnswers) * 100) 
      : 0;

    // 错题本数量
    const wrongCount = await UserWrongQuestion.count({
      where: { user_id, is_mastered: 0 }
    });

    // 今日练习
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayExams = await UserExam.count({
      where: { user_id, created_at: { [Op.gte]: today } }
    });

    // 连续练习天数（简化版）
    const recentDates = await UserExam.findAll({
      where: { user_id },
      attributes: [
        [Sequelize.fn('DATE', Sequelize.col('created_at')), 'date']
      ],
      group: [Sequelize.fn('DATE', Sequelize.col('created_at'))],
      order: [[Sequelize.fn('DATE', Sequelize.col('created_at')), 'DESC']],
      limit: 7,
      raw: true
    });

    res.json({
      success: true,
      data: {
        total_exams: totalExams,
        total_answers: totalAnswers,
        accuracy,
        wrong_count: wrongCount,
        today_exams: todayExams,
        recent_study_days: recentDates.length,
        streak_days: recentDates.length // 简化计算
      }
    });
  } catch (error) {
    console.error('获取学习统计失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
