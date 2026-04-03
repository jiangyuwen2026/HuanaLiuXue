/**
 * ============================================================================
 * 题目管理 API 路由
 * ============================================================================
 * 功能：雅思/托福题库的题目增删改查、分类管理、标签管理
 * 路径: /api/questions
 * ============================================================================
 */

const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const {
  Question,
  QuestionCategory,
  QuestionTag,
  QuestionTagRelation
} = require('../models');

// 权限检查中间件（简单版，实际可接入 JWT）
const checkAdmin = (req, res, next) => {
  // 暂时放行，后续接入认证系统
  next();
};

// ============================================================================
// 题目分类管理 API
// ============================================================================

/**
 * GET /api/questions/categories
 * 获取所有题目分类（树形结构）
 */
router.get('/categories', async (req, res) => {
  try {
    const { exam_type, subject } = req.query;
    const where = { status: 1 };
    if (exam_type) where.exam_type = exam_type;
    if (subject) where.subject = subject;

    const categories = await QuestionCategory.findAll({
      where,
      order: [['sort_order', 'ASC'], ['id', 'ASC']]
    });

    // 构建树形结构
    const buildTree = (parentId = 0) => {
      return categories
        .filter(c => c.parent_id === parentId)
        .map(c => ({
          ...c.toJSON(),
          children: buildTree(c.id)
        }));
    };

    const tree = buildTree(0);
    res.json({ success: true, data: tree });
  } catch (error) {
    console.error('获取分类失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/questions/categories
 * 创建分类
 */
router.post('/categories', checkAdmin, async (req, res) => {
  try {
    const category = await QuestionCategory.create(req.body);
    res.json({ success: true, data: category });
  } catch (error) {
    console.error('创建分类失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * PUT /api/questions/categories/:id
 * 更新分类
 */
router.put('/categories/:id', checkAdmin, async (req, res) => {
  try {
    const category = await QuestionCategory.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: '分类不存在' });
    }
    await category.update(req.body);
    res.json({ success: true, data: category });
  } catch (error) {
    console.error('更新分类失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * DELETE /api/questions/categories/:id
 * 删除分类（软删除）
 */
router.delete('/categories/:id', checkAdmin, async (req, res) => {
  try {
    const category = await QuestionCategory.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: '分类不存在' });
    }
    await category.update({ status: 0 });
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    console.error('删除分类失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================================
// 知识点标签管理 API
// ============================================================================

/**
 * GET /api/questions/tags
 * 获取所有标签
 */
router.get('/tags', async (req, res) => {
  try {
    const tags = await QuestionTag.findAll({
      where: { status: 1 },
      order: [['sort_order', 'ASC'], ['id', 'ASC']]
    });
    res.json({ success: true, data: tags });
  } catch (error) {
    console.error('获取标签失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/questions/tags
 * 创建标签
 */
router.post('/tags', checkAdmin, async (req, res) => {
  try {
    const tag = await QuestionTag.create(req.body);
    res.json({ success: true, data: tag });
  } catch (error) {
    console.error('创建标签失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * PUT /api/questions/tags/:id
 * 更新标签
 */
router.put('/tags/:id', checkAdmin, async (req, res) => {
  try {
    const tag = await QuestionTag.findByPk(req.params.id);
    if (!tag) {
      return res.status(404).json({ success: false, message: '标签不存在' });
    }
    await tag.update(req.body);
    res.json({ success: true, data: tag });
  } catch (error) {
    console.error('更新标签失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * DELETE /api/questions/tags/:id
 * 删除标签
 */
router.delete('/tags/:id', checkAdmin, async (req, res) => {
  try {
    const tag = await QuestionTag.findByPk(req.params.id);
    if (!tag) {
      return res.status(404).json({ success: false, message: '标签不存在' });
    }
    await tag.update({ status: 0 });
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    console.error('删除标签失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================================
// 题目管理 API
// ============================================================================

/**
 * GET /api/questions
 * 获取题目列表（支持筛选、分页）
 * Query: exam_type, subject, type, difficulty, category_id, tag_id, keyword, page, pageSize
 */
router.get('/', async (req, res) => {
  try {
    const {
      exam_type,
      subject,
      type,
      difficulty,
      category_id,
      tag_id,
      keyword,
      page = 1,
      pageSize = 20
    } = req.query;

    const where = { status: 1 };
    
    if (exam_type) where.exam_type = exam_type;
    if (subject) where.subject = subject;
    if (type) where.type = type;
    if (difficulty) where.difficulty = parseInt(difficulty);
    if (category_id) where.category_id = parseInt(category_id);
    
    if (keyword) {
      where[Op.or] = [
        { title: { [Op.like]: `%${keyword}%` } },
        { content: { [Op.like]: `%${keyword}%` } }
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(pageSize);
    const limit = parseInt(pageSize);

    // 构建 include
    const include = [
      { model: QuestionCategory, as: 'category', attributes: ['id', 'name'] }
    ];

    // 如果按标签筛选
    if (tag_id) {
      include.push({
        model: QuestionTag,
        as: 'tags',
        where: { id: tag_id },
        through: { attributes: [] }
      });
    } else {
      include.push({
        model: QuestionTag,
        as: 'tags',
        through: { attributes: [] }
      });
    }

    const { count, rows: questions } = await Question.findAndCountAll({
      where,
      include,
      order: [['id', 'DESC']],
      offset,
      limit,
      distinct: true
    });

    res.json({
      success: true,
      data: {
        list: questions,
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          total: count,
          totalPages: Math.ceil(count / parseInt(pageSize))
        }
      }
    });
  } catch (error) {
    console.error('获取题目列表失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/questions/:id
 * 获取题目详情
 */
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id, {
      include: [
        { model: QuestionCategory, as: 'category' },
        { model: QuestionTag, as: 'tags', through: { attributes: [] } }
      ]
    });

    if (!question) {
      return res.status(404).json({ success: false, message: '题目不存在' });
    }

    // 更新练习次数
    await question.increment('usage_count');

    res.json({ success: true, data: question });
  } catch (error) {
    console.error('获取题目详情失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/questions/:id/practice
 * 获取题目用于练习（不返回正确答案）
 */
router.get('/:id/practice', async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id, {
      include: [
        { model: QuestionCategory, as: 'category', attributes: ['id', 'name'] }
      ],
      attributes: {
        exclude: ['correct_answer', 'answer_analysis']
      }
    });

    if (!question) {
      return res.status(404).json({ success: false, message: '题目不存在' });
    }

    res.json({ success: true, data: question });
  } catch (error) {
    console.error('获取练习题目失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/questions
 * 创建题目
 */
router.post('/', checkAdmin, async (req, res) => {
  try {
    const { tag_ids, ...questionData } = req.body;
    
    const question = await Question.create(questionData);
    
    // 关联标签
    if (tag_ids && tag_ids.length > 0) {
      const tags = await QuestionTag.findAll({ where: { id: tag_ids } });
      await question.setTags(tags);
    }

    // 重新查询获取完整数据
    const result = await Question.findByPk(question.id, {
      include: [
        { model: QuestionCategory, as: 'category' },
        { model: QuestionTag, as: 'tags', through: { attributes: [] } }
      ]
    });

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('创建题目失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * PUT /api/questions/:id
 * 更新题目
 */
router.put('/:id', checkAdmin, async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, message: '题目不存在' });
    }

    const { tag_ids, ...updateData } = req.body;
    
    await question.update(updateData);
    
    // 更新标签关联
    if (tag_ids !== undefined) {
      if (tag_ids.length > 0) {
        const tags = await QuestionTag.findAll({ where: { id: tag_ids } });
        await question.setTags(tags);
      } else {
        await question.setTags([]);
      }
    }

    const result = await Question.findByPk(question.id, {
      include: [
        { model: QuestionCategory, as: 'category' },
        { model: QuestionTag, as: 'tags', through: { attributes: [] } }
      ]
    });

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('更新题目失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * DELETE /api/questions/:id
 * 删除题目（软删除）
 */
router.delete('/:id', checkAdmin, async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, message: '题目不存在' });
    }
    await question.update({ status: 0 });
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    console.error('删除题目失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/questions/batch-delete
 * 批量删除题目
 */
router.post('/batch-delete', checkAdmin, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: '请提供要删除的题目ID' });
    }

    await Question.update(
      { status: 0 },
      { where: { id: ids } }
    );

    res.json({ success: true, message: `成功删除 ${ids.length} 道题目` });
  } catch (error) {
    console.error('批量删除题目失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/questions/options/types
 * 获取题型选项
 */
router.get('/options/types', async (req, res) => {
  const types = [
    { value: 'single_choice', label: '单选题', subjects: ['listening', 'reading'] },
    { value: 'multiple_choice', label: '多选题', subjects: ['reading'] },
    { value: 'true_false_not_given', label: '判断题', subjects: ['reading'] },
    { value: 'fill_blank', label: '填空题', subjects: ['listening', 'reading'] },
    { value: 'matching', label: '匹配题', subjects: ['reading'] },
    { value: 'map_labeling', label: '地图标注', subjects: ['listening'] },
    { value: 'sentence_completion', label: '句子完成', subjects: ['listening'] },
    { value: 'essay', label: '大作文(Task 2)', subjects: ['writing'] },
    { value: 'short_answer', label: '小作文(Task 1)', subjects: ['writing'] },
    { value: 'speaking_part1', label: '口语Part 1', subjects: ['speaking'] },
    { value: 'speaking_part2', label: '口语Part 2', subjects: ['speaking'] },
    { value: 'speaking_part3', label: '口语Part 3', subjects: ['speaking'] }
  ];
  res.json({ success: true, data: types });
});

/**
 * GET /api/questions/stats/overview
 * 题库统计概览
 */
router.get('/stats/overview', async (req, res) => {
  try {
    const { exam_type } = req.query;
    const where = { status: 1 };
    if (exam_type) where.exam_type = exam_type;

    const total = await Question.count({ where });
    
    // 按科目统计
    const subjectStats = await Question.findAll({
      where,
      attributes: ['subject', [Question.sequelize.fn('COUNT', '*'), 'count']],
      group: ['subject'],
      raw: true
    });

    // 按难度统计
    const difficultyStats = await Question.findAll({
      where,
      attributes: ['difficulty', [Question.sequelize.fn('COUNT', '*'), 'count']],
      group: ['difficulty'],
      raw: true
    });

    // 今日新增
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await Question.count({
      where: {
        ...where,
        created_at: { [Op.gte]: today }
      }
    });

    res.json({
      success: true,
      data: {
        total,
        today_count: todayCount,
        subject_stats: subjectStats,
        difficulty_stats: difficultyStats
      }
    });
  } catch (error) {
    console.error('获取统计失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
