-- 华南留学 Web 官网数据库初始化脚本
-- 创建时间: 2026-03-22

USE huananliu;

-- ============================================
-- 1. 学校表 (schools)
-- ============================================
CREATE TABLE IF NOT EXISTS schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name_cn VARCHAR(255) NOT NULL COMMENT '中文名',
    name_en VARCHAR(255) COMMENT '英文名',
    country VARCHAR(50) COMMENT '国家',
    city VARCHAR(50) COMMENT '城市',
    rank INT COMMENT '排名',
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

-- ============================================
-- 2. 顾问表 (consultants)
-- ============================================
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

-- ============================================
-- 3. 成功案例表 (cases)
-- ============================================
CREATE TABLE IF NOT EXISTS cases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL COMMENT '案例标题',
    student_name VARCHAR(50) COMMENT '学生姓名(脱敏)',
    avatar VARCHAR(500) COMMENT '学生头像',
    consultant_id INT COMMENT '顾问ID',
    school_id INT COMMENT '申请学校ID',
    original_school VARCHAR(200) COMMENT '高考/原学校',
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
    INDEX idx_status (status),
    FOREIGN KEY (consultant_id) REFERENCES consultants(id) ON DELETE SET NULL,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='成功案例表';

-- ============================================
-- 4. 新闻表 (news)
-- ============================================
CREATE TABLE IF NOT EXISTS news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL COMMENT '标题',
    cover VARCHAR(500) COMMENT '封面图',
    category VARCHAR(50) COMMENT '分类',
    summary TEXT COMMENT '摘要',
    content TEXT COMMENT '内容(Markdown)',
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

-- ============================================
-- 5. 留言表 (messages)
-- ============================================
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

-- ============================================
-- 6. 轮播图表 (banners)
-- ============================================
CREATE TABLE IF NOT EXISTS banners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL COMMENT '标题',
    image VARCHAR(500) NOT NULL COMMENT '图片 URL',
    link_type VARCHAR(20) COMMENT '链接类型: school/consultant/case/news/url',
    link_id INT COMMENT '链接ID',
    link_url VARCHAR(500) COMMENT '外部链接',
    sort INT DEFAULT 0 COMMENT '排序',
    status TINYINT DEFAULT 1 COMMENT '状态: 0-下架, 1-上架',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_sort (sort),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='轮播图表';

-- ============================================
-- 7. 管理员表 (admins)
-- ============================================
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(255) NOT NULL COMMENT '密码(加密)',
    name VARCHAR(50) COMMENT '姓名',
    role VARCHAR(20) DEFAULT 'admin' COMMENT '角色: super_admin/admin/editor',
    status TINYINT DEFAULT 1 COMMENT '状态: 0-禁用, 1-正常',
    last_login TIMESTAMP NULL COMMENT '最后登录时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理员表';

-- ============================================
-- 8. 插入默认管理员账号
-- 密码: admin123 (bcrypt加密)
-- ============================================
INSERT INTO admins (username, password, name, role) 
VALUES ('admin', '$2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', '系统管理员', 'super_admin')
ON DUPLICATE KEY UPDATE username=username;

-- 更新为实际密码: admin123
UPDATE admins SET password = '$2a$10$rBVk1hP6PQHz3QYKwq3HZuJhGwHzbQvXGx/UXqKqH8hKvXz3QX7yG' WHERE username = 'admin';

-- ============================================
-- 9. 初始化一些示例数据
-- ============================================

-- 示例学校数据
INSERT INTO schools (name_cn, name_en, country, city, rank, description, tuition, status) VALUES
('斯坦福大学', 'Stanford University', '美国', '加利福尼亚州', 2, '世界顶尖的私立研究型大学，位于美国加利福尼亚州斯坦福市。', '¥50-60万/年', 1),
('牛津大学', 'University of Oxford', '英国', '牛津', 1, '世界著名的公立研究型大学，英语世界中最古老的大学。', '£30-40万/年', 1),
('剑桥大学', 'University of Cambridge', '英国', '剑桥', 3, '世界顶尖的公立研究型大学，英语世界中第二古老的大学。', '£30-40万/年', 1),
('清华大学', 'Tsinghua University', '中国', '北京', 15, '中国顶尖的综合型大学，位于北京市。', '¥5-8万/年', 1),
('悉尼大学', 'University of Sydney', '澳大利亚', '悉尼', 42, '澳大利亚历史最悠久的大学，被誉为南半球牛津。', '¥25-35万/年', 1);

-- 示例顾问数据
INSERT INTO consultants (name, title, service_type, region, experience, bio, success_cases, rating, status) VALUES
('张老师', '高级留学顾问', '本科申请', '广州', 8, '从事留学咨询8年，帮助200+学生成功申请到世界名校。', 215, 4.95, 1),
('李老师', '资深留学顾问', '硕士申请', '北京', 5, '专注美国名校申请，擅长文书指导和面试辅导。', 156, 4.88, 1),
('王老师', '留学规划专家', '博士申请', '上海', 10, '前高校教师，对英美澳加留学有丰富经验。', 320, 4.98, 1);

-- 示例新闻数据
INSERT INTO news (title, category, summary, content, author, status) VALUES
('2026年英国留学政策新变化', '留学政策', '英国留学政策有新调整，签证申请流程简化', '# 2026年英国留学政策新变化\n\n近日，英国教育部宣布了2026年留学政策的重大调整...\n\n## 主要变化\n\n1. 签证申请流程简化\n2. 毕业后工签延长\n3. 奖学金名额增加', '编辑部', 1),
('如何选择适合自己的留学国家', '申请攻略', '选择留学国家需要考虑多方面因素', '# 如何选择适合自己的留学国家\n\n选择留学国家是一个重要的决定，需要综合考虑...\n\n## 考虑因素\n\n1. 教育质量\n2. 生活成本\n3. 就业前景\n4. 文化环境', '张老师', 1),
('澳洲八大名校申请指南', '院校动态', '澳洲八大的申请要求和流程详解', '# 澳洲八大名校申请指南\n\n澳洲八大名校是澳大利亚最顶尖的八所大学...\n\n## 学校列表\n\n1. 澳国立大学\n2. 墨尔本大学\n3. 悉尼大学\n4. 昆士兰大学\n...', '李老师', 1);

-- 示例轮播图
INSERT INTO banners (title, image, link_type, sort, status) VALUES
('欢迎咨询', 'https://picsum.photos/1200/400?random=1', 'url', 1, 1),
('热门学校', 'https://picsum.photos/1200/400?random=2', 'school', 2, 1),
('成功案例', 'https://picsum.photos/1200/400?random=3', 'case', 3, 1);

SELECT '数据库初始化完成！' AS result;
