USE huananliu;

-- 插入示例学校
INSERT INTO schools (name_cn, name_en, country, city, `rank`, description, tuition, status) VALUES
('斯坦福大学', 'Stanford University', '美国', '加利福尼亚州', 2, '世界顶尖的私立研究型大学，位于美国加利福尼亚州斯坦福市。', '¥50-60万/年', 1),
('牛津大学', 'University of Oxford', '英国', '牛津', 1, '世界著名的公立研究型大学，英语世界中最古老的大学。', '£30-40万/年', 1),
('剑桥大学', 'University of Cambridge', '英国', '剑桥', 3, '世界顶尖的公立研究型大学，英语世界中第二古老的大学。', '£30-40万/年', 1),
('清华大学', 'Tsinghua University', '中国', '北京', 15, '中国顶尖的综合型大学，位于北京市。', '¥5-8万/年', 1),
('悉尼大学', 'University of Sydney', '澳大利亚', '悉尼', 42, '澳大利亚历史最悠久的大学，被誉为南半球牛津。', '¥25-35万/年', 1);

-- 插入示例顾问
INSERT INTO consultants (name, title, service_type, region, experience, bio, success_cases, rating, status) VALUES
('张老师', '高级留学顾问', '本科申请', '广州', 8, '从事留学咨询8年，帮助200+学生成功申请到世界名校。', 215, 4.95, 1),
('李老师', '资深留学顾问', '硕士申请', '北京', 5, '专注美国名校申请，擅长文书指导和面试辅导。', 156, 4.88, 1),
('王老师', '留学规划专家', '博士申请', '上海', 10, '前高校教师，对英美澳加留学有丰富经验。', 320, 4.98, 1);

-- 插入示例新闻
INSERT INTO news (title, category, summary, content, author, status) VALUES
('2026年英国留学政策新变化', '留学政策', '英国留学政策有新调整，签证申请流程简化', '# 2026年英国留学政策新变化\n\n近日，英国教育部宣布了2026年留学政策的重大调整。\n\n## 主要变化\n\n1. 签证申请流程简化\n2. 毕业后工签延长\n3. 奖学金名额增加', '编辑部', 1),
('如何选择适合自己的留学国家', '申请攻略', '选择留学国家需要考虑多方面因素', '# 如何选择适合自己的留学国家\n\n选择留学国家是一个重要的决定，需要综合考虑多方面因素。\n\n## 考虑因素\n\n1. 教育质量\n2. 生活成本\n3. 就业前景\n4. 文化环境', '张老师', 1),
('澳洲八大名校申请指南', '院校动态', '澳洲八大的申请要求和流程详解', '# 澳洲八大名校申请指南\n\n澳洲八大名校是澳大利亚最顶尖的八所大学。', '李老师', 1);

-- 插入示例轮播图
INSERT INTO banners (title, image, link_type, sort, status) VALUES
('欢迎咨询', 'https://picsum.photos/1200/400?random=1', 'url', 1, 1),
('热门学校', 'https://picsum.photos/1200/400?random=2', 'school', 2, 1),
('成功案例', 'https://picsum.photos/1200/400?random=3', 'case', 3, 1);

-- 插入默认管理员 (密码: admin123)
-- 使用 bcrypt 加密
INSERT INTO admins (username, password, name, role, status) VALUES 
('admin', '$2b$10$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIq.z6a.Jm', '系统管理员', 'super_admin', 1);

SELECT '数据初始化完成!' AS result;
