-- ============================================
-- 华南留学竞赛数据导入
-- 包含主流国际竞赛信息
-- ============================================

-- 数学竞赛
INSERT INTO competitions (slug, name, name_en, category, level, hero_tag, hero_short_desc, overview, eligibility, format, syllabus, scoring, timeline, awards, participants, countries, difficulty_score, recognition, status, sort_order, created_at, updated_at) VALUES 

-- AIME
('aime', 'AIME', 'American Invitational Mathematics Examination', 'math', 'advanced', 'AMC晋级赛', '美国数学邀请赛，通往USAMO/USAJMO的必经之路，藤校高度认可', 
'<p>AIME（American Invitational Mathematics Examination）是美国数学邀请赛，是AMC的晋级赛，也是通往USAMO/USAJMO的必经之路。</p><p>AIME考试特点：</p><ul><li><strong>高难度</strong>：比AMC难度大幅提升，需要深厚的数学功底</li><li><strong>填空题</strong>：15道填空题，答案为0-999的整数</li><li><strong>时间长</strong>：3小时考试时间，考验耐力和思维深度</li></ul>',
'AMC 10前2.5%或AMC 12前5%晋级',
'<p>考试形式：15道填空题，答案为0-999的整数</p><p>考试时间：3小时</p><p>考试语言：英文</p>',
'<p><strong>进阶代数</strong>：复杂方程、不等式、函数方程、数列</p><p><strong>进阶几何</strong>：复杂几何证明、几何变换、圆的性质</p><p><strong>进阶数论</strong>：模运算、费马小定理、欧拉定理、原根</p><p><strong>进阶组合</strong>：递推关系、生成函数、图论、概率</p>',
'满分15分，每题答对得1分，答错或不答得0分。综合AMC 10/12和AIME成绩晋级USAMO/USAJMO。',
'[{"date": "2月", "title": "AIME I考试", "description": "通常在2月初举行"}, {"date": "2月", "title": "AIME II考试", "description": "通常在2月中下旬举行，为无法参加AIME I的学生提供"}, {"date": "3月", "title": "USAMO/USAJMO名单公布", "description": "根据AMC和AIME综合成绩确定晋级名单"}]',
'<p>USAMO/USAJMO晋级：综合AMC 10/12和AIME成绩，达到晋级线可参加美国数学奥林匹克</p><p>AIME高分：AIME 10分以上被认为是高分，对大学申请有重要参考价值</p>',
'3万+', '50+', 9, 'MIT、Caltech等名校高度认可，是申请顶尖大学数学专业的重要参考', 1, 2, NOW(), NOW()),

-- USAMO
('usamo', 'USAMO/USAJMO', 'USA Mathematical Olympiad', 'math', 'advanced', '美国最高级别数学竞赛', '美国数学奥林匹克，美国数学竞赛最高级别，IMO美国队选拔赛',
'<p>USAMO（USA Mathematical Olympiad）是美国数学奥林匹克竞赛，是美国最高级别的中学生数学竞赛。USAJMO是面向10年级及以下学生的少年版。</p><p>竞赛特点：</p><ul><li><strong>证明题</strong>：6道证明题，需要完整的数学证明过程</li><li><strong>两天赛制</strong>：每天4.5小时，3道题目</li><li><strong>极高难度</strong>：需要创造性思维和严谨的数学证明能力</li></ul>',
'AIME成绩达到一定分数线（每年不同，通常AIME 8-10分以上）',
'<p>考试形式：6道证明题，每天3题，两天完成</p><p>考试时间：每天4.5小时，共9小时</p><p>考试语言：英文</p>',
'<p><strong>代数</strong>：多项式、不等式、函数方程、数列</p><p><strong>几何</strong>：综合几何、几何不等式、变换几何</p><p><strong>数论</strong>：整除、同余、二次剩余、不定方程</p><p><strong>组合</strong>：计数、图论、组合几何、概率</p>',
'满分42分，每题7分。根据总分排名，前约60名参加MOP（数学奥林匹克夏令营）。',
'[{"date": "3月", "title": "USAMO/USAJMO考试", "description": "通常在3月下旬举行，为期两天"}, {"date": "4月", "title": "成绩公布", "description": "成绩和获奖名单公布"}, {"date": "6月", "title": "MOP选拔", "description": "约60名学生受邀参加数学奥林匹克夏令营"}]',
'<p>金牌：总分排名前列</p><p>银牌：总分排名前列</p><p>铜牌：总分排名前列</p><p>荣誉奖：表现优异但未获得奖牌的学生</p><p>MOP邀请：约60名学生受邀参加数学奥林匹克夏令营，从中选拔IMO美国队</p>',
'300+', '1', 10, '美国大学最高认可度数学竞赛，IMO美国队选拔赛', 1, 3, NOW(), NOW()),

