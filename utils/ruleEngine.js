// 规则引擎 - FAQ知识库

// FAQ数据
const faqData = [
  // 留学政策类
  {
    keywords: ['香港', '政策', '香港留学', '香港政策'],
    category: 'policy',
    content: '香港留学政策要点：\n\n1. 申请要求：\n- 本科：高考成绩达到一本线以上，英语成绩良好\n- 研究生：本科学位，GPA 3.0+，雅思6.5+\n\n2. 签证政策：\n- 需要办理学生签证\n- 毕业后可申请IANG签证留港工作\n\n3. 优势：\n- 教育质量高，国际认可度强\n- 学制短，本科4年，硕士1-2年\n- 毕业后工作机会多',
    quickReplies: ['香港大学介绍', '申请香港大学需要什么', '香港留学费用']
  },
  {
    keywords: ['新加坡', '新加坡留学', '狮城'],
    category: 'policy',
    content: '新加坡留学政策要点：\n\n1. 申请要求：\n- 本科：高考成绩优异，雅思6.0+\n- 研究生：本科学位，GPA 3.2+，雅思6.5+\n\n2. 签证政策：\n- 需要申请学生准证\n- 毕业后可申请工作签证\n\n3. 优势：\n- 教育体系完善，亚洲领先\n- 社会治安良好，生活环境优\n- 留学费用相对合理',
    quickReplies: ['新加坡大学排名', '申请新加坡硕士', '新加坡生活费']
  },
  {
    keywords: ['马来西亚', '大马', '马来'],
    category: 'policy',
    content: '马来西亚留学政策要点：\n\n1. 申请要求：\n- 本科：高中毕业，无需高考成绩\n- 研究生：本科学位，GPA 2.5+\n\n2. 签证政策：\n- 签证通过率高，手续简便\n- 可打工兼职（需申请许可）\n\n3. 优势：\n- 学费低廉，性价比高\n- 英语环境好，英语授课\n- 文化相近，适应容易',
    quickReplies: ['马来西亚热门大学', '马来西亚留学费用', '马来入学要求']
  },
  {
    keywords: ['英国', '英联邦', '澳洲', '澳大利亚'],
    category: 'policy',
    content: '英联邦国家留学政策要点：\n\n1. 英国：\n- 顶尖教育，历史悠久\n- 学制短，硕士仅1年\n- PSW签证毕业后可留英2年\n\n2. 澳大利亚：\n- 教育质量世界领先\n- 毕业后可申请工作签证\n- 移民政策相对友好\n\n3. 申请要求：\n- 雅思/托福成绩\n- 学术成绩（GPA、高考成绩等）\n- 文书材料（PS、推荐信等）',
    quickReplies: ['英国大学排名', '澳洲大学推荐', '英联邦申请流程']
  },

  // 学校查询类
  {
    keywords: ['香港大学', '港大', 'HKU'],
    category: 'school',
    content: '香港大学（HKU）\n\n1. 学校概况：\n- 建校于1911年，香港历史最悠久的大学\n- 2024 QS世界排名：第26位\n- 亚洲顶尖综合性大学\n\n2. 热门专业：\n- 医学、法律、商科、工程、建筑学\n\n3. 申请要求：\n- 本科：高考一本线+100分以上\n- 研究生：GPA 3.5+，雅思7.0+\n\n4. 学费：\n- 本科：约14-18万港币/年\n- 研究生：约15-25万港币/年\n\n需要了解更详细信息，可以点击下方按钮预约顾问咨询。',
    quickReplies: ['香港中文大学', '香港科技大学', '预约港大咨询']
  },
  {
    keywords: ['新加坡国立大学', '国大', 'NUS'],
    category: 'school',
    content: '新加坡国立大学（NUS）\n\n1. 学校概况：\n- 新加坡首屈一指的综合性大学\n- 2024 QS世界排名：第8位\n- 亚洲排名第一的大学\n\n2. 热门专业：\n- 工程商科、计算机、医学、法学\n\n3. 申请要求：\n- 本科：高考成绩优异（一本线+）\n- 研究生：GPA 3.5+，雅思6.5+\n\n4. 学费：\n- 本科：约8-12万新币/年\n- 研究生：约10-18万新币/年\n\n需要了解更多，可以预约顾问深度咨询。',
    quickReplies: ['南洋理工大学', '新加坡管理大学', '预约国大咨询']
  },
  {
    keywords: ['马来亚大学', 'UM', 'Malaya'],
    category: 'school',
    content: '马来亚大学（UM）\n\n1. 学校概况：\n- 马来西亚排名第一的国立大学\n- 2024 QS世界排名：第70位\n- 东南亚顶尖学府之一\n\n2. 热门专业：\n- 医学、工程、商科、法律\n\n3. 申请要求：\n- 本科：高中毕业，无需高考\n- 研究生：本科学位，GPA 2.75+\n\n4. 学费：\n- 本科：约1.5-3万马币/年\n- 研究生：约2-4万马币/年\n\n超高性价比选择！',
    quickReplies: ['博特拉大学', '理科大学', '预约咨询']
  },

  // 申请流程类
  {
    keywords: ['流程', '申请流程', '怎么申请', '如何申请', '步骤'],
    category: 'guide',
    content: '留学申请流程指南：\n\n📋 第一步：前期准备\n- 确定目标国家和学校\n- 了解申请要求和截止日期\n- 准备语言考试（雅思/托福）\n\n📝 第二步：准备材料\n- 学术成绩单\n- 语言成绩单\n- 推荐信（2-3封）\n- 个人陈述（PS）\n- 简历（CV）\n- 护照扫描件\n\n🎯 第三步：网申提交\n- 在线填写申请表\n- 上传申请材料\n- 支付申请费\n\n📧 第四步：等待录取\n- 跟进申请状态\n- 准备面试（如需要）\n- 接收Offer并确认\n\n✈️ 第五步：签证办理\n- 准备签证材料\n- 递交签证申请\n- 等待签证审批\n\n🏠 第六步：行前准备\n- 预订机票和住宿\n- 购买保险\n- 准备行李\n\n需要详细指导，可以预约专业顾问一对一服务。',
    quickReplies: ['申请材料清单', '时间规划', '预约申请指导']
  },
  {
    keywords: ['材料', '文档', '需要准备什么', '申请材料'],
    category: 'guide',
    content: '留学申请材料清单：\n\n📄 必备材料：\n1. 学术材料\n- 成绩单（中英文盖章）\n- 毕业证/在读证明\n- 学位证（研究生申请）\n\n2. 语言成绩\n- 雅思/托福成绩单\n\n3. 文书材料\n- 个人陈述（PS）\n- 推荐信（2-3封）\n- 简历（CV）\n- 研究计划（研究生申请）\n\n4. 其他材料\n- 护照首页扫描\n- 作品集（艺术类专业）\n- 获奖证书（可选）\n\n💡 小贴士：\n- 所有材料建议准备中英文版本\n- 材料需要公证或翻译\n- 提前3-6个月开始准备\n\n需要专业文书指导，可以预约我们的文书服务。',
    quickReplies: ['个人陈述怎么写', '推荐信要求', '预约文书服务']
  },

  // 费用类
  {
    keywords: ['费用', '多少钱', '学费', '生活费', '预算', '花费'],
    category: 'cost',
    content: '留学费用参考：\n\n💰 香港留学（年费用）：\n- 学费：14-25万港币\n- 生活费：8-12万港币\n- 总计：约22-37万港币\n\n💰 新加坡留学（年费用）：\n- 学费：8-18万新币\n- 生活费：6-10万新币\n- 总计：约14-28万新币\n\n💰 马来西亚留学（年费用）：\n- 学费：1.5-4万马币\n- 生活费：2-3万马币\n- 总计：约3.5-7万马币\n\n💰 英国留学（年费用）：\n- 学费：15-30万英镑\n- 生活费：10-15万英镑\n- 总计：约25-45万英镑\n\n💡 省钱小贴士：\n- 申请奖学金\n- 争取校内兼职\n- 选择性价比高的学校\n\n需要详细的费用评估和规划，可以预约顾问咨询。',
    quickReplies: ['奖学金信息', '兼职政策', '预约费用咨询']
  },

  // 通用问题
  {
    keywords: ['你好', '您好', 'hello', 'hi', '在吗'],
    category: 'general',
    content: '您好！我是华南留学的智能客服助手，很高兴为您服务！\n\n我可以帮您解答以下问题：\n- 🌏 留学政策咨询（香港、新加坡、马来西亚等）\n- 🎓 学校和专业查询\n- 📝 申请流程指导\n- 💰 留学费用评估\n- 👨‍💼 预约顾问咨询\n\n请选择您感兴趣的话题，或直接输入您的问题！',
    quickReplies: ['香港留学政策', '查询新加坡大学', '申请流程指导']
  },
  {
    keywords: ['谢谢', '感谢', 'thanks'],
    category: 'general',
    content: '不客气！很高兴能帮助到您！\n\n如果您还有其他问题，随时可以问我。\n\n如果您需要更专业的指导，可以点击下方转人工客服，我们的专业顾问会为您提供一对一服务。',
    quickReplies: ['还有问题', '转人工客服']
  },
  {
    keywords: ['再见', '拜拜', 'goodbye'],
    category: 'general',
    content: '再见！祝您留学顺利，梦想成真！🎓\n\n如果有需要，随时欢迎回来咨询。\n\n华南留学，专注为您提供专业的留学服务！',
    quickReplies: ['再见']
  }
]

