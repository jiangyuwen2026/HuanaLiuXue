-- 华南留学 Web 官网数据库初始化脚本
USE huananliu;

-- 1. 学校表
CREATE TABLE IF NOT EXISTS schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name_cn VARCHAR(255) NOT NULL COMMENT '中文名',
    name_en VARCHAR(255) COMMENT '英文名',
    country VARCHAR(50) COMMENT '国家',
    city VARCHAR(50) COMMENT '城市',
    `rank` INT COMMENT '排名',
    logo VARCHAR(500) COMMENT 'logo URL',
    banner VARCHAR(500) COMMENT 'banner URL',
    description TEXT COMMENT '简介',
    features JSON COMMENT '优势专业',
    requirements JSON COMMENT '申请要求',
    tuition VARCHAR(100) COMMENT '学费范围',
    website VARCHAR(500) COMMENT '官网链接',
    status TINYINT DEFAULT 1 COMMENT '状态: 0-下架, 1-上架',
    view_count INT DEFAULT 0 COMMENT '浏览量',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_country (country),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学校表';

-- 2. 顾问表
CREATE TABLE IF NOT EXISTS consultants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL COMMENT '姓名',
    avatar VARCHAR(500) COMMENT '头像 URL',
    title VARCHAR(100) COMMENT '职位',
    service_type VARCHAR(50) COMMENT '服务类型',
    region VARCHAR(50) COMMENT '地区',
    experience INT COMMENT '从业年限',
    education VARCHAR(200) COMMENT '教育背景',
    specialties JSON COMMENT '专长领域',
    bio TEXT COMMENT '个人简介',
    success_cases INT DEFAULT 0 COMMENT '成功案例数',
    rating DECIMAL(3,2) DEFAULT 5.00 COMMENT '评分',
    status TINYINT DEFAULT 1 COMMENT '状态: 0-下架, 1-上架',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_service_type (service_type),
    INDEX idx_region (region),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='顾问表';

-- 3. 成功案例表
CREATE TABLE IF NOT EXISTS cases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL COMMENT '案例标题',
    student_name VARCHAR(50) COMMENT '学生姓名',
    avatar VARCHAR(500) COMMENT '学生头像',
    consultant_id INT COMMENT '顾问ID',
    school_id INT COMMENT '申请学校ID',
    original_school VARCHAR(200) COMMENT '原学校',
    target_country VARCHAR(50) COMMENT '目标国家',
    target_major VARCHAR(200) COMMENT '目标专业',
    admission_result VARCHAR(200) COMMENT '录取结果',
    scholarship VARCHAR(100) COMMENT '奖学金',
    story TEXT COMMENT '申请故事',
    images JSON COMMENT '相关图片',
    status TINYINT DEFAULT 1 COMMENT '状态: 0-下架, 1-上架',
    view_count INT DEFAULT 0 COMMENT '浏览量',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_consultant_id (consultant_id),
    INDEX idx_school_id (school_id),
    INDEX idx_target_country (target_country),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='成功案例表';

-- 4. 新闻表
CREATE TABLE IF NOT EXISTS news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL COMMENT '标题',
    cover VARCHAR(500) COMMENT '封面图',
    category VARCHAR(50) COMMENT '分类',
    summary TEXT COMMENT '摘要',
    content TEXT COMMENT '内容',
    author VARCHAR(50) COMMENT '作者',
    source VARCHAR(100) COMMENT '来源',
    tags JSON COMMENT '标签',
    status TINYINT DEFAULT 1 COMMENT '状态: 0-下架, 1-上架',
    view_count INT DEFAULT 0 COMMENT '浏览量',
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '发布时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_published_at (published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='新闻表';

-- 5. 留言表
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL COMMENT '姓名',
    phone VARCHAR(20) COMMENT '电话',
    email VARCHAR(100) COMMENT '邮箱',
    country VARCHAR(50) COMMENT '意向国家',
    message TEXT NOT NULL COMMENT '留言内容',
    status TINYINT DEFAULT 0 COMMENT '状态: 0-未处理, 1-已处理',
    remark TEXT COMMENT '备注',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='留言表';

-- 6. 轮播图表
CREATE TABLE IF NOT EXISTS banners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL COMMENT '标题',
    image VARCHAR(500) NOT NULL COMMENT '图片 URL',
    link_type VARCHAR(20) COMMENT '链接类型',
    link_id INT COMMENT '链接ID',
    link_url VARCHAR(500) COMMENT '外部链接',
    sort INT DEFAULT 0 COMMENT '排序',
    status TINYINT DEFAULT 1 COMMENT '状态: 0-下架, 1-上架',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_sort (sort),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='轮播图表';

-- 7. 管理员表
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(255) NOT NULL COMMENT '密码',
    name VARCHAR(50) COMMENT '姓名',
    role VARCHAR(20) DEFAULT 'admin' COMMENT '角色',
    status TINYINT DEFAULT 1 COMMENT '状态',
    last_login TIMESTAMP NULL COMMENT '最后登录时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理员表';