-- BMO
('bmo', 'BMO', 'British Mathematical Olympiad', 'math', 'advanced', '英国数学奥赛', '英国数学奥林匹克，英国最高级别数学竞赛，IMO英国队选拔赛',
'<p>BMO（British Mathematical Olympiad）是英国数学奥林匹克竞赛，是英国最高级别的中学生数学竞赛，为IMO选拔英国国家队。</p><p>BMO分为两轮：</p><ul><li><strong>BMO1</strong>：第一轮，3.5小时，6道证明题</li><li><strong>BMO2</strong>：第二轮，约100名BMO1高分选手参加，3.5小时，4道证明题</li></ul>',
'BMO1：UKMT Senior Challenge高分选手或学校推荐；BMO2：BMO1高分选手',
'<p>BMO1：6道证明题，3.5小时</p><p>BMO2：4道证明题，3.5小时</p><p>考试语言：英文</p>',
'<p><strong>代数</strong>：方程、不等式、数列、多项式</p><p><strong>几何</strong>：欧几里得几何、圆、三角形</p><p><strong>数论</strong>：整除、质数、同余</p><p><strong>组合</strong>：计数、图论</p>',
'每题10分，BMO1满分60分，BMO2满分40分。根据成绩颁发奖牌并选拔IMO英国队。',
'[{"date": "11月", "title": "BMO1考试", "description": "通常在11月下旬举行"}, {"date": "1月", "title": "BMO2考试", "description": "约100名BMO1高分选手参加"}, {"date": "6月", "title": "IMO选拔", "description": "从BMO2高分选手中选拔IMO英国队"}]',
'<p>BMO1：金牌（前20名）、银牌（21-50名）、铜牌（51-100名）</p><p>BMO2：根据成绩颁发证书和奖牌</p><p>IMO英国队：从BMO2高分选手中选拔</p>',
'1,000+', '1', 9, '英国G5名校高度认可，IMO英国队选拔赛', 1, 4, NOW(), NOW()),

-- HiMCM
('himcm', 'HiMCM/MidMCM', 'High School Mathematical Contest in Modeling', 'math', 'intermediate', '数学建模竞赛', '美国高中生数学建模竞赛，团队协作解决实际问题',
'<p>HiMCM（High School Mathematical Contest in Modeling）是美国高中生数学建模竞赛，MidMCM是面向初中生的版本。</p><p>竞赛特点：</p><ul><li><strong>团队协作</strong>：1-4人组队，共同完成建模论文</li><li><strong>实际问题</strong>：解决现实生活中的实际问题</li><li><strong>论文写作</strong>：提交完整的数学建模论文</li><li><strong>时间紧凑</strong>：36小时内完成</li></ul>',
'HiMCM：高中生；MidMCM：初中生',
'<p>竞赛形式：团队赛（1-4人），选择一道题目进行数学建模</p><p>竞赛时间：36小时</p><p>提交成果：数学建模论文（英文）</p>',
'<p>竞赛提供两道题目供选择：</p><p><strong>连续型问题</strong>：涉及连续数学，如微积分、微分方程等</p><p><strong>离散型问题</strong>：涉及离散数学，如组合、图论、优化等</p>',
'论文评分：根据假设合理性、模型创新性、结果正确性、论文写作质量等维度评分。',
'[{"date": "11月", "title": "HiMCM竞赛", "description": "通常在11月初举行"}, {"date": "1月", "title": "成绩公布", "description": "评审结果公布"}]',
'<p>Outstanding（特等奖）：前1%</p><p>Finalist（特等奖提名）：前7%</p><p>Meritorious（一等奖）：前15%</p><p>Honorable Mention（二等奖）：前30%</p><p>Successful Participant（成功参与）：完成论文并提交</p>',
'3,000+', '40+', 7, '美国大学高度认可，体现团队协作和实际问题解决能力', 1, 5, NOW(), NOW()),

