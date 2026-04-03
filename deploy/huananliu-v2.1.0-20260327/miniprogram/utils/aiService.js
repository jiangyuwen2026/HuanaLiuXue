// AI智能问答服务 - 腾讯云AI集成

// 配置信息
const config = {
  // 腾讯云API配置（需要在微信公众平台配置服务器域名）
  baseURL: 'https://aichat.tencentyun.com/v1', // 示例域名，实际使用时请替换
  // 如果使用腾讯云小钛智能客服
  // baseURL: 'https://iask.qq.com'
  secretId: '', // 腾讯云SecretId
  secretKey: '', // 腾讯云SecretKey
  region: 'ap-guangzhou', // 地域
  model: 'hunyuan-lite' // 使用混元大模型
}

/**
 * 调用腾讯云AI进行问答
 * @param {string} question - 用户问题
 * @param {object} context - 上下文信息
 * @returns {Promise<object>} AI回复
 */
async function query(question, context = {}) {
  try {
    console.log('AI查询：', question)

    // 构建请求参数
    const params = {
      model: config.model,
      messages: [
        {
          role: 'system',
          content: '你是华南留学的智能客服助手，专门回答关于留学、申请流程、学校选择、费用预算等问题。你的回答应该：1. 准确专业 2. 简洁清晰 3. 有亲和力 4. 必要时提供相关建议或推荐转人工客服'
        },
        {
          role: 'user',
          content: question
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    }

    // 如果有上下文历史，添加到messages中
    if (context.history && context.history.length > 0) {
      // 只保留最近的几轮对话
      const recentHistory = context.history.slice(-6)
      params.messages = [
        { role: 'system', content: params.messages[0].content },
        ...recentHistory,
        { role: 'user', content: question }
      ]
    }

    // TODO: 这里应该调用腾讯云API
    // 目前返回模拟数据用于测试
    const response = await mockAIResponse(question, context)

    return response

  } catch (error) {
    console.error('AI查询失败：', error)
    throw new Error('AI服务暂时不可用，请稍后再试')
  }
}

/**
 * 模拟AI回复（用于测试）
 * @param {string} question - 用户问题
 * @param {object} context - 上下文
 * @returns {Promise<object>}
 */
async function mockAIResponse(question, context) {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000))

  const questionLower = question.toLowerCase()

  // 根据问题关键词生成回复
  let content = ''
  let quickReplies = []

  if (questionLower.includes('推荐') || questionLower.includes('哪个好')) {
    content = '根据您的情况，我可以为您推荐几所学校：\n\n如果您追求学术声誉：\n- 香港大学（QS世界排名26）\n- 新加坡国立大学（QS世界排名8）\n\n如果您考虑性价比：\n- 马来亚大学（费用低，排名高）\n- 香港理工大学（就业率高）\n\n建议您根据个人情况综合考虑，也可以预约专业顾问进行一对一评估。'
    quickReplies = ['预约顾问评估', '了解更多学校']
  } else if (questionLower.includes('难不难') || questionLower.includes('容易') || questionLower.includes('通过率')) {
    content = '留学申请的难度因人而异，主要取决于以下几个方面：\n\n1. 学术背景\n- 高考成绩/本科GPA\n- 学校层次\n\n2. 语言能力\n- 雅思/托福成绩\n- 是否有语言障碍\n\n3. 申请材料\n- 文书质量\n- 推荐信\n\n4. 目标院校\n- 不同学校竞争激烈程度不同\n\n✅ 建议：\n- 选择与自身匹配的学校\n- 提前准备，提升背景\n- 寻求专业指导\n\n需要评估您的录取概率吗？'
    quickReplies = ['评估录取概率', '如何提升背景']
  } else if (questionLower.includes('就业') || questionLower.includes('工作')) {
    content = '留学后的就业前景很好！\n\n香港：\n- 毕业后可申请IANG签证留港2年\n- 国际企业众多，就业机会多\n- 起薪较高（硕士约1.5-2.5万港币/月）\n\n新加坡：\n- 经济发达，失业率低\n- 金融、科技行业发展迅速\n- 毕业后可申请工作签证\n\n马来西亚：\n- 成本低，就业竞争力强\n- 可作为跳板到其他国家发展\n\n💡 我们提供就业指导服务，包括简历修改、面试培训等，需要了解吗？'
    quickReplies = ['就业指导服务', '转人工咨询']
  } else {
    content = `我理解您的问题："${question}"\n\n这是一个很好的问题！为了给您更准确的答案，我建议您：\n\n1. 提供更多背景信息（如您的学历、目标国家等）\n2. 选择更具体的主题（如学校、专业、费用等）\n\n或者，您可以直接转接人工客服，我们的专业顾问会为您提供更详细的解答。`
    quickReplies = ['提供更多信息', '转人工客服']
  }

  return {
    content: content,
    quickReplies: quickReplies,
    model: config.model
  }
}

/**
 * AI图片识别
 * @param {string} imagePath - 图片路径
 * @returns {Promise<object>} 识别结果
 */
async function analyzeImage(imagePath) {
  try {
    console.log('AI图片识别：', imagePath)

    // 上传图片到腾讯云
    // const uploadResult = await uploadImageToCloud(imagePath)

    // 调用腾讯云AI图像识别API
    // const recognitionResult = await callImageRecognitionAPI(uploadResult.url)

    // TODO: 实际调用腾讯云API
    // 目前返回模拟数据

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1500))

    return {
      content: '已收到您上传的图片！\n\n目前我正在学习图片识别功能，暂时无法直接解读图片内容。\n\n建议您：\n1. 用文字描述图片中的内容\n2. 说明您想了解的具体问题\n\n如果您上传的是申请材料或成绩单，可以转人工客服，我们的顾问会为您详细分析。',
      quickReplies: ['用文字描述', '转人工客服'],
      confidence: 0
    }

  } catch (error) {
    console.error('图片识别失败：', error)
    throw new Error('图片识别失败，请重试或转人工客服')
  }
}

/**
 * 生成AI摘要
 * @param {string} text - 需要摘要的文本
 * @returns {Promise<string>} 摘要结果
 */
async function summarize(text) {
  try {
    console.log('生成摘要：', text.substring(0, 50) + '...')

    const params = {
      model: config.model,
      messages: [
        {
          role: 'system',
          content: '请用简洁的语言概括以下内容，不超过100字。'
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.5,
      max_tokens: 200
    }

    // TODO: 调用腾讯云API
    // 目前返回模拟数据
    await new Promise(resolve => setTimeout(resolve, 800))

    return '这是一个关于留学的咨询内容，涉及申请流程、费用预算、学校选择等方面。'

  } catch (error) {
    console.error('摘要生成失败：', error)
    return text.substring(0, 100) + '...'
  }
}

/**
 * 检查AI服务是否可用
 * @returns {Promise<boolean>} 是否可用
 */
async function checkAvailability() {
  try {
    // TODO: 实际检查服务状态
    return true
  } catch (error) {
    console.error('服务状态检查失败：', error)
    return false
  }
}

/**
 * 设置配置
 * @param {object} newConfig - 新配置
 */
function setConfig(newConfig) {
  Object.assign(config, newConfig)
  console.log('AI配置已更新：', config)
}

/**
 * 获取配置
 * @returns {object} 当前配置
 */
function getConfig() {
  return { ...config }
}

module.exports = {
  query,
  analyzeImage,
  summarize,
  checkAvailability,
  setConfig,
  getConfig,
  mockAIResponse
}
