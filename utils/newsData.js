/**
 * 2025-2026年留学咨询数据
 * 包含香港、新加坡主要大学及地区的最新留学政策、申请时间、要求等资讯
 */

const newsData = {
  // 2025年申请季资讯
  '2025': [
    // 香港地区
    {
      id: 'HK2025001',
      year: '2025',
      semester: '秋季',
      category: '申请时间',
      country: '香港',
      university: '香港大学',
      title: '香港大学2025年秋季入学硕士申请时间表',
      summary: '港大2025年秋季入学申请通道已于2024年9月1日正式开放，首轮申请截止日期为2024年11月15日，热门专业建议尽早申请。',
      coverImage: 'https://picsum.photos/seed/hku2025/220/180',
      publishTime: '2024-09-05',
      views: 2345,
      author: '留学顾问团队',
      tags: ['申请时间', '硕士', '2025秋季'],
      content: `
<h2>香港大学2025年秋季入学申请时间表</h2>

<h3>一、申请开放时间</h3>
<p><strong>主申请通道开放：</strong>2024年9月1日</p>
<p><strong>首轮申请截止：</strong>2024年11月15日（建议在此日期前提交）</p>
<p><strong>常规申请截止：</strong>2025年1月31日</p>
<p><strong>延后申请截止：</strong>2025年3月31日（视专业而定）</p>

<h3>二、热门专业申请节点</h3>
<table>
<tr><th>专业</th><th>申请截止</th><th>建议提交时间</th></tr>
<tr><td>金融硕士</td><td>2025年1月31日</td><td>2024年11月15日前</td></tr>
<tr><td>商业分析</td><td>2025年1月31日</td><td>2024年11月15日前</td></tr>
<tr><td>计算机科学</td><td>2025年2月28日</td><td>2024年12月31日前</td></tr>
<tr><td>法学硕士</td><td>2025年1月15日</td><td>2024年11月30日前</td></tr>
</table>

<h3>三、语言成绩要求</h3>
<p><strong>雅思：</strong>6.5（小分不低于6.0）</p>
<p><strong>托福：</strong>80（小分不低于20）</p>
<p>部分专业要求更高，如法学院要求雅思7.0+</p>

<h3>四、申请材料清单</h3>
<ul>
<li>中英文成绩单（需学校盖章）</li>
<li>学位证/在读证明</li>
<li>两封推荐信（至少一封来自导师）</li>
<li>个人陈述（500-1000字）</li>
<li>简历</li>
<li>语言成绩单（IELTS/TOEFL）</li>
<li>GMAT/GRE成绩（商科/工程类）</li>
</ul>

<h3>五、申请建议</h3>
<p>1. 尽早准备语言成绩，建议在申请前3个月考取达标成绩</p>
<p>2. 提前联系推荐人，预留充足时间撰写推荐信</p>
<p>3. 热门专业竞争激烈，建议在首轮申请前提交</p>
<p>4. 面试环节：部分专业需要面试，提前准备常见问题</p>

<h3>六、最新政策变化</h3>
<p>✨ 新增：数据科学硕士专业</p>
<p>✨ 调整：商学院部分专业增加视频面试环节</p>
<p>✨ 更新：工程学部引入新的奖学金项目</p>
      `,
      relatedArticles: ['HK2025002', 'HK2025003', 'SG2025001']
    },
    {
      id: 'HK2025002',
      year: '2025',
      semester: '秋季',
      category: '申请要求',
      country: '香港',
      university: '香港中文大学',
      title: '香港中文大学2025年硕士申请要求更新',
      summary: '中大2025年申请要求有新变化，新增多个交叉学科专业，GPA要求提高至3.3/4.0，商学院增加视频面试。',
      coverImage: 'https://picsum.photos/seed/cuhk2025/220/180',
      publishTime: '2024-09-03',
      views: 1892,
      author: '留学顾问团队',
      tags: ['申请要求', '硕士', '2025秋季'],
      content: `
<h2>香港中文大学2025年申请要求更新</h2>

<h3>一、学术成绩要求</h3>
<p><strong>GPA要求：</strong>3.3/4.0（较2024年提高0.1）</p>
<p><strong>211/985院校：</strong>GPA 3.0以上可申请</p>
<p><strong>双非院校：</strong>GPA 3.3以上，建议3.5+</p>

<h3>二、语言成绩要求</h3>
<p><strong>雅思：</strong>6.5（小分5.5）</p>
<p><strong>托福：</strong>79</p>
<p><strong>部分专业特殊要求：</strong></p>
<ul>
<li>商学院：雅思7.0或托福90</li>
<li>法学院：雅思7.0（小分6.5）</li>
<li>教育学院：雅思7.0（小分6.0）</li>
</ul>

<h3>三、新增专业（2025）</h3>
<ul>
<li>人工智能与数据科学硕士</li>
<li>可持续商业硕士</li>
<li>数字健康与医疗科学硕士</li>
<li>跨媒体与文化传播硕士</li>
</ul>

<h3>四、面试要求更新</h3>
<p>📹 商学院所有专业均需完成视频面试（Kira Talent）</p>
<p>📹 工程学部部分专业增加技术面试</p>
<p>📹 传媒学院增加作品集提交要求</p>

<h3>五、奖学金信息</h3>
<p><strong>卓越奖学金：</strong>全额学费+生活费（约20万港币）</p>
<p><strong>入学奖学金：</strong>学费减免30%-50%</p>
<p><strong>申请截止：</strong>2024年12月31日</p>
      `,
      relatedArticles: ['HK2025001', 'HK2025004', 'SG2025002']
    },
    {
      id: 'HK2025003',
      year: '2025',
      semester: '秋季',
      category: '政策更新',
      country: '香港',
      university: '香港科技大学',
      title: '香港科技大学2025年最新招生政策解读',
      summary: '港科大力推STEM专业，新增人工智能硕士项目，工科申请竞争加剧，建议提前联系导师。',
      coverImage: 'https://picsum.photos/seed/hkust2025/220/180',
      publishTime: '2024-09-01',
      views: 1567,
      author: '留学顾问团队',
      tags: ['政策更新', '硕士', '2025秋季'],
      content: `
<h2>香港科技大学2025年招生政策解读</h2>

<h3>一、重点发展方向</h3>
<p><strong>STEM专业：</strong>优先招生，奖学金力度加大</p>
<p><strong>交叉学科：</strong>新增AI+X系列专业</p>
<p><strong>产学研结合：</strong>提供更多实习机会</p>

<h3>二、新增专业（2025）</h3>
<ul>
<li>人工智能硕士</li>
<li>智能机器人工程硕士</li>
<li>可持续发展与技术硕士</li>
</ul>

<h3>三、申请时间节点</h3>
<p><strong>开放申请：</strong>2024年9月1日</p>
<p><strong>首轮截止：</strong>2024年11月15日</p>
<p><strong>二轮截止：</strong>2025年1月1日</p>
<p><strong>最终截止：</strong>2025年3月15日</p>

<h3>四、竞争形势分析</h3>
<p>📈 工科申请量增长30%，录取率下降</p>
<p>📈 CS专业竞争最激烈，建议提前准备</p>
<p>📈 商科稳定，面试环节更加重要</p>

<h3>五、提前联系导师建议</h3>
<p>工科和理科专业建议提前联系目标导师</p>
<p>邮件模板：说明研究兴趣、学术背景、为什么选择该导师</p>
      `,
      relatedArticles: ['HK2025001', 'HK2025002', 'SG2025003']
    },
    {
      id: 'HK2025004',
      year: '2025',
      semester: '秋季',
      category: '签证政策',
      country: '香港',
      university: '全香港',
      title: '香港2025年学生签证最新政策解读',
      summary: '香港延长研究生毕业后留港工作签证至24个月，新增人才清单，吸引更多内地学生赴港深造。',
      coverImage: 'https://picsum.photos/seed/hkvisa2025/220/180',
      publishTime: '2024-08-28',
      views: 3421,
      author: '留学顾问团队',
      tags: ['签证政策', '工作签证', '2025'],
      content: `
<h2>香港2025年学生签证最新政策</h2>

<h3>一、IANG签证（非本地毕业生留港工作）</h3>
<p><strong>政策变化：</strong>毕业后留港工作签证延长至24个月</p>
<p><strong>适用范围：</strong>所有香港高校本科、硕士、博士毕业生</p>
<p><strong>新政策生效时间：</strong>2024年7月1日</p>

<h3>二、学生签证申请流程</h3>
<ol>
<li>收到学校录取通知书后，申请学生签证</li>
<li>提交材料：护照、照片、录取通知书、财力证明等</li>
<li>等待审批（约4-6周）</li>
<li>领取签证并办理港澳通行证</li>
</ol>

<h3>三、新增加人才清单</h3>
<p>以下专业毕业生可优先申请香港永居：</p>
<ul>
<li>人工智能与数据科学</li>
<li>金融科技</li>
<li>生物医学</li>
<li>新能源</li>
<li>高端制造</li>
</ul>

<h3>四、申请时间建议</h3>
<p>建议在收到录取后2周内提交签证申请</p>
<p>预留充足时间处理签证和通行证</p>

<h3>五、财力证明要求</h3>
<p><strong>本科生：</strong>至少12万港币/年</p>
<p><strong>研究生：</strong>至少15万港币/年</p>
<p>需提供银行流水或存款证明</p>
      `,
      relatedArticles: ['HK2025001', 'HK2025002', 'SG2025001']
    },

    // 新加坡地区
    {
      id: 'SG2025001',
      year: '2025',
      semester: '秋季',
      category: '申请时间',
      country: '新加坡',
      university: '新加坡国立大学',
      title: '新加坡国立大学2025年秋季申请时间表',
      summary: 'NUS 2025年申请开放时间为2024年8月1日，热门专业竞争激烈，建议首轮申请截止前提交。',
      coverImage: 'https://picsum.photos/seed/nus2025/220/180',
      publishTime: '2024-08-25',
      views: 2890,
      author: '留学顾问团队',
      tags: ['申请时间', '硕士', '2025秋季'],
      content: `
<h2>新加坡国立大学2025年申请时间表</h2>

<h3>一、申请开放时间</h3>
<p><strong>开放申请：</strong>2024年8月1日</p>
<p><strong>首轮截止：</strong>2024年10月31日（强烈建议）</p>
<p><strong>二轮截止：</strong>2025年1月31日</p>
<p><strong>最终截止：</strong>2025年3月31日（视专业而定）</p>

<h3>二、热门专业时间节点</h3>
<table>
<tr><th>专业</th><th>首轮截止</th><th>最终截止</th></tr>
<tr><td>金融工程</td><td>2024-10-31</td><td>2025-01-15</td></tr>
<tr><td>计算机科学</td><td>2024-10-31</td><td>2025-02-28</td></tr>
<tr><td>商业分析</td><td>2024-11-30</td><td>2025-01-31</td></tr>
<tr><td>数据科学</td><td>2024-10-31</td><td>2025-02-15</td></tr>
</table>

<h3>三、语言成绩要求</h3>
<p><strong>雅思：</strong>6.5-7.0（视专业而定）</p>
<p><strong>托福：</strong>90-100</p>
<p><strong>GRE/GMAT：</strong>商科/工程类强烈建议</p>

<h3>四、申请材料</h3>
<ul>
<li>官方成绩单</li>
<li>学位证/在读证明</li>
<li>2-3封推荐信</li>
<li>个人陈述</li>
<li>简历</li>
<li>语言成绩单</li>
<li>GRE/GMAT成绩（如适用）</li>
</ul>

<h3>五、申请建议</h3>
<p>1. NUS采用滚动录取，越早申请越有优势</p>
<p>2. 热门专业建议在首轮截止前提交</p>
<p>3. 部分专业需要面试，提前准备</p>
<p>4. 提前联系导师（研究型硕士/博士）</p>
      `,
      relatedArticles: ['HK2025001', 'SG2025002', 'SG2025003']
    },
    {
      id: 'SG2025002',
      year: '2025',
      semester: '秋季',
      category: '申请要求',
      country: '新加坡',
      university: '南洋理工大学',
      title: '南洋理工大学2025年申请要求更新',
      summary: 'NTU 2025年GPA要求提升至3.5，新增可持续专业，商学院增加视频面试，竞争加剧。',
      coverImage: 'https://picsum.photos/seed/ntu2025/220/180',
      publishTime: '2024-08-22',
      views: 2156,
      author: '留学顾问团队',
      tags: ['申请要求', '硕士', '2025秋季'],
      content: `
<h2>南洋理工大学2025年申请要求更新</h2>

<h3>一、学术成绩要求</h3>
<p><strong>GPA要求：</strong>3.5/4.0（较2024年提高）</p>
<p><strong>211/985：</strong>GPA 3.3以上</p>
<p><strong>双非：</strong>GPA 3.5以上，建议3.7+</p>

<h3>二、语言成绩要求</h3>
<p><strong>雅思：</strong>6.5-7.0</p>
<p><strong>托福：</strong>90-100</p>
<p><strong>商学院：</strong>雅思7.0，托福100</p>

<h3>三、新增专业（2025）</h3>
<ul>
<li>可持续发展与绿色发展硕士</li>
<li>网络安全硕士</li>
<li>数字媒体艺术硕士</li>
</ul>

<h3>四、面试要求</h3>
<p>📹 商学院所有专业需视频面试</p>
<p>📹 工科部分专业有技术面试</p>
<p>📹 传媒学院增加作品集要求</p>

<h3>五、奖学金</h3>
<p><strong>Nanyang奖学金：</strong>全额+生活费</p>
<p><strong>卓越奖学金：</strong>50%-100%学费减免</p>
<p>需在2024年12月31日前申请</p>
      `,
      relatedArticles: ['SG2025001', 'HK2025002', 'SG2025004']
    },
    {
      id: 'SG2025003',
      year: '2025',
      semester: '秋季',
      category: '奖学金',
      country: '新加坡',
      university: '全新加坡',
      title: '新加坡2025年留学奖学金全攻略',
      summary: '新加坡政府推出多项奖学金项目，包括政府助学金、大学奖学金、企业奖学金，总额超千万新币。',
      coverImage: 'https://picsum.photos/seed/sgscholarship2025/220/180',
      publishTime: '2024-08-20',
      views: 4230,
      author: '留学顾问团队',
      tags: ['奖学金', '留学费用', '2025'],
      content: `
<h2>新加坡2025年留学奖学金全攻略</h2>

<h3>一、政府助学金（Tuition Grant）</h3>
<p><strong>覆盖范围：</strong>所有公立大学国际学生</p>
<p><strong>减免额度：</strong>约50%学费</p>
<p><strong>义务：</strong>毕业后需在新加坡工作3年</p>
<p><strong>申请时间：</strong>入学申请时一并提交</p>

<h3>二、大学奖学金</h3>

<p><strong>新加坡国立大学：</strong></p>
<ul>
<li>总统奖学金：全额+生活费（最优秀学生）</li>
<li>大学奖学金：50%-100%学费减免</li>
<li>院系奖学金：3000-10000新币</li>
</ul>

<p><strong>南洋理工大学：</strong></p>
<ul>
<li>Nanyang奖学金：全额+生活费</li>
<li>奖学金项目：50%-100%学费减免</li>
</ul>

<h3>三、企业奖学金</h3>
<p><strong>新加坡电信奖学金：</strong>每年10000新币</p>
<p><strong>星展银行奖学金：</strong>全额+实习机会</p>
<p><strong>华为奖学金：</strong>学费全免+就业保证</p>

<h3>四、申请条件</h3>
<ul>
<li>GPA 3.7+/4.0或同等水平</li>
<li>雅思7.0或托福100+</li>
<li>GRE/GMAT高分（商科/工科）</li>
<li>领导力和社会实践经历</li>
</ul>

<h3>五、申请时间线</h3>
<p><strong>9-10月：</strong>准备申请材料</p>
<p><strong>11月：</strong>提交奖学金申请</p>
<p><strong>12-1月：</strong>面试（如需要）</p>
<p><strong>2-3月：</strong>公布结果</p>
      `,
      relatedArticles: ['SG2025001', 'SG2025002', 'HK2025001']
    },
    {
      id: 'SG2025004',
      year: '2025',
      semester: '秋季',
      category: '就业政策',
      country: '新加坡',
      university: '全新加坡',
      title: '新加坡2025年留学生就业新政策',
      summary: '新加坡推出Tech.Pass签证，科技行业毕业生优先获得工作签证，毕业生起薪持续上涨。',
      coverImage: 'https://picsum.photos/seed/sgjobs2025/220/180',
      publishTime: '2024-08-18',
      views: 3678,
      author: '留学顾问团队',
      tags: ['就业政策', '工作签证', '2025'],
      content: `
<h2>新加坡2025年留学生就业新政策</h2>

<h3>一、Tech.Pass签证（科技人才工作签证）</h3>
<p><strong>目标人群：</strong>科技行业优秀人才</p>
<p><strong>有效期：</strong>2年，可续期</p>
<p><strong>申请条件：</strong></p>
<ul>
<li>月收入不低于10000新币</li>
<li>或在科技公司担任高级职位</li>
<li>或有重大技术贡献</li>
</ul>

<h3>二、S Pass签证（技术工人）</h3>
<p><strong>适用范围：</strong>中级技术岗位</p>
<p><strong>最低薪资：</strong>提升至3000新币</p>
<p><strong>申请优势：</strong>本地毕业生优先审批</p>

<h3>三、就业形势分析</h3>
<p><strong>热门行业：</strong></p>
<ul>
<li>金融科技：起薪3500-5000新币</li>
<li>数据科学：起薪4000-6000新币</li>
<li>人工智能：起薪4500-7000新币</li>
<li>生物医药：起薪3500-5000新币</li>
</ul>

<h3>四、毕业生起薪统计（2024数据）</h3>
<p><strong>NUS：</strong>平均3500新币/月</p>
<p><strong>NTU：</strong>平均3400新币/月</p>
<p><strong>SMU：</strong>平均3600新币/月</p>

<h3>五、就业服务</h3>
<p>各大学就业中心提供：</p>
<ul>
<li>简历修改</li>
<li>面试培训</li>
<li>企业招聘会</li>
<li>内推机会</li>
</ul>
      `,
      relatedArticles: ['SG2025001', 'SG2025002', 'SG2025003']
    }
  ],

  // 2026年申请季资讯
  '2026': [
    {
      id: 'HK2026001',
      year: '2026',
      semester: '秋季',
      category: '申请时间',
      country: '香港',
      university: '全香港',
      title: '香港2026年秋季入学申请前瞻',
      summary: '预计2026年申请季竞争更加激烈，建议提前1年开始准备，热门专业申请量预计增长40%。',
      coverImage: 'https://picsum.photos/seed/hk2026preview/220/180',
      publishTime: '2025-03-15',
      views: 1256,
      author: '留学顾问团队',
      tags: ['申请前瞻', '2026', '规划建议'],
      content: `
<h2>香港2026年秋季入学申请前瞻</h2>

<h3>一、申请时间预测</h3>
<p><strong>开放申请：</strong>预计2025年9月1日</p>
<p><strong>首轮截止：</strong>预计2025年11月15日</p>
<p><strong>二轮截止：</strong>预计2026年1月31日</p>

<h3>二、竞争趋势分析</h3>
<p>📈 申请总量预计增长40%</p>
<p>📈 211/985学生占比提升</p>
<p>📈 跨专业申请更加普遍</p>

<h3>三、准备时间线建议</h3>
<p><strong>2024年9月-2025年6月：</strong></p>
<ul>
<li>提升GPA至3.3+</li>
<li>考取语言成绩</li>
<li>参加科研项目/实习</li>
</ul>

<p><strong>2025年7月-8月：</strong></p>
<ul>
<li>确定目标学校和专业</li>
<li>准备申请材料</li>
<li>联系推荐人</li>
</ul>

<p><strong>2025年9月-11月：</strong></p>
<ul>
<li>提交首轮申请</li>
<li>准备面试</li>
</ul>

<h3>四、新增专业预测</h3>
<ul>
<li>ESG相关专业</li>
<li>人工智能与交叉学科</li>
<li>数字医疗</li>
</ul>
      `,
      relatedArticles: ['HK2026002', 'SG2026001']
    },
    {
      id: 'HK2026002',
      year: '2026',
      semester: '秋季',
      category: '专业趋势',
      country: '香港',
      university: '全香港',
      title: '2026年香港留学热门专业预测',
      summary: 'AI、数据科学、金融科技、ESG将成为2026年最热门专业，就业前景广阔，起薪高。',
      coverImage: 'https://picsum.photos/seed/hkmajors2026/220/180',
      publishTime: '2025-03-10',
      views: 1523,
      author: '留学顾问团队',
      tags: ['热门专业', '2026', '就业前景'],
      content: `
<h2>2026年香港留学热门专业预测</h2>

<h3>一、TOP 1: 人工智能与数据科学</h3>
<p><strong>就业方向：</strong>算法工程师、数据科学家</p>
<p><strong>起薪范围：</strong>25-40万港币/年</p>
<p><strong>推荐学校：</strong>港大、港科大、港中大</p>

<h3>二、TOP 2: 金融科技</h3>
<p><strong>就业方向：</strong>金融科技公司、投行</p>
<p><strong>起薪范围：</strong>30-50万港币/年</p>
<p><strong>推荐学校：</strong>港大、港科大</p>

<h3>三、TOP 3: ESG可持续发展</h3>
<p><strong>就业方向：</strong>ESG咨询、绿色金融</p>
<p><strong>起薪范围：</strong>20-35万港币/年</p>
<p><strong>推荐学校：</strong>港大、港中大</p>

<h3>四、TOP 4: 生物医学</h3>
<p><strong>就业方向：</strong>医药公司、研究机构</p>
<p><strong>起薪范围：</strong>25-40万港币/年</p>
<p><strong>推荐学校：</strong>港大、港中大</p>

<h3>五、TOP 5: 数字媒体</h3>
<p><strong>就业方向：</strong>媒体公司、科技公司</p>
<p><strong>起薪范围：</strong>20-30万港币/年</p>
<p><strong>推荐学校：</strong>港中大、港浸会</p>
      `,
      relatedArticles: ['HK2026001', 'HK2026003']
    },
    {
      id: 'SG2026001',
      year: '2026',
      semester: '秋季',
      category: '申请前瞻',
      country: '新加坡',
      university: '全新加坡',
      title: '新加坡2026年留学申请趋势分析',
      summary: '新加坡2026年申请量预计增长50%，科技专业持续热门，政府加大奖学金力度。',
      coverImage: 'https://picsum.photos/seed/sg2026preview/220/180',
      publishTime: '2025-03-08',
      views: 1847,
      author: '留学顾问团队',
      tags: ['申请前瞻', '2026', '趋势分析'],
      content: `
<h2>新加坡2026年留学申请趋势分析</h2>

<h3>一、申请量预测</h3>
<p>📈 总申请量预计增长50%</p>
<p>📈 中国学生占比继续上升</p>
<p>📈 科技专业竞争最激烈</p>

<h3>二、政府政策支持</h3>
<p><strong>奖学金力度加大：</strong>政府助学金覆盖面扩大</p>
<p><strong>就业政策优化：</strong>Tech.Pass签证放宽</p>
<p><strong>移民政策：</strong>留学转永居通道更畅通</p>

<h3>三、热门专业预测</h3>
<ul>
<li>人工智能与机器学习</li>
<li>网络安全</li>
<li>可持续发展</li>
<li>金融科技</li>
<li>生物医药</li>
</ul>

<h3>四、准备建议</h3>
<p>1. 提前1年开始规划</p>
<p>2. GPA保持3.5+</p>
<p>3. 语言成绩IELTS 7.0+</p>
<p>4. 相关实习/科研项目</p>
<p>5. GRE/GMAT高分优先</p>
      `,
      relatedArticles: ['HK2026001', 'SG2026002']
    },
    {
      id: 'SG2026002',
      year: '2026',
      semester: '秋季',
      category: '奖学金',
      country: '新加坡',
      university: '全新加坡',
      title: '新加坡2026年奖学金政策展望',
      summary: '新加坡政府计划新增多个奖学金项目，总额超2000万新币，吸引全球优秀学生。',
      coverImage: 'https://picsum.photos/seed/sgscholarship2026/220/180',
      publishTime: '2025-03-05',
      views: 2134,
      author: '留学顾问团队',
      tags: ['奖学金', '2026', '政策展望'],
      content: `
<h2>新加坡2026年奖学金政策展望</h2>

<h3>一、新增奖学金项目</h3>
<p><strong>科技创新奖学金：</strong>50个名额，全额+生活费</p>
<p><strong>可持续发展奖学金：</strong>30个名额，50%-100%学费减免</p>
<p><strong>国际交流奖学金：</strong>支持短期交换项目</p>

<h3>二、申请条件提升</h3>
<p><strong>GPA：</strong>3.7+/4.0</p>
<p><strong>语言：</strong>IELTS 7.5/TOEFL 105+</p>
<p><strong>GRE/GMAT：</strong>前10%优先</p>

<h3>三、申请时间线</h3>
<p><strong>2025年9月：</strong>开放申请</p>
<p><strong>2025年11月：</strong>截止申请</p>
<p><strong>2026年1月：</strong>公布结果</p>

<h3>四、申请建议</h3>
<p>1. 提前准备高质量申请材料</p>
<p>2. 突出个人特色和领导力</p>
<p>3. 提交个人陈述和推荐信</p>
<p>4. 关注学校官网最新信息</p>
      `,
      relatedArticles: ['SG2026001', 'SG2025003']
    }
  ]
};

module.exports = newsData;