-- Euclid
('euclid', 'Euclid', 'Euclid Mathematics Contest', 'math', 'intermediate', '加拿大数学竞赛', '欧几里得数学竞赛，加拿大滑铁卢大学主办，申请滑铁卢大学重要参考',
'<p>欧几里得数学竞赛（Euclid Mathematics Contest）由加拿大滑铁卢大学主办，是加拿大最具影响力的数学竞赛之一。</p><p>竞赛特点：</p><ul><li><strong>全英文考试</strong>：题目和答题均为英文</li><li><strong>解答题为主</strong>：10道题目，部分只需答案，部分需要完整解答</li><li><strong>难度递进</strong>：题目难度从易到难，适合各水平学生</li></ul>',
'高中在读学生，主要是12年级学生',
'<p>考试形式：10道解答题，部分只需答案，部分需要完整解答过程</p><p>考试时间：2.5小时</p><p>考试语言：英文</p><p>总分：100分</p>',
'<p><strong>代数</strong>：方程、函数、数列、对数</p><p><strong>几何</strong>：解析几何、三角学、圆</p><p><strong>组合</strong>：计数原理、概率</p><p><strong>其他</strong>：复数、多项式</p>',
'满分100分。前25%获得Certificate of Distinction证书。',
'[{"date": "4月", "title": "Euclid考试", "description": "通常在4月举行"}, {"date": "5月", "title": "成绩公布", "description": "成绩和获奖名单公布"}]',
'<p>Certificate of Distinction：前25%</p><p>Contest Medal：每所学校最高分获得者</p><p>Honour Roll：高分名单公布</p><p>滑铁卢大学奖学金：高分学生申请滑铁卢大学时有机会获得奖学金</p>',
'2万+', '60+', 6, '申请滑铁卢大学及加拿大名校的重要参考，高分可获得奖学金', 1, 6, NOW(), NOW());

-- 物理竞赛
INSERT INTO competitions (slug, name, name_en, category, level, hero_tag, hero_short_desc, overview, eligibility, format, syllabus, scoring, timeline, awards, participants, countries, difficulty_score, recognition, status, sort_order, created_at, updated_at) VALUES 

-- F=ma
('f-ma', 'F=ma', 'F=ma Physics Competition', 'physics', 'advanced', '物理奥赛初赛', '美国物理奥赛初赛，通往USAPhO的必经之路',
'<p>F=ma是美国物理奥赛（USAPhO）的初赛，由美国物理教师协会（AAPT）主办。</p><p>竞赛特点：</p><ul><li><strong>资格赛</strong>：USAPhO的选拔赛</li><li><strong>选择题</strong>：75分钟内完成25道选择题</li><li><strong>仅限美国学生</strong>：美国公民或永久居民</li></ul>',
'美国公民或永久居民，高中生',
'<p>考试形式：25道选择题</p><p>考试时间：75分钟</p><p>考试语言：英文</p>',
'<p><strong>力学</strong>：运动学、牛顿定律、能量、动量、转动</p><p><strong>电磁学</strong>：电场、磁场、电路</p>',
'满分未知（原始分转换为标准分）。前约400名晋级USAPhO。',
'[{"date": "2月", "title": "F=ma考试", "description": "通常在2月举行"}, {"date": "3月", "title": "USAPhO名单公布", "description": "公布晋级USAPhO的名单"}]',
'<p>USAPhO晋级：前约400名晋级美国物理奥林匹克</p>',
'5,000+', '1', 7, '美国物理奥赛选拔赛，仅限美国公民或永久居民', 1, 7, NOW(), NOW()),

