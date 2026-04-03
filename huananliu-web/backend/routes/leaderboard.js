/**
 * 排行榜 API 路由
 * 路径: /api/leaderboard
 */

const express = require('express');
const router = express.Router();
const { Sequelize } = require('sequelize');
const { UserExam, User } = require('../models');

/**
 * GET /api/leaderboard
 * 获取排行榜
 * Query: { exam_type, mode, period, page, pageSize }
 * - period: weekly, monthly, all
 */
router.get('/', async (req, res) => {
  try {
    const {
      exam_type = 'ielts',
      mode = 'exam',
      period = 'all',
      page = 1,
      pageSize = 20
    } = req.query;

    // 构建时间筛选
    let dateFilter = {};
    if (period === 'weekly') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateFilter = { created_at: { [Sequelize.Op.gte]: weekAgo } };
    } else if (period === 'monthly') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      dateFilter = { created_at: { [Sequelize.Op.gte]: monthAgo } };
    }

    // 获取排行榜数据
    const { count, rows } = await UserExam.findAndCountAll({
      where: {
        exam_type,
        mode,
        status: 1, // 已完成的考试
        ...dateFilter
      },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'nickname', 'avatar']
      }],
      order: [
        ['user_score', 'DESC'],
        ['time_spent', 'ASC'] // 同分情况下用时短的排前面
      ],
      offset: (parseInt(page) - 1) * parseInt(pageSize),
      limit: parseInt(pageSize)
    });

    // 处理排名（去重用户，取每个用户的最高分）
    const userBestScores = new Map();
    rows.forEach(exam => {
      const userId = exam.user_id;
      if (!userBestScores.has(userId) || userBestScores.get(userId).user_score < exam.user_score) {
        userBestScores.set(userId, exam);
      }
    });

    const uniqueResults = Array.from(userBestScores.values()).slice(0, pageSize);

    // 添加排名
    const leaderboard = uniqueResults.map((exam, index) => ({
      rank: (parseInt(page) - 1) * parseInt(pageSize) + index + 1,
      user: exam.user ? {
        id: exam.user.id,
        nickname: exam.user.nickname || `用户${exam.user.id}`,
        avatar: exam.user.avatar
      } : {
        id: exam.user_id,
        nickname: `用户${exam.user_id}`,
        avatar: null
      },
      score: exam.user_score,
      accuracy: exam.total_questions > 0 
        ? Math.round((exam.correct_count / exam.total_questions) * 100) 
        : 0,
      time_spent: exam.time_spent,
      exam_id: exam.id,
      created_at: exam.created_at
    }));

    res.json({
      success: true,
      data: {
        list: leaderboard,
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          total: userBestScores.size
        }
      }
    });
  } catch (error) {
    console.error('获取排行榜失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/leaderboard/user/:userId
 * 获取用户排名和历史最佳
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { exam_type = 'ielts' } = req.query;

    // 获取用户所有已完成考试
    const exams = await UserExam.findAll({
      where: {
        user_id: userId,
        exam_type,
        status: 1
      },
      order: [['user_score', 'DESC']]
    });

    if (exams.length === 0) {
      return res.json({
        success: true,
        data: {
          has_record: false,
          best_score: 0,
          total_exams: 0,
          rank: null
        }
      });
    }

    const bestExam = exams[0];

    // 计算排名（有多少人分数更高）
    const higherScores = await UserExam.count({
      where: {
        exam_type,
        mode: 'exam',
        status: 1,
        user_score: { [Sequelize.Op.gt]: bestExam.user_score }
      },
      distinct: true,
      col: 'user_id'
    });

    const rank = higherScores + 1;

    res.json({
      success: true,
      data: {
        has_record: true,
        best_score: bestExam.user_score,
        best_accuracy: bestExam.total_questions > 0 
          ? Math.round((bestExam.correct_count / bestExam.total_questions) * 100) 
          : 0,
        total_exams: exams.length,
        rank: rank,
        top_percent: Math.max(1, Math.round((rank / (higherScores + 100)) * 100)) // 估算百分比
      }
    });
  } catch (error) {
    console.error('获取用户排名失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/leaderboard/stats
 * 获取排行榜统计
 */
router.get('/stats/overview', async (req, res) => {
  try {
    const { exam_type = 'ielts' } = req.query;

    // 总参与人数
    const totalParticipants = await UserExam.count({
      distinct: true,
      col: 'user_id',
      where: { exam_type, status: 1 }
    });

    // 今日新增考试数
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayExams = await UserExam.count({
      where: {
        exam_type,
        status: 1,
        created_at: { [Sequelize.Op.gte]: today }
      }
    });

    // 最高分
    const highestScore = await UserExam.findOne({
      where: { exam_type, status: 1 },
      order: [['user_score', 'DESC']]
    });

    // 平均分
    const avgScore = await UserExam.findOne({
      where: { exam_type, status: 1 },
      attributes: [[Sequelize.fn('AVG', Sequelize.col('user_score')), 'avg']]
    });

    res.json({
      success: true,
      data: {
        total_participants: totalParticipants,
        today_exams: todayExams,
        highest_score: highestScore ? highestScore.user_score : 0,
        average_score: avgScore ? Math.round(avgScore.get('avg') * 10) / 10 : 0
      }
    });
  } catch (error) {
    console.error('获取排行榜统计失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
