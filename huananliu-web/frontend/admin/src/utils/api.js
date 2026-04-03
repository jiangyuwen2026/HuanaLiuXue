import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
});

// 请求拦截器
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器
api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 认证
export const login = (data) => api.post('/admin/auth/login', data);
export const getUserInfo = () => api.get('/admin/auth/info');

// 公开API
export const getBanners = () => api.get('/banners');
export const getSchools = (params) => api.get('/schools', { params });
export const getSchoolDetail = (id) => api.get(`/schools/${id}`);
export const getConsultants = (params) => api.get('/consultants', { params });
export const getConsultantDetail = (id) => api.get(`/consultants/${id}`);
export const getCases = (params) => api.get('/cases', { params });
export const getCaseDetail = (id) => api.get(`/cases/${id}`);
export const getNews = (params) => api.get('/news', { params });
export const getNewsDetail = (id) => api.get(`/news/${id}`);
export const submitMessage = (data) => api.post('/messages', data);

// 管理后台API
// 学校
export const getAdminSchools = (params) => api.get('/admin/schools', { params });
export const createSchool = (data) => api.post('/admin/schools', data);
export const updateSchool = (id, data) => api.put(`/admin/schools/${id}`, data);
export const deleteSchool = (id) => api.delete(`/admin/schools/${id}`);

// 顾问
export const getAdminConsultants = (params) => api.get('/admin/consultants', { params });
export const createConsultant = (data) => api.post('/admin/consultants', data);
export const updateConsultant = (id, data) => api.put(`/admin/consultants/${id}`, data);
export const deleteConsultant = (id) => api.delete(`/admin/consultants/${id}`);

// 案例
export const getAdminCases = (params) => api.get('/admin/cases', { params });
export const createCase = (data) => api.post('/admin/cases', data);
export const updateCase = (id, data) => api.put(`/admin/cases/${id}`, data);
export const deleteCase = (id) => api.delete(`/admin/cases/${id}`);

// 学生留言
export const getAdminTestimonials = () => api.get('/testimonials/admin');
export const createTestimonial = (data) => api.post('/testimonials/admin', data);
export const updateTestimonial = (id, data) => api.put(`/testimonials/admin/${id}`, data);
export const deleteTestimonial = (id) => api.delete(`/testimonials/admin/${id}`);

// 明星案例
export const setCaseFeatured = (id, data) => api.put(`/cases/admin/${id}/featured`, data);
export const batchSetCaseFeatured = (data) => api.post('/cases/admin/batch-featured', data);
export const getFeaturedCases = (limit) => api.get(`/cases/featured/list?limit=${limit || 6}`);

// 新闻
export const getAdminNews = (params) => api.get('/admin/news', { params });
export const createNews = (data) => api.post('/admin/news', data);
export const updateNews = (id, data) => api.put(`/admin/news/${id}`, data);
export const deleteNews = (id) => api.delete(`/admin/news/${id}`);

// 新闻推荐
export const setNewsRecommend = (id, data) => api.put(`/news/admin/${id}/recommend`, data);
export const batchSetNewsRecommend = (data) => api.post('/news/admin/batch-recommend', data);
export const getRecommendedNews = (limit) => api.get(`/news/recommended/list?limit=${limit || 20}`);

// 留言
export const getAdminMessages = (params) => api.get('/messages', { params });
export const updateMessage = (id, data) => api.put(`/messages/${id}`, data);
export const deleteMessage = (id) => api.delete(`/messages/${id}`);

// 轮播图
export const getAdminBanners = () => api.get('/banners/admin');
export const createBanner = (data) => api.post('/banners', data);
export const updateBanner = (id, data) => api.put(`/banners/${id}`, data);
export const deleteBanner = (id) => api.delete(`/banners/${id}`);

// 统计
export const getStats = () => api.get('/admin/stats');

// 文件上传
export const uploadConsultantAvatar = (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  return api.post('/upload/consultant-avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

// 删除上传的文件
export const deleteUploadedFile = (filename) => api.delete(`/upload/consultant-avatar/${filename}`);

// 上传学校图片
export const uploadSchoolImage = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return api.post('/upload/school-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

// 删除学校图片
export const deleteSchoolImage = (filename) => api.delete(`/upload/school-image/${filename}`);

// 上传新闻封面
export const uploadNewsCover = (file) => {
  const formData = new FormData();
  formData.append('cover', file);
  return api.post('/upload/news-cover', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

// 上传新闻内容图片
export const uploadNewsImage = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return api.post('/upload/news-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

// 删除新闻图片
export const deleteNewsImage = (filename) => api.delete(`/upload/news-image/${filename}`);

// 上传轮播图
export const uploadBannerImage = (file) => {
  const formData = new FormData();
  formData.append('banner', file);
  return api.post('/upload/banner', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

// 删除轮播图
export const deleteBannerImage = (filename) => api.delete(`/upload/banner/${filename}`);

// 上传案例首图
export const uploadCaseCover = (file) => {
  const formData = new FormData();
  formData.append('cover', file);
  return api.post('/upload/case-cover', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

// 删除案例首图
export const deleteCaseCover = (filename) => api.delete(`/upload/case-cover/${filename}`);

// 网站配置
export const getAdminConfigs = (group) => api.get('/config/admin', { params: { group } });
export const createAdminConfig = (data) => api.post('/config/admin', data);
export const updateAdminConfig = (id, data) => api.put(`/config/admin/${id}`, data);
export const batchUpdateConfigs = (data) => api.put('/config/admin/batch/update', data);
export const initConfigs = () => api.post('/config/admin/init');

// 产品与服务
export const getAdminServices = () => api.get('/services/admin');
export const getAdminService = (id) => api.get(`/services/admin/${id}`);
export const createAdminService = (data) => api.post('/services/admin', data);
export const updateAdminService = (id, data) => api.put(`/services/admin/${id}`, data);
export const deleteAdminService = (id) => api.delete(`/services/admin/${id}`);
export const initServices = () => api.post('/services/admin/init');

// 公开API
export const getPublicServices = () => api.get('/services');

// 竞赛管理
export const getAdminCompetitions = (params) => api.get('/competitions/admin/list', { params });
export const getAdminCompetition = (id) => api.get(`/competitions/admin/detail/${id}`);
export const createCompetition = (data) => api.post('/competitions/admin/create', data);
export const updateCompetition = (id, data) => api.put(`/competitions/admin/update/${id}`, data);
export const deleteCompetition = (id) => api.delete(`/competitions/admin/delete/${id}`);
export const updateCompetitionStatus = (id, status) => api.put(`/competitions/admin/status/${id}`, { status });
export const updateCompetitionSort = (id, sort_order) => api.put(`/competitions/admin/sort/${id}`, { sort_order });

// 竞赛分类
export const getCompetitionCategories = () => api.get('/competitions/categories');

export default api;
