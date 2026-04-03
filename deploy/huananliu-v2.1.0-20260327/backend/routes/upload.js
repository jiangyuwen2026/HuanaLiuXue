const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// 确保上传目录存在
const consultantsDir = path.join(__dirname, '..', 'uploads', 'consultants');
const schoolsDir = path.join(__dirname, '..', 'uploads', 'schools');
if (!fs.existsSync(consultantsDir)) {
  fs.mkdirSync(consultantsDir, { recursive: true });
}
if (!fs.existsSync(schoolsDir)) {
  fs.mkdirSync(schoolsDir, { recursive: true });
}

// 配置存储 - 顾问头像
const consultantStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, consultantsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'consultant-' + uniqueSuffix + ext);
  }
});

// 配置存储 - 学校图片
const schoolStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, schoolsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'school-' + uniqueSuffix + ext);
  }
});



// 文件过滤
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('只支持 JPG, PNG, GIF, WEBP 格式的图片'), false);
  }
};

// 配置上传 - 顾问
const uploadConsultant = multer({ 
  storage: consultantStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// 配置上传 - 学校
const uploadSchool = multer({ 
  storage: schoolStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// 上传顾问头像
router.post('/consultant-avatar', uploadConsultant.single('avatar'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: '没有上传文件' });
    }
    
    // 返回文件访问路径
    const fileUrl = `/uploads/consultants/${req.file.filename}`;
    
    res.json({
      success: true,
      data: {
        url: fileUrl,
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 删除已上传的文件
router.delete('/consultant-avatar/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(consultantsDir, filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    res.json({ success: true, message: '文件已删除' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 上传学校图片（banner/logo）
router.post('/school-image', uploadSchool.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: '没有上传文件' });
    }
    
    const fileUrl = `/uploads/schools/${req.file.filename}`;
    
    res.json({
      success: true,
      data: {
        url: fileUrl,
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 删除学校图片
router.delete('/school-image/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(schoolsDir, filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    res.json({ success: true, message: '文件已删除' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== 新闻相关上传 ====================

// 确保新闻上传目录存在
const newsDir = path.join(__dirname, '..', 'uploads', 'news');
if (!fs.existsSync(newsDir)) {
  fs.mkdirSync(newsDir, { recursive: true });
}

// 配置存储 - 新闻图片
const newsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, newsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'news-' + uniqueSuffix + ext);
  }
});

// 配置上传 - 新闻图片
const uploadNews = multer({ 
  storage: newsStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// 上传新闻封面图
router.post('/news-cover', uploadNews.single('cover'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: '没有上传文件' });
    }
    
    const fileUrl = `/uploads/news/${req.file.filename}`;
    
    res.json({
      success: true,
      data: {
        url: fileUrl,
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 上传新闻内容图片（富文本编辑器用）
router.post('/news-image', uploadNews.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: '没有上传文件' });
    }
    
    const fileUrl = `/uploads/news/${req.file.filename}`;
    
    res.json({
      success: true,
      data: {
        url: fileUrl,
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 删除新闻图片
router.delete('/news-image/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(newsDir, filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    res.json({ success: true, message: '文件已删除' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== Banner轮播图上传 ====================

// 确保轮播图上传目录存在
const bannersDir = path.join(__dirname, '..', 'uploads', 'banners');
if (!fs.existsSync(bannersDir)) {
  fs.mkdirSync(bannersDir, { recursive: true });
}

// 配置存储 - 轮播图
const bannerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, bannersDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'banner-' + uniqueSuffix + ext);
  }
});

// 配置上传 - 轮播图
const uploadBanner = multer({
  storage: bannerStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// 上传轮播图
router.post('/banner', uploadBanner.single('banner'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: '没有上传文件' });
    }
    
    const fileUrl = `/uploads/banners/${req.file.filename}`;
    
    res.json({
      success: true,
      data: {
        url: fileUrl,
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 删除轮播图
router.delete('/banner/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(bannersDir, filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    res.json({ success: true, message: '文件已删除' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== 案例首图上传 ====================

// 确保案例上传目录存在
const casesDir = path.join(__dirname, '..', 'uploads', 'cases');
if (!fs.existsSync(casesDir)) {
  fs.mkdirSync(casesDir, { recursive: true });
}

// 配置存储 - 案例首图
const caseStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, casesDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'case-' + uniqueSuffix + ext);
  }
});

// 配置上传 - 案例首图
const uploadCase = multer({
  storage: caseStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// 上传案例首图
router.post('/case-cover', uploadCase.single('cover'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: '没有上传文件' });
    }
    
    const fileUrl = `/uploads/cases/${req.file.filename}`;
    
    res.json({
      success: true,
      data: {
        url: fileUrl,
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 删除案例首图
router.delete('/case-cover/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(casesDir, filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    res.json({ success: true, message: '文件已删除' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== Logo上传 ====================

// 确保Logo上传目录存在
const logoDir = path.join(__dirname, '..', 'uploads', 'logo');
if (!fs.existsSync(logoDir)) {
  fs.mkdirSync(logoDir, { recursive: true });
}

// 配置存储 - Logo
const logoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, logoDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'logo-' + uniqueSuffix + ext);
  }
});

// 配置上传 - Logo
const uploadLogo = multer({
  storage: logoStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB限制
});

// 上传Logo
router.post('/logo', uploadLogo.single('logo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: '没有上传文件' });
    }
    
    const fileUrl = `/uploads/logo/${req.file.filename}`;
    
    res.json({
      success: true,
      data: {
        url: fileUrl,
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 删除Logo
router.delete('/logo/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(logoDir, filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    res.json({ success: true, message: '文件已删除' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