-- USAPhO
('usapho', 'USAPhO', 'USA Physics Olympiad', 'physics', 'advanced', '美国物理奥赛', '美国物理奥林匹克，美国最高级别物理竞赛，IPHO美国队选拔赛',
'<p>USAPhO（USA Physics Olympiad）是美国物理奥林匹克竞赛，是美国最高级别的中学生物理竞赛。</p><p>竞赛特点：</p><ul><li><strong>两部分考试</strong>：Part A和Part B</li><li><strong>难度极高</strong>：需要深厚的物理功底和解题能力</li><li><strong>仅限美国学生</strong>：美国公民或永久居民</li></ul>',
'F=ma高分选手（前约400名），美国公民或永久居民',
'<p>考试形式：两部分考试（Part A和Part B）</p><p>考试时间：每部分2小时</p><p>考试语言：英文</p>',
'<p><strong>力学</strong>：运动学、牛顿定律、能量、动量、转动、流体力学</p><p><strong>电磁学</strong>：静电学、电路、磁场、电磁感应</p><p><strong>热力学</strong>：温度、热量、热力学定律</p><p><strong>波动与光学</strong>：机械波、几何光学、物理光学</p><p><strong>现代物理</strong>：狭义相对论、原子物理、核物理</p>',
'根据两部分考试总分排名，前约20名参加Physics Camp（物理夏令营）。',
'[{"date": "3月", "title": "USAPhO考试", "description": "通常在3月下旬举行"}, {"date": "5月", "title": "Physics Camp", "description": "前约20名学生参加物理夏令营，选拔IPHO美国队"}]',
'<p>金牌：总分排名前列</p><p>银牌：总分排名前列</p><p>铜牌：总分排名前列</p><p>Physics Camp邀请：前约20名参加物理夏令营</p><p>IPHO美国队：从Physics Camp中选拔5人代表美国参加国际物理奥赛</p>',
'400', '1', 10, '美国最高级别物理竞赛，IPHO美国队选拔赛', 1, 8, NOW(), NOW()),

-- BPhO
('bpho', 'BPhO', 'British Physics Olympiad', 'physics', 'advanced', '英国物理奥赛', '英国物理奥林匹克，英国最高级别物理竞赛，IPHO英国队选拔赛',
'<p>BPhO（British Physics Olympiad）是英国物理奥林匹克竞赛，是英国最高级别的中学生物理竞赛。</p><p>竞赛分为多轮：</p><ul><li><strong>Round 1</strong>：初赛，约2小时40分钟，Section A和Section B</li><li><strong>Round 2</strong>：约50名Round 1高分选手参加</li></ul>',
'高中生，Round 2仅限Round 1高分选手',
'<p>Round 1：约2小时40分钟，Section A（约10道短答题）和Section B（约2道长答题）</p><p>Round 2：约3小时，4道长答题</p>',
'<p><strong>力学</strong>：运动学、牛顿定律、能量、动量、转动、万有引力</p><p><strong>电磁学</strong>：静电学、电路、磁场</p><p><strong>热力学</strong>：温度、热量、气体定律</p><p><strong>波动与光学</strong>：机械波、光学</p><p><strong>现代物理</strong>：原子物理、核物理</p>',
'Round 1前50名左右晋级Round 2，Round 2表现优异者入选IPHO英国队。',
'[{"date": "11月", "title": "BPhO Round 1", "description": "通常在11月举行"}, {"date": "1月", "title": "BPhO Round 2", "description": "约50名高分选手参加"}, {"date": "5月", "title": "IPHO选拔", "description": "从Round 2选手中选拔IPHO英国队"}]',
'<p>Round 1：Top Gold、Gold、Silver、Bronze</p><p>Round 2：根据成绩颁发证书</p><p>IPHO英国队：代表英国参加国际物理奥赛</p>',
'3,000+', '1', 9, '英国G5名校高度认可，IPHO英国队选拔赛', 1, 9, NOW(), NOW()),

-- CAP
('cap', 'CAP', 'Canadian Association of Physicists Prize', 'physics', 'intermediate', '加拿大物理竞赛', '加拿大物理奥林匹克竞赛，加拿大最高级别物理竞赛',
'<p>CAP（Canadian Association of Physicists Prize Exam）是加拿大物理奥林匹克竞赛，由加拿大物理协会主办。</p>',
'高中生',
'<p>考试形式：选择题和解答题</p><p>考试时间：3小时</p><p>考试语言：英文</p>',
'<p><strong>力学</strong>：运动学、牛顿定律、能量、动量</p><p><strong>电磁学</strong>：静电学、电路、磁场</p><p><strong>热力学</strong>：温度、热量、热力学定律</p><p><strong>现代物理</strong>：原子物理、核物理</p>',
'根据成绩颁发奖牌，高分者有机会代表加拿大参加IPHO。',
'[{"date": "4月", "title": "CAP考试", "description": "通常在4月举行"}, {"date": "5月", "title": "成绩公布", "description": "成绩和获奖名单公布"}]',
'<p>金牌：前5%</p><p>银牌：前15%</p><p>铜牌：前30%</p>',
'1,000+', '1', 7, '加拿大名校认可，IPHO加拿大队选拔赛', 1, 10, NOW(), NOW());

