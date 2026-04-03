// pages/guide/guide.js
const app = getApp()

Page({
  data: {
    // 申请流程
    process: [
      {
        step: 1,
        title: '确定目标',
        desc: '根据个人背景和职业规划，确定留学目标国家、学校和专业'
      },
      {
        step: 2,
        title: '准备材料',
        desc: '准备语言考试（雅思/托福）、GPA提升、实习科研等'
      },
      {
        step: 3,
        title: '准备申请材料',
        desc: '整理成绩单、推荐信、个人陈述、简历等申请材料'
      },
      {
        step: 4,
        title: '提交申请',
        desc: '在开放申请时间后，按时提交在线申请'
      },
      {
        step: 5,
        title: '等待结果',
        desc: '等待学校审核，准备面试（如需）'
      },
      {
        step: 6,
        title: '接受offer',
        desc: '收到offer后，按要求缴纳押金确认入学'
      },
      {
        step: 7,
        title: '办理签证',
        desc: '准备签证材料，办理学生签证'
      },
      {
        step: 8,
        title: '行前准备',
        desc: '安排住宿、购买机票、准备行李等'
      }
    ],

    // 申请时间节点
    timeline: [
      {
        month: '6-7月',
        event: '确定留学目标，开始准备语言考试'
      },
      {
        month: '8-9月',
        event: '提升GPA，参加实习科研项目'
      },
      {
        month: '10月',
        event: '准备申请材料，开始网申'
      },
      {
        month: '11-12月',
        event: '提交申请，准备面试'
      },
      {
        month: '1-3月',
        event: '等待offer，准备签证材料'
      },
      {
        month: '4-6月',
        event: '接受offer，办理学生签证'
      },
      {
        month: '7-8月',
        event: '行前准备，购买机票'
      }
    ],

    // 申请材料
    materials: [
      {
        name: '本科成绩单',
        required: true,
        desc: '中英文对照，盖学校公章'
      },
      {
        name: '学位证、毕业证',
        required: true,
        desc: '中英文对照，盖学校公章（应届生提供在读证明）'
      },
      {
        name: '语言成绩单',
        required: true,
        desc: '雅思/托福成绩，有效期2年'
      },
      {
        name: '推荐信',
        required: true,
        desc: '通常2-3封，由教授或工作领导撰写'
      },
      {
        name: '个人陈述（PS）',
        required: true,
        desc: '介绍个人背景、申请动机、职业规划等'
      },
      {
        name: '简历（CV）',
        required: true,
        desc: '详细列出教育背景、实习科研经历等'
      },
      {
        name: 'GRE/GMAT成绩',
        required: false,
        desc: '部分商科或工程专业需要'
      },
      {
        name: '作品集',
        required: false,
        desc: '艺术设计类专业需要'
      }
    ],

    // 常见问题
    faq: [
      {
        question: '什么时候开始准备申请比较好？',
        answer: '建议提前1-1.5年开始准备，有充足时间提升背景和准备材料。'
      },
      {
        question: '申请可以同时申请多个学校吗？',
        answer: '可以，一般建议同时申请5-8所学校，有冲刺、匹配和保底。'
      },
      {
        question: '语言成绩不达标怎么办？',
        answer: '部分学校提供语言班或双录取，也可以考虑延期申请。'
      },
      {
        question: '申请需要面试吗？',
        answer: '部分专业（如商科、MBA）可能需要面试，提前准备常见面试问题。'
      }
    ]
  },

  // 预约咨询
  makeAppointment() {
    wx.navigateTo({
      url: '/pages/appointment/appointment'
    });
  }
})
