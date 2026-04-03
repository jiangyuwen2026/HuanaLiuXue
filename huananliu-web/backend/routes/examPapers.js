/**
 * ============================================================================
 * 试卷管理 API 路由
 * ============================================================================
 * 功能：模考卷的增删改查、组卷功能
 * 路径: /api/exam-papers
 * ============================================================================
 */

const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const {
  ExamPaper,
  ExamPaperQuestion,
  Question
} = require('../models');

const checkAdmin = (req, res, next) => {
  next(); // 暂时放行
};

/**
 * GET /api/exam-papers
 * 获取试卷列表
 */
router.get('/', async (req, res) => {
  try {
    const {
      exam_type,
      subject,
      is_official,
      status,
      keyword,
      page = 1,
      pageSize = 20
    } = req.query;

    const where = {};
    if (exam_type) where.exam_type = exam_type;
    if (subject) where.subject = subject;
    if (is_official !== undefined) where.is_official = parseInt(is_official);
    if (status !== undefined) where.status = parseInt(status);
    if (keyword) {
      where.title = { [Op.like]: `%${keyword}%` };
    }

    const offset = (parseInt(page) - 1) * parseInt(pageSize);
    const limit = parseInt(pageSize);

    const { count, rows } = await ExamPaper.findAndCountAll({
      where,
      order: [['sort_order', 'ASC'], ['id', 'DESC']],
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
    console.error('获取试卷列表失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/exam-papers/:id
 * 获取试卷详情（包含题目）
 */
router.get('/:id', async (req, res) => {
  try {
    const paper = await ExamPaper.findByPk(req.params.id, {
      include: [{
        model: Question,
        as: 'questions',
        through: {
          attributes: ['sort_order', 'score']
        },
        include: [
          { model: QuestionCategory, as: 'category', attributes: ['id', 'name'] }
        ]
      }]
    });

    if (!paper) {
      return res.status(404).json({ success: false, message: '试卷不存在' });
    }

    res.json({ success: true, data: paper });
  } catch (error) {
    console.error('获取试卷详情失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/exam-papers
 * 创建试卷
 * Body: { title, exam_type, subject, description, time_limit, is_official, question_ids }
 */
router.post('/', checkAdmin, async (req, res) => {
  try {
    const {
      title,
      exam_type,
      subject,
      description,
      time_limit,
      is_official,
      question_ids = [],
      scores = {}
    } = req.body;

    // 计算题目数和总分
    const questionCount = question_ids.length;
    const totalScore = Object.values(scores).reduce((sum, s) => sum + parseFloat(s || 0), 0);

    const paper = await ExamPaper.create({
      title,
      exam_type,
      subject,
      description,
      time_limit,
      is_official: is_official || 0,
      question_count: questionCount,
      total_score: totalScore || questionCount
    });

    // 关联题目
    if (question_ids.length > 0) {
      const associations = question_ids.map((qid, index) => ({
        paper_id: paper.id,
        question_id: qid,
        sort_order: index + 1,
        score: scores[qid] || 1
      }));
      await ExamPaperQuestion.bulkCreate(associations);
    }

    const result = await ExamPaper.findByPk(paper.id, {
      include: [{
        model: Question,
        as: 'questions',
        through: { attributes: ['sort_order', 'score'] }
      }]
    });

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('创建试卷失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * PUT /api/exam-papers/:id
 * 更新试卷
 */
router.put('/:id', checkAdmin, async (req, res) => {
  try {
    const paper = await ExamPaper.findByPk(req.params.id);
    if (!paper) {
      return res.status(404).json({ success: false, message: '试卷不存在' });
    }

    const {
      title,
      exam_type,
      subject,
      description,
      time_limit,
      is_official,
      status,
      question_ids,
      scores = {}
    } = req.body;

    // 更新基本信息
    await paper.update({
      title,
      exam_type,
      subject,
      description,
      time_limit,
      is_official,
      status
    });

    // 如果传了题目列表，重新组卷
    if (question_ids !== undefined) {
      // 删除旧关联
      await ExamPaperQuestion.destroy({
        where: { paper_id: paper.id }
      });

      // 创建新关联
      if (question_ids.length > 0) {
        const associations = question_ids.map((qid, index) => ({
          paper_id: paper.id,
          question_id: qid,
          sort_order: index + 1,
          score: scores[qid] || 1
        }));
        await ExamPaperQuestion.bulkCreate(associations);

        // 更新统计
        await paper.update({
          question_count: question_ids.length,
          total_score: Object.values(scores).reduce((sum, s) => sum + parseFloat(s || 0), 0)
        });
      }
    }

    const result = await ExamPaper.findByPk(paper.id, {
      include: [{
        model: Question,
        as: 'questions',
        through: { attributes: ['sort_order', 'score'] }
      }]
    });

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('更新试卷失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * DELETE /api/exam-papers/:id
 * 删除试卷
 */
router.delete('/:id', checkAdmin, async (req, res) => {
  try {
    const paper = await ExamPaper.findByPk(req.params.id);
    if (!paper) {
      return res.status(404).json({ success: false, message: '试卷不存在' });
    }

    // 软删除
    await paper.update({ status: 0 });
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    console.error('删除试卷失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/exam-papers/options/available-questions
 * 获取可用于组卷的题目
 * Query: { exam_type, subject, exclude_ids }
 */
router.get('/options/available-questions', async (req, res) => {
  try {
    const { exam_type, subject, exclude_ids = '', keyword } = req.query;
    
    const where = { status: 1 };
    if (exam_type) where.exam_type = exam_type;
    if (subject) where.subject = subject;
    if (keyword) {
      where.title = { [Op.like]: `%${keyword}%` };
    }

    if (exclude_ids) {
      const excluded = exclude_ids.split(',').map(id => parseInt(id));
      where.id = { [Op.notIn]: excluded };
    }

    const questions = await Question.findAll({
      where,
      attributes: ['id', 'title', 'type', 'difficulty', 'exam_type', 'subject'],
      order: [['id', 'DESC']],
      limit: 100
    });

    res.json({ success: true, data: questions });
  } catch (error) {
    console.error('获取可选题目失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