-- 生物竞赛
INSERT INTO competitions (slug, name, name_en, category, level, hero_tag, hero_short_desc, overview, eligibility, format, syllabus, scoring, timeline, awards, participants, countries, difficulty_score, recognition, status, sort_order, created_at, updated_at) VALUES 

-- USABO
('usabo', 'USABO', 'USA Biology Olympiad', 'biology', 'advanced', '美国生物奥赛', '美国生物奥林匹克，美国最高级别生物竞赛，IBO美国队选拔赛',
'<p>USABO（USA Biology Olympiad）是美国生物奥林匹克竞赛，是美国最高级别的中学生生物竞赛。</p><p>竞赛分为三轮：</p><ul><li><strong>Open Exam</strong>：初赛，50道选择题，50分钟</li><li><strong>Semifinal</strong>：理论+实验（受邀参加）</li><li><strong>National Finals</strong>：理论+实验+综合</li></ul>',
'高中生，Semifinal仅限Open Exam高分选手',
'<p>Open Exam：50道选择题，50分钟</p><p>Semifinal：理论+实验</p><p>National Finals：理论+实验+综合</p>',
'<p><strong>细胞生物学</strong>：细胞结构、代谢、酶、细胞信号传导</p><p><strong>遗传学</strong>：DNA复制、转录翻译、遗传规律、基因工程</p><p><strong>生态学</strong>：生态系统、种群动态、生物多样性</p><p><strong>生理学</strong>：植物和动物生理系统</p><p><strong>进化论</strong>：自然选择、物种形成</p>',
'Open Exam前约500名进入Semifinal，Semifinal前20名进入National Finals。',
'[{"date": "2月", "title": "Open Exam", "description": "通常在2月举行"}, {"date": "3月", "title": "Semifinal", "description": "约500名高分选手参加"}, {"date": "5月", "title": "National Finals", "description": "前20名参加，选拔IBO美国队"}]',
'<p>金牌：National Finals表现优异</p><p>银牌：National Finals表现优异</p><p>铜牌：National Finals表现优异</p><p>IBO美国队：选拔4人代表美国参加国际生物奥赛</p>',
'10,000+', '1', 9, '美国最高级别生物竞赛，IBO美国队选拔赛', 1, 11, NOW(), NOW()),

-- BBO
('bbo', 'BBO', 'British Biology Olympiad', 'biology', 'advanced', '英国生物奥赛', '英国生物奥林匹克，英国最高级别生物竞赛，IBO英国队选拔赛',
'<p>BBO（British Biology Olympiad）是英国生物奥林匹克竞赛，由英国皇家生物学会（RSB）主办，是英国中学科学类最具影响力的竞赛之一。</p>',
'高中生',
'<p>考试时长：90分钟</p><p>题型：选择题、填空题、排序题等</p><p>语言：英文</p>',
'<p><strong>细胞生物学</strong>：细胞结构、代谢、酶学</p><p><strong>分子生物学</strong>：DNA、RNA、蛋白质合成</p><p><strong>植物学</strong>：植物结构、生理、发育</p><p><strong>动物学</strong>：动物生理、行为、进化</p><p><strong>生态学</strong>：生态系统、生物多样性</p>',
'前5%获金牌，前10%获银牌，前15%获铜牌。表现优异者可入选IBO英国队。',
'[{"date": "4月", "title": "BBO考试", "description": "通常在4月举行"}, {"date": "6月", "title": "IBO选拔", "description": "从高分选手中选拔IBO英国队"}]',
'<p>金牌：前5%</p><p>银牌：前10%</p><p>铜牌：前15%</p><p>IBO英国队：代表英国参加国际生物奥赛</p>',
'8,000+', '1', 8, '英国G5名校高度认可，IBO英国队选拔赛', 1, 12, NOW(), NOW()),

