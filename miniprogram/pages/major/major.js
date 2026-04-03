// pages/major/major.js
const app = getApp()
const dataManager = require('../../utils/dataManager.js')

Page({
  data: {
    keyword: '',
    selectedCategory: '',
    selectedType: 'master', // 'undergraduate' or 'master'
    categoryList: [],
    majorList: [],
    filteredList: [],
    page: 1,
    pageSize: 10,
    hasMore: true,
    loading: false
  },

  onLoad() {
    // 加载专业分类
    this.loadCategories();

    // 加载专业列表
    this.loadMajorList();
  },

  // 加载专业分类
  loadCategories() {
    const categories = [
      { name: '全部', nameEn: 'All' },
      { name: '商科', nameEn: 'Business' },
      { name: '工科', nameEn: 'Engineering' },
      { name: '文科', nameEn: 'Arts' },
      { name: '法学', nameEn: 'Law' },
      { name: '医学', nameEn: 'Medicine' },
      { name: '设计', nameEn: 'Design' }
    ];

    this.setData({ categoryList: categories });
  },

  // 搜索输入
  onSearchInput(e) {
    this.setData({
      keyword: e.detail.value
    });
  },

  // 搜索
  onSearch() {
    if (this.data.keyword.trim()) {
      const results = dataManager.searchMajors(this.data.keyword);
      const list = this.data.selectedType === 'master' ? results.master : results.undergraduate;

      this.setData({
        majorList: list,
        filteredList: list,
        hasMore: false
      });
    } else {
      this.loadMajorList();
    }
  },

  // 筛选分类
  onFilterCategory(e) {
    const category = e.currentTarget.dataset.category;

    if (category === '全部') {
      this.loadMajorList();
    } else {
      const programs = dataManager.getMasterProgramsByCategory(category);
      this.setData({
        selectedCategory: category,
        majorList: programs.slice(0, this.data.pageSize),
        filteredList: programs,
        hasMore: programs.length > this.data.pageSize,
        page: 1
      });
    }
  },

  // 切换专业类型
  onSwitchType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      selectedType: type,
      selectedCategory: '',
      keyword: '',
      page: 1
    });
    this.loadMajorList();
  },

  // 加载专业列表
  loadMajorList() {
    if (this.data.loading) {
      return;
    }

    this.setData({ loading: true });

    setTimeout(() => {
      let allMajors = [];

      if (this.data.selectedType === 'master') {
        allMajors = dataManager.getAllMasterPrograms();
      } else {
        allMajors = dataManager.getAllUndergraduateMajors();
      }

      // 按大学排名和分类排序
      allMajors.sort((a, b) => {
        const aRank = a.universityRanking || 9999;
        const bRank = b.universityRanking || 9999;
        if (aRank !== bRank) {
          return aRank - bRank;
        }
        // 同一大学内按分类排序
        const aCat = a.category || a.faculty || '';
        const bCat = b.category || b.faculty || '';
        return aCat.localeCompare(bCat);
      });

      this.setData({
        majorList: allMajors.slice(0, this.data.pageSize),
        filteredList: allMajors,
        hasMore: allMajors.length > this.data.pageSize,
        loading: false
      });
    }, 300);
  },

  // 按预算筛选
  onFilterByBudget() {
    wx.showActionSheet({
      itemList: ['30万以下', '30-50万', '50万以上'],
      success: (res) => {
        const budgetRanges = [300000, 500000, Infinity];
        const maxBudget = budgetRanges[res.tapIndex];

        const filteredPrograms = dataManager.getMasterProgramsByBudget(maxBudget);
        this.setData({
          majorList: filteredPrograms.slice(0, this.data.pageSize),
          filteredList: filteredPrograms,
          selectedCategory: '预算',
          hasMore: filteredPrograms.length > this.data.pageSize,
          page: 1
        });
      }
    });
  },

  // 按学制筛选
  onFilterByDuration() {
    wx.showActionSheet({
      itemList: ['1年', '1.5年', '2年及以上'],
      success: (res) => {
        const durationRanges = [
          [1, 1],
          [1.5, 1.5],
          [2, 10]
        ];

        const [minDur, maxDur] = durationRanges[res.tapIndex];
        const allPrograms = dataManager.getAllMasterPrograms();

        const filtered = allPrograms.filter(p => {
          const duration = parseFloat(p.duration) || 0;
          return duration >= minDur && duration <= maxDur;
        });

        this.setData({
          majorList: filtered.slice(0, this.data.pageSize),
          filteredList: filtered,
          selectedCategory: '学制',
          hasMore: filtered.length > this.data.pageSize,
          page: 1
        });
      }
    });
  },

  // 查看详情
  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/major/detail/major-detail?id=${id}`
    });
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.setData({
      page: 1,
      majorList: [],
      hasMore: true
    });
    this.loadMajorList();
    wx.stopPullDownRefresh();
  },

  // 上拉加载
  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({ loading: true });

      setTimeout(() => {
        const currentList = this.data.majorList;
        const nextStart = this.data.page * this.data.pageSize;
        const nextEnd = nextStart + this.data.pageSize;
        const moreItems = this.data.filteredList.slice(nextStart, nextEnd);

        if (moreItems.length > 0) {
          this.setData({
            majorList: [...currentList, ...moreItems],
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
