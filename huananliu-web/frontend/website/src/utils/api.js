import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
});

// 响应拦截器
api.interceptors.response.use(
  response => response.data,
  error => {
    console.error('API Error:', error);
    // 返回一个默认的错误响应，避免页面崩溃
    return { success: false, data: null, message: error.message };
  }
);

// 公开API
export const getBanners = () => api.get('/banners');
export const getSchools = (params) => api.get('/schools', { params });
export const getSchoolDetail = (id) => api.get(`/schools/${id}`);
export const getHotSchools = () => api.get('/schools/hot/list');
export const getCountries = () => api.get('/schools/options/countries');

export const getConsultants = (params) => api.get('/consultants', { params });
export const getConsultantDetail = (id) => api.get(`/consultants/${id}`);
export const getHotConsultants = () => api.get('/consultants/hot/list');

export const getCases = (params) => api.get('/cases', { params });
export const getCaseDetail = (id) => api.get(`/cases/${id}`);
export const getHotCases = () => api.get('/cases/hot/list');
export const getFeaturedCases = (limit = 6) => api.get(`/cases/featured/list?limit=${limit}`);

export const getNews = (params) => api.get('/news', { params });
export const getNewsDetail = (id) => api.get(`/news/${id}`);
export const getHotNews = () => api.get('/news/hot/list');
export const getNewsCategories = () => api.get('/news/options/categories');
export const getRecommendedNews = (limit = 6) => api.get(`/news/recommended/list?limit=${limit}`);

export const submitMessage = (data) => api.post('/messages', data);
export const createMessage = (data) => api.post('/messages', data);

// 预约到访
export const submitAppointment = (data) => api.post('/appointments', data);

// 获取网站配置
export const getSiteConfig = () => api.get('/config/public');

// 服务
export const getPublicServices = () => api.get('/services');

// 关于我们
export const getAbout = () => api.get('/about');

// 留学快讯
export const getLatestStudyNews = (limit = 5) => api.get(`/study-news/latest?limit=${limit}`);
export const getStudyNews = (params) => api.get('/study-news', { params });
export const getStudyNewsDetail = (id) => api.get(`/study-news/detail/${id}`);

// 学生留言
export const getTestimonials = (limit = 10) => api.get(`/testimonials?limit=${limit}`);

export default api;