-- Brain Bee
('brain-bee', 'Brain Bee', 'International Brain Bee', 'biology', 'intermediate', '脑科学大赛', '脑科学大赛，神经科学领域入门级竞赛',
'<p>Brain Bee脑科学大赛是一项面向全球青少年的神经科学竞赛，旨在激发学生对脑科学的兴趣。</p><p>竞赛级别：</p><ul><li><strong>地区赛</strong>：笔试</li><li><strong>全国赛</strong>：笔试+标本识别+临床诊断</li><li><strong>国际赛</strong>：综合考核</li></ul>',
'对脑科学感兴趣的中学生，分Junior（9年级以下）和Senior组',
'<p>地区赛：笔试</p><p>全国赛：笔试+标本识别+临床诊断</p><p>国际赛：综合考核</p>',
'<p><strong>神经解剖</strong>：脑结构、功能分区、神经网络</p><p><strong>神经生理</strong>：神经元、突触、神经递质</p><p><strong>脑疾病</strong>：阿尔茨海默、帕金森等</p><p><strong>脑研究技术</strong>：脑成像、电生理等</p>',
'地区赛前几名晋级全国赛，全国赛冠军参加国际赛。',
'[{"date": "1-2月", "title": "地区赛", "description": "各地区举行"}, {"date": "3月", "title": "全国赛", "description": "通常在3月举行"}, {"date": "8月", "title": "国际赛", "description": "全球总决赛"}]',
'<p>地区赛：一、二、三等奖</p><p>全国赛：一、二、三等奖，冠军参加国际赛</p><p>国际赛：全球排名</p>',
'5,000+', '50+', 6, '神经科学领域入门竞赛，适合对脑科学感兴趣的学生', 1, 13, NOW(), NOW()),

-- HOSA
('hosa', 'HOSA', 'HOSA-Future Health Professionals', 'biology', 'intermediate', '生物健康挑战', '生物与健康领袖挑战，健康医疗领域竞赛',
'<p>HOSA（HOSA-Future Health Professionals）是生物与健康领袖挑战，面向对健康医疗领域感兴趣的学生。</p>',
'对生物、健康、医疗感兴趣的中学生',
'<p>包括多个项目类别：生物学科竞赛、健康科学竞赛、领导力竞赛、急救技能竞赛等</p>',
'<p><strong>生物学科</strong>：解剖学、生理学、病理学</p><p><strong>健康科学</strong>：营养学、公共卫生、心理健康</p><p><strong>专业技能</strong>：急救、CPR、医疗术语</p>',
'根据各项目评分标准评分，分区域赛、州赛、全国赛。',
'[{"date": "12月-3月", "title": "区域/州赛", "description": "各区域/州举行"}, {"date": "6月", "title": "全国赛", "description": "全国总决赛"}]',
'<p>区域/州赛：各奖项</p><p>全国赛：金牌、银牌、铜牌</p>',
'10,000+', '1', 5, '健康医疗领域知名竞赛，适合未来想从事医疗行业的学生', 1, 14, NOW(), NOW());

-- 计算机竞赛
INSERT INTO competitions (slug, name, name_en, category, level, hero_tag, hero_short_desc, overview, eligibility, format, syllabus, scoring, timeline, awards, participants, countries, difficulty_score, recognition, status, sort_order, created_at, updated_at) VALUES 

-- USACO
('usaco', 'USACO', 'USA Computing Olympiad', 'computer', 'advanced', '美国信息学奥赛', '美国计算机奥林匹克竞赛，美国最高级别信息学竞赛，IOI美国队选拔赛',
'<p>USACO（USA Computing Olympiad）是美国计算机奥林匹克竞赛，是美国最具权威性的中学生计算机编程竞赛。</p><p>竞赛级别：</p><ul><li><strong>铜组（Bronze）</strong>：入门级</li><li><strong>银组（Silver）</strong>：中级</li><li><strong>金组（Gold）</strong>：高级</li><li><strong>铂金组（Platinum）</strong>：顶级</li></ul>',
'全球中学生，不限国籍',
'<p>在线比赛，每年4-6次月赛</p><p>每场比赛3-4小时，3-4道算法题</p><p>支持C++、Java、Python等语言</p>',
'<p><strong>算法与数据结构</strong>：排序、搜索、图论、动态规划、数据结构</p><p><strong>编程语言</strong>：C++、Java、Python</p><p><strong>问题求解</strong>：建模、优化、复杂度分析</p>',
'满分1000分，达到晋级线可晋级下一级别。',
'[{"date": "12月-3月", "title": "月赛", "description": "每月一场，共4-6场"}, {"date": "5月", "title": "US Open", "description": "美国公开赛"}, {"date": "6月", "title": "训练营选拔", "description": "选拔IOI美国队训练营成员"}]',
'<p>各级别（铜/银/金/铂金）分别排名</p><p>铂金组高分者可入选IOI美国队训练营</p><p>IOI美国队：从训练营中选拔4人</p>',
'10,000+', '80+', 9, '计算机领域最权威竞赛，铂金组选手备受顶尖大学青睐', 1, 15, NOW(), NOW()),