/**
 * 规则匹配引擎
 * @param {string} userMessage - 用户消息
 * @returns {object|null} 匹配结果或null
 */
function match(userMessage) {
  if (!userMessage) return null

  const message = userMessage.toLowerCase().trim()

  // 遍历所有FAQ规则
  for (const faq of faqData) {
    // 检查关键词是否匹配
    const matchedKeywords = faq.keywords.filter(keyword =>
      message.includes(keyword.toLowerCase())
    )

    // 如果有至少一个关键词匹配，返回该FAQ
    if (matchedKeywords.length > 0) {
      console.log(`匹配到规则：${faq.category} - ${matchedKeywords.join(', ')}`)
      return {
        category: faq.category,
        content: faq.content,
        quickReplies: faq.quickReplies,
        matchedKeywords: matchedKeywords
      }
    }
  }

  // 没有匹配的规则
  return null
}

/**
 * 获取所有分类
 * @returns {array} 分类列表
 */
function getCategories() {
  const categories = new Set(faqData.map(faq => faq.category))
  return Array.from(categories)
}

/**
 * 根据分类获取FAQ
 * @param {string} category - 分类名称
 * @returns {array} FAQ列表
 */
function getFAQByCategory(category) {
  return faqData.filter(faq => faq.category === category)
}

/**
 * 模糊搜索
 * @param {string} keyword - 搜索关键词
 * @returns {array} 匹配的FAQ列表
 */
function search(keyword) {
  if (!keyword) return []

  const keywordLower = keyword.toLowerCase()

  return faqData.filter(faq => {
    const allKeywords = faq.keywords.concat(
      faq.content.split('，').join(' ').split('\n').join(' ')
    )

    return allKeywords.some(k =>
      k.toLowerCase().includes(keywordLower)
    )
  })
}

module.exports = {
  match,
  getCategories,
  getFAQByCategory,
  search,
  faqData
}
