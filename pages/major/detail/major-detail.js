// pages/major/detail/major-detail.js
const app = getApp()

Page({
  data: {
    id: null,
    major: {}
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ id: options.id });
      this.loadMajorDetail(options.id);
    }
  },

  // 加载专业详情
  loadMajorDetail(id) {
    app.showLoading();

    // TODO: 从后端API获取数据
    // wx.request({
    //   url: app.globalData.baseUrl + '/major/detail',
    //   data: { id },
    //   success: (res) => {
    //     this.setData({ major: res.data.data });
    //   },
    //   complete: () => {
    //     app.hideLoading();
    //   }
    // });

    // 模拟数据
    setTimeout(() => {
      this.setData({
        major: {
          id: id,
          name: '工商管理硕士（MBA）',
          category: '商科',
          description: '培养具有国际视野、掌握现代管理理论和方法的高级管理人才',
          introduction: 'MBA（Master of Business Administration）是培养企业管理人才的专业学位。课程涵盖管理学、市场营销、财务管理、人力资源管理等多个领域，旨在培养具有战略思维和领导力的商业精英。',
          courses: [
            '战略管理',
            '财务管理',
            '市场营销',
            '人力资源管理',
            '运营管理',
            '商业伦理',
            '组织行为学',
            '管理经济学'
          ],
          schools: [
            { id: 1, name: '香港大学' },
            { id: 2, name: '香港中文大学' },
            { id: 3, name: '新加坡国立大学' },
            { id: 4, name: '南洋理工大学' },
            { id: 5, name: '马来亚大学' }
          ],
          careers: [
            '企业管理',
            '金融投资',
            '咨询顾问',
            '市场营销',
            '创业创新',
            '投资银行',
            '项目管理'
          ],
          backgroundRequirement: '本科学士学位，通常要求2-3年工作经验',
          languageRequirement: '雅思6.5分以上（单项不低于6.0），或托福80分以上',
          isCollected: false
        }
      });
      app.hideLoading();
    }, 500);
  },

  // 查看学校
  goToSchool(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/school/detail/school-detail?id=${id}`
    });
  },

  // 切换收藏
  toggleCollect() {
    const isCollected = !this.data.major.isCollected;
    this.setData({
      'major.isCollected': isCollected
    });

    if (isCollected) {
      app.showSuccess('收藏成功');
    } else {
      app.showError('已取消收藏');
    }

    // TODO: 调用后端API保存收藏状态
  },

  // 预约咨询
  makeAppointment() {
    wx.navigateTo({
      url: `/pages/appointment/appointment?majorId=${this.data.id}&majorName=${this.data.major.name}`
    });
  }
})
