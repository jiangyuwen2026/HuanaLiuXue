/**
 * AI 批改 API 路由
 * 路径: /api/ai-grading
 */

const express = require('express');
const router = express.Router();
const { gradeAnswer, batchGrade } = require('../services/aiGrading');
const { UserAnswer } = require('../models');

/**
 * POST /api/ai-grading/grade/:answerId
 * 对单道题目进行 AI 批改
 */
router.post('/grade/:answerId', async (req, res) => {
  try {
    const { answerId } = req.params;
    const result = await gradeAnswer(answerId);
    
    if (result.success) {
      res.json({ success: true, data: result.data });
    } else {
      res.status(400).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error('AI 批改接口错误:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/ai-grading/batch-grade/:examId
 * 批量批改整份试卷的写作/口语题
 */
router.post('/batch-grade/:examId', async (req, res) => {
  try {
    const { examId } = req.params;
    const result = await batchGrade(examId);
    
    if (result.success) {
      res.json({ success: true, data: result.data });
    } else {
      res.status(400).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error('批量批改接口错误:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/ai-grading/status/:answerId
 * 查询 AI 批改状态
 */
router.get('/status/:answerId', async (req, res) => {
  try {
    const { answerId } = req.params;
    
    const answer = await UserAnswer.findByPk(answerId, {
      attributes: ['id', 'ai_score', 'ai_details', 'ai_feedback', 'ai_graded_at', 'ai_model']
    });
    
    if (!answer) {
      return res.status(404).json({ success: false, message: '答题记录不存在' });
    }
    
    const isGraded = !!answer.ai_score;
    
    res.json({
      success: true,
      data: {
        is_graded: isGraded,
        result: isGraded ? {
          score: answer.ai_score,
          details: answer.ai_details,
          feedback: answer.ai_feedback,
          graded_at: answer.ai_graded_at,
          model: answer.ai_model
        } : null
      }
    });
  } catch (error) {
    console.error('查询批改状态错误:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
