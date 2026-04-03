/**
 * AI 批改服务
 * 用于自动评分写作和口语题目
 * 
 * 注意：这是一个模拟实现，生产环境需要接入真实的 AI API
 * 支持的 AI 服务：OpenAI GPT-4、Azure OpenAI、Claude、文心一言等
 */

const { Question, UserAnswer } = require('../models');

/**
 * AI 批改配置
 */
const AI_CONFIG = {
  // 模拟模式（开发环境使用）
  MOCK_MODE: true,
  
  // API 配置（生产环境使用）
  API_KEY: process.env.OPENAI_API_KEY || '',
  API_BASE: process.env.OPENAI_API_BASE || 'https://api.openai.com/v1',
  MODEL: process.env.AI_MODEL || 'gpt-4',
  
  // 评分标准
  SCORING_CRITERIA: {
    writing: {
      task_response: 0.25,      // 任务回应
      coherence_cohesion: 0.25, // 连贯与衔接
      lexical_resource: 0.25,   // 词汇丰富度
      grammatical_range: 0.25   // 语法多样性
    },
    speaking: {
      fluency_coherence: 0.25,  // 流利度与连贯性
      lexical_resource: 0.25,   // 词汇资源
      grammatical_range: 0.25,  // 语法范围
      pronunciation: 0.25       // 发音
    }
  }
};

/**
 * 模拟 AI 批改（开发测试用）
 * @param {string} type - 题目类型: writing / speaking
 * @param {string} content - 用户答案
 * @param {string} referenceAnswer - 参考答案
 * @returns {object} 评分结果
 */
function mockAIGrading(type, content, referenceAnswer) {
  // 基于答案长度和关键词匹配生成模拟分数
  const wordCount = content.split(/\s+/).length;
  const hasStructure = content.includes('Firstly') || content.includes('Moreover') || content.includes('In conclusion');
  const hasExamples = content.includes('For example') || content.includes('such as');
  
  // 基础分数 (5-8分范围)
  let baseScore = 5.5;
  
  // 字数评分
  if (wordCount > 250) baseScore += 0.5;
  if (wordCount > 300) baseScore += 0.5;
  
  // 结构评分
  if (hasStructure) baseScore += 0.5;
  
  // 例子评分
  if (hasExamples) baseScore += 0.5;
  
  // 随机波动
  baseScore += (Math.random() - 0.5) * 0.5;
  
  // 确保在合理范围内
  const finalScore = Math.max(5.0, Math.min(9.0, baseScore));
  
  const score = Math.round(finalScore * 2) / 2; // 四舍五入到0.5
  
  // 生成各项评分
  const criteria = AI_CONFIG.SCORING_CRITERIA[type];
  const details = {};
  
  for (const [key, weight] of Object.entries(criteria)) {
    const variation = (Math.random() - 0.5) * 1.5;
    let criterionScore = score + variation;
    criterionScore = Math.max(4.0, Math.min(9.0, criterionScore));
    details[key] = Math.round(criterionScore * 2) / 2;
  }
  
  // 生成评语
  const feedback = generateFeedback(type, score, details, content);
  
  return {
    score,
    details,
    feedback,
    word_count: wordCount,
    graded_at: new Date().toISOString(),
    model: 'mock-ai-v1'
  };
}

/**
 * 生成评语
 */
function generateFeedback(type, score, details, content) {
  const feedbacks = [];
  
  if (score >= 7.5) {
    feedbacks.push('整体表现优秀，语言运用流畅自然。');
  } else if (score >= 6.5) {
    feedbacks.push('整体表现良好，能够有效地完成写作任务。');
  } else if (score >= 5.5) {
    feedbacks.push('基本完成任务，但仍有提升空间。');
  } else {
    feedbacks.push('需要加强语言基础，建议多练习。');
  }
  
  // 各项具体建议
  if (details.lexical_resource < 6.0) {
    feedbacks.push('词汇使用较为基础，建议多积累同义词和高级表达。');
  } else if (details.lexical_resource >= 7.5) {
    feedbacks.push('词汇丰富，能够灵活运用多种表达方式。');
  }
  
  if (details.grammatical_range < 6.0) {
    feedbacks.push('句式较为单一，建议尝试使用更多复杂句型。');
  }
  
  if (details.coherence_cohesion < 6.5) {
    feedbacks.push('文章结构可以更清晰，注意使用过渡词连接段落。');
  }
  
  return feedbacks.join('\n\n');
}

/**
 * 执行 AI 批改
 * @param {number} answerId - UserAnswer ID
 * @returns {object} 评分结果
 */
async function gradeAnswer(answerId) {
  try {
    // 获取答题记录
    const answer = await UserAnswer.findByPk(answerId, {
      include: [{ model: Question, as: 'question' }]
    });
    
    if (!answer) {
      throw new Error('答题记录不存在');
    }
    
    if (!answer.question) {
      throw new Error('题目信息不存在');
    }
    
    const { question } = answer;
    const type = question.subject; // writing 或 speaking
    
    if (!['writing', 'speaking'].includes(type)) {
      throw new Error('AI 批改仅支持写作和口语题目');
    }
    
    // 检查是否已批改
    if (answer.ai_score) {
      return {
        success: true,
        data: {
          score: answer.ai_score,
          details: answer.ai_details,
          feedback: answer.ai_feedback,
          graded_at: answer.ai_graded_at,
          from_cache: true
        }
      };
    }
    
    let result;
    
    if (AI_CONFIG.MOCK_MODE) {
      // 模拟批改
      result = mockAIGrading(type, answer.user_answer, question.sample_answer);
    }
    
    // 保存结果到数据库
    await answer.update({
      ai_score: result.score,
      ai_details: result.details,
      ai_feedback: result.feedback,
      ai_graded_at: result.graded_at,
      ai_model: result.model,
      // 更新总分为 AI 评分
      score: result.score,
      is_correct: result.score >= 6.0 ? 1 : 0
    });
    
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('AI 批改失败:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

/**
 * 批量批改
 */
async function batchGrade(examId) {
  try {
    const { UserAnswer, Question } = require('../models');
    
    const answers = await UserAnswer.findAll({
      where: { exam_id: examId },
      include: [{
        model: Question,
        as: 'question',
        where: { subject: ['writing', 'speaking'] }
      }]
    });
    
    const results = [];
    for (const answer of answers) {
      const result = await gradeAnswer(answer.id);
      results.push({
        answer_id: answer.id,
        ...result
      });
    }
    
    return {
      success: true,
      data: {
        total: results.length,
        success: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results
      }
    };
  } catch (error) {
    console.error('批量批改失败:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

module.exports = {
  gradeAnswer,
  batchGrade,
  mockAIGrading,
  AI_CONFIG
};
