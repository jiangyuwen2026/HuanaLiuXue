// pages/school/school.js
const app = getApp()
const dataManager = require('../../utils/dataManager')

Page({
  data: {
    keyword: '',
    majorKeyword: '',
    selectedCountry: '',
    schoolList: [],
    filteredList: [],
    page: 1,
    pageSize: 10,
    hasMore: true,
    loading: false,
    allSchoolsLoaded: false,
    showMajorSearch: false,
    majorSearchResults: []
  },

  onLoad() {
    // 使用数据管理工具加载学校列表
    this.loadSchoolList();
  },

  // 切换专业搜索
  toggleMajorSearch() {
    const showMajorSearch = !this.data.showMajorSearch;
    this.setData({
      showMajorSearch: showMajorSearch,
      majorKeyword: '',
      majorSearchResults: []
    });
  },

  // 学校名称搜索输入
  onSearchInput(e) {
    this.setData({
      keyword: e.detail.value
    });
  },

  // 专业搜索输入
  onMajorSearchInput(e) {
    this.setData({
      majorKeyword: e.detail.value
    });
  },

  // 学校搜索
  onSearch() {
    if (this.data.keyword.trim()) {
      const results = dataManager.searchUniversities(this.data.keyword);
      this.setData({
        schoolList: results,
        filteredList: results,
        hasMore: false,
        page: 1
      });
    } else {
      this.loadSchoolList();
    }
  },

  // 专业搜索
  onMajorSearch() {
    const keyword = this.data.majorKeyword.trim();
    if (!keyword) {
      wx.showToast({
        title: '请输入专业关键词',
        icon: 'none'
      });
      return;
    }

    this.setData({ loading: true });

    // 使用数据管理工具的searchMajors函数进行搜索
    const searchResults = dataManager.searchMajors(keyword);
    const undergradResults = searchResults.undergraduate;
    const masterResults = searchResults.master;

    // 按学校分组
    const schoolGroups = {};
    
    // 处理本科专业
    undergradResults.forEach(major => {
      const schoolId = major.universityId;
      if (!schoolGroups[schoolId]) {
        schoolGroups[schoolId] = {
          schoolId: schoolId,
          schoolName: major.universityName,
          schoolCountry: major.universityCountry,
          schoolRanking: major.universityRanking,
          logo: major.logo,
          majors: [],
          programs: []
        };
      }
      schoolGroups[schoolId].majors.push({
        name: major.name,
        faculty: major.faculty,
        type: '本科',
        duration: major.duration,
        language: major.language
      });
    });

    // 处理硕士专业
    masterResults.forEach(program => {
      const schoolId = program.universityId;
      if (!schoolGroups[schoolId]) {
        schoolGroups[schoolId] = {
          schoolId: schoolId,
          schoolName: program.universityName,
          schoolCountry: program.universityCountry,
          schoolRanking: program.universityRanking,
          logo: program.logo,
          majors: [],
          programs: []
        };
      }
      schoolGroups[schoolId].programs.push({
        name: program.name,
        category: program.category,
        type: '硕士',
        duration: program.duration,
        language: program.language
      });
    });

    // 转换为数组并排序
    const results = Object.values(schoolGroups);
    results.sort((a, b) => {
      // 先按匹配的专业数量排序
      const aCount = a.majors.length + a.programs.length;
      const bCount = b.majors.length + b.programs.length;
      if (bCount !== aCount) return bCount - aCount;
      
      // 再按学校排名排序
      return a.schoolRanking - b.schoolRanking;
    });

    this.setData({
      majorSearchResults: results.slice(0, 20), // 限制显示数量
      loading: false
    });

    if (results.length === 0) {
      wx.showToast({
        title: '未找到相关专业',
        icon: 'none'
      });
    } else {
      wx.showToast({
        title: `找到${results.length}所学校`,
        icon: 'success'
      });
    }
  },

  // 筛选国家
  onFilterCountry(e) {
    const country = e.currentTarget.dataset.country;

    if (country === '全部') {
      const allSchools = dataManager.getAllUniversities();
      this.setData({
        selectedCountry: '',
        schoolList: allSchools.slice(0, this.data.pageSize),
        filteredList: allSchools,
        hasMore: allSchools.length > this.data.pageSize,
        page: 1
      });
    } else {
      const filteredSchools = dataManager.getUniversitiesByCountry(country);
      this.setData({
        selectedCountry: country,
        schoolList: filteredSchools.slice(0, this.data.pageSize),
        filteredList: filteredSchools,
        hasMore: filteredSchools.length > this.data.pageSize,
        page: 1
      });
    }
  },

  // 加载学校列表
  loadSchoolList() {
    if (this.data.loading || (this.data.allSchoolsLoaded && !this.data.selectedCountry)) {
      return;
    }

    this.setData({ loading: true });

    // 使用数据管理工具获取所有学校
    setTimeout(() => {
      const allSchools = dataManager.getAllUniversities();

      // 按QS排名排序（从字符串中提取排名数字）
      allSchools.sort((a, b) => {
        const extractRank = (rankingStr) => {
          const match = rankingStr?.match(/#(\d+)/);
          return match ? parseInt(match[1]) : 9999;
        };
        const aRank = extractRank(a.ranking);
        const bRank = extractRank(b.ranking);
        return aRank - bRank;
      });

      this.setData({
        schoolList: allSchools.slice(0, this.data.pageSize),
        filteredList: allSchools,
        hasMore: allSchools.length > this.data.pageSize,
        allSchoolsLoaded: true,
        loading: false
      });
    }, 300);
  },

  // 查看详情
  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/school/detail/school-detail?id=${id}`
    });
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.setData({
      page: 1,
      schoolList: [],
      hasMore: true,
      allSchoolsLoaded: false
    });
    this.loadSchoolList();
    wx.stopPullDownRefresh();
  },

  // 上拉加载
  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({ loading: true });

      setTimeout(() => {
        const currentList = this.data.schoolList;
        const nextStart = this.data.page * this.data.pageSize;
        const nextEnd = nextStart + this.data.pageSize;
        const moreItems = this.data.filteredList.slice(nextStart, nextEnd);

        if (moreItems.length > 0) {
          this.setData({
            schoolList: [...currentList, ...moreItems],
            page: this.data.page + 1,
            hasMore: this.data.filteredList.length > nextEnd,
            loading: false
          });
        } else {
          this.setData({
            hasMore: false,
            loading: false
          });
        }
      }, 300);
    }
  }
})