-- NOIP
('noip', 'NOIP/CSP-J/S', 'National Olympiad in Informatics in Provinces', 'computer', 'advanced', '全国信息学联赛', '中国全国青少年信息学奥林匹克联赛，NOI选拔赛',
'<p>NOIP（National Olympiad in Informatics in Provinces）是中国全国青少年信息学奥林匹克联赛，现更名为CSP-J/S（非专业级软件能力认证）。</p>',
'中国中学生',
'<p>CSP-J（入门级）/ CSP-S（提高级）</p><p>初赛：笔试</p><p>复赛：上机编程</p>',
'<p><strong>算法</strong>：模拟、贪心、分治、搜索、动态规划</p><p><strong>数据结构</strong>：数组、链表、栈、队列、树、图</p><p><strong>编程语言</strong>：C++</p>',
'根据初赛和复赛成绩，高分者可参加NOI省选。',
'[{"date": "9月", "title": "CSP初赛", "description": "笔试"}, {"date": "10月", "title": "CSP复赛", "description": "上机编程"}, {"date": "次年4月", "title": "省选", "description": "省队选拔赛"}]',
'<p>一、二、三等奖</p><p>省队：选拔进入省队参加NOI</p>',
'5万+', '1', 8, '中国信息学奥赛体系，NOI选拔赛', 1, 16, NOW(), NOW());

-- 商科竞赛
INSERT INTO competitions (slug, name, name_en, category, level, hero_tag, hero_short_desc, overview, eligibility, format, syllabus, scoring, timeline, awards, participants, countries, difficulty_score, recognition, status, sort_order, created_at, updated_at) VALUES 

-- NEC
('nec', 'NEC', 'National Economics Challenge', 'business', 'intermediate', '全美经济学挑战', '全美经济学挑战赛，美国最具影响力的高中生经济学竞赛',
'<p>NEC（National Economics Challenge）是全美经济学挑战赛，由美国经济教育学会（CEE）主办，是美国最具影响力的高中生经济学竞赛。</p><p>竞赛组别：</p><ul><li><strong>Pre Division</strong>：入门组，无经济学背景要求</li><li><strong>David Ricardo Division</strong>：初级组，学过1-2学期经济学</li><li><strong>Adam Smith Division</strong>：高级组，学过AP/IB经济学</li></ul>',
'对经济学感兴趣的高中生',
'<p>团队赛（3-4人）</p><p>包括：经济学测评（笔试）、案例大分析、经济学超级碗</p>',
'<p><strong>微观经济学</strong>：供求、市场结构、消费者理论、生产者理论</p><p><strong>宏观经济学</strong>：GDP、通胀、货币政策、财政政策、国际贸易</p><p><strong>国际经济</strong>：汇率、贸易政策、全球化</p><p><strong>时事经济</strong>：当前经济热点分析</p>',
'各环节分别评分，综合评定。中国区前30%晋级全球站。',
'[{"date": "12月", "title": "区域站", "description": "经济学测评"}, {"date": "3月", "title": "中国站", "description": "案例大分析、经济学超级碗"}, {"date": "5月", "title": "全球站", "description": "纽约全球总决赛"}]',
'<p>区域站：金、银、铜奖</p><p>中国站：金、银、铜奖，单项奖</p><p>全球站：全球排名，团队奖</p>',
'1万+', '30+', 6, '经济学领域最知名竞赛，沃顿商学院高度认可', 1, 17, NOW(), NOW()),

-- IEO
('ieo', 'IEO', 'International Economics Olympiad', 'business', 'advanced', '国际经济学奥赛', '国际经济学奥林匹克，经济学领域顶级竞赛',
'<p>IEO（International Economics Olympiad）是国际经济学奥林匹克，是经济学领域最高级别的国际竞赛。</p>',
'对经济学感兴趣的高中生',
'<p>个人赛+团队赛</p><p>包括：经济学理论、财务知识、商业案例分析</p>',
'<p><strong>微观经济学</strong>：消费者理论、生产者理论、市场结构</p><p><strong>宏观经济学</strong>：GDP、通胀、货币政策、财政政策</p><p><strong>财务知识</strong>：财务报表、投资分析</p><p><strong>商业案例</strong>：商业分析、战略规划</p>',
'个人成绩和团队成绩分别排名。',
'[{"date": "3-4月", "title": "中国站", "description": "中国区选拔赛"}, {"date": "7-8月", "title": "国际赛", "description": "全球总决赛"}]',
'<p>中国站：金、银、铜奖</p><p>国际赛：个人奖、团队奖</p>',
'5,000+', '40+', 8, '经济学领域顶级国际竞赛', 1, 18, NOW(), NOW()),

-- FBLA
('fbla', 'FBLA', 'Future Business Leaders of America', 'business', 'intermediate', '未来商业领袖', '未来商业领袖挑战，美国知名商科竞赛',
'<p>FBLA（Future Business Leaders of America）是未来商业领袖挑战，是美国最大的学生商业组织之一。</p>',
'对商业感兴趣的中学生',
'<p>包括多个项目类别：商业计划、市场营销、会计、财务、公共演讲、计算机应用等</p>',
'<p><strong>商业管理</strong>：管理原理、人力资源</p><p><strong>市场营销</strong>：市场分析、营销策略</p><p><strong>财务会计</strong>：会计原理、财务报表</p><p><strong>信息技术</strong>：网络安全、编程、数据库</p>',
'根据各项目评分标准评分。',
'[{"date": "1-2月", "title": "区域赛", "description": "各区域预选赛"}, {"date": "4-5月", "title": "全国赛", "description": "美国全国总决赛"}]',
'<p>区域赛：各奖项</p><p>全国赛：金牌、银牌、铜牌</p>',
'2万+', '1', 5, '美国知名商科竞赛，培养商业领导力', 1, 19, NOW(), NOW()),

-- KWHS
('kwhs', 'KWHS', 'K Wharton High School Investment Competition', 'business', 'intermediate', '沃顿投资竞赛', '沃顿商业投资竞赛，沃顿商学院主办，投资领域顶级竞赛',
'<p>KWHS（Knowledge @ Wharton High School Investment Competition）是沃顿商业投资竞赛，由宾夕法尼亚大学沃顿商学院主办。</p><p>竞赛特点：</p><ul><li><strong>团队赛</strong>：4-7人组队</li><li><strong>模拟投资</strong>：使用沃顿商学院模拟交易平台</li><li><strong>长期投资</strong>：10周时间，管理10万美元虚拟资金</li><li><strong>策略报告</strong>：提交投资策略报告</li></ul>',
'全球9-12年级学生，4-7人组队',
'<p>团队赛（4-7人）</p><p>10周时间使用沃顿商学院模拟交易平台管理10万美元虚拟资金</p><p>提交中期报告和最终投资策略报告</p>',
'<p><strong>投资分析</strong>：股票分析、行业研究、宏观经济分析</p><p><strong>资产配置</strong>：多元化投资、风险管理</p><p><strong>策略制定</strong>：投资策略、交易逻辑</p><p><strong>报告撰写</strong>：商业写作、演示技巧</p>',
'根据投资策略的合理性、创新性、风险控制等维度评分，不只看收益率。',
'[{"date": "9月", "title": "注册开始", "description": "团队注册"}, {"date": "9-12月", "title": "交易阶段", "description": "10周模拟交易"}, {"date": "12月", "title": "报告提交", "description": "提交最终投资策略报告"}, {"date": "次年4月", "title": "全球总决赛", "description": "沃顿商学院现场决赛"}]',
'<p>全球半决赛：约50支队伍</p><p>全球总决赛：约10支队伍（受邀到沃顿商学院）</p>',
'5,000+', '60+', 7, '沃顿商学院主办，投资领域顶级竞赛，对申请商科专业有重要参考价值', 1, 20, NOW(), NOW());
