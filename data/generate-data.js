/**
 * 数据生成脚本
 * 用于生成上架数据和统计报告
 */

const dataManager = require('../utils/dataManager');
const fs = require('fs');
const path = require('path');

console.log('========================================');
console.log('开始生成数据...');
console.log('========================================\n');

// 1. 导出完整数据
console.log('1. 导出完整数据...');
dataManager.exportDataAsJSON(path.join(__dirname, 'full-data.json'));

// 2. 导出上架清单
console.log('\n2. 导出上架清单...');
dataManager.exportListingList(path.join(__dirname, 'listing-list.json'));

// 3. 导出分类统计报告
console.log('\n3. 导出分类统计报告...');
dataManager.exportCategoryReport(path.join(__dirname, 'category-report.json'));

// 4. 生成README文档
console.log('\n4. 生成README文档...');
const readme = `# 香港和新加坡大学专业数据

## 数据概述

本目录包含香港和新加坡主要大学及专业的完整数据。

## 文件说明

### 数据文件

- \`full-data.json\` - 完整的大学和专业数据
- \`listing-list.json\` - 供上架使用的专业清单
- \`category-report.json\` - 专业分类统计报告

## 数据统计

### 大学统计

**香港大学：**
- 香港大学 (HKU) - QS世界排名#21
- 香港中文大学 (CUHK) - QS世界排名#47
- 香港科技大学 (HKUST) - QS世界排名#60
- 香港理工大学 (PolyU) - QS世界排名#65
- 香港城市大学 (CityU) - QS世界排名#70
- 香港浸会大学 (HKBU) - QS世界排名#295

**新加坡大学：**
- 新加坡国立大学 (NUS) - QS世界排名#8
- 南洋理工大学 (NTU) - QS世界排名#19
- 新加坡管理大学 (SMU) - QS世界排名#545
- 新加坡科技设计大学 (SUTD) - QS世界排名#440
- 新加坡理工大学 (SIT) - QS世界排名#581
- 新跃社科大学 (SUSS) - QS世界排名#1001

### 专业统计

详细统计数据请查看 \`category-report.json\` 文件。

## 数据结构

### 大学数据

\`\`\`json
{
  "id": "hku_001",
  "name": "香港大学",
  "nameEn": "The University of Hong Kong",
  "shortName": "HKU",
  "country": "香港",
  "ranking": {
    "qs": { "rank": 21, "year": 2024 },
    "times": { "rank": 35, "year": 2024 },
    "arwu": { "rank": 101, "year": 2024 }
  },
  "undergraduate": { ... },
  "master": { ... }
}
\`\`\`

### 本科专业

\`\`\`json
{
  "name": "计算机科学",
  "nameEn": "Computer Science",
  "duration": "4年",
  "language": "英语",
  "tuition": 171000
}
\`\`\`

### 硕士专业

\`\`\`json
{
  "name": "计算机科学硕士",
  "nameEn": "MSc Computer Science",
  "category": "工科",
  "duration": "1-2年",
  "fullTime": true,
  "partTime": true,
  "language": "英语",
  "tuition": 252000,
  "applicationFee": 2000,
  "deadline": ["2024-12-01", "2025-01-31"],
  "requirements": { ... },
  "career": "软件工程师、数据科学家"
}
\`\`\`

## 使用方法

### Node.js环境

\`\`\`javascript
const dataManager = require('../utils/dataManager');

// 获取所有大学
const universities = dataManager.getAllUniversities();

// 按国家获取大学
const hkUnis = dataManager.getHongKongUniversities();
const sgUnis = dataManager.getSingaporeUniversities();

// 获取所有本科专业
const undergradMajors = dataManager.getAllUndergraduateMajors();

// 获取所有硕士专业
const masterPrograms = dataManager.getAllMasterPrograms();

// 按分类获取专业
const businessPrograms = dataManager.getMasterProgramsByCategory('商科');

// 搜索专业
const results = dataManager.searchMajors('计算机');

// 按预算筛选
const budgetPrograms = dataManager.getMasterProgramsByBudget(300000);
\`\`\`

### 在小程序中使用

1. 将 \`utils/universityData.js\` 和 \`utils/dataManager.js\` 复制到小程序项目
2. 在页面中引入使用：

\`\`\`javascript
// pages/school/school.js
const dataManager = require('../../utils/dataManager');

Page({
  onLoad() {
    // 获取香港大学列表
    const hkUnis = dataManager.getHongKongUniversities();
    this.setData({ universityList: hkUnis });
  }
})
\`\`\`

## 数据更新

### 更新数据源

1. 编辑 \`utils/universityData.js\` 文件
2. 运行生成脚本：

\`\`\`bash
node data/generate-data.js
\`\`\`

### 上架流程

1. 确认数据准确性
2. 运行生成脚本导出上架清单
3. 根据上架清单逐一审核上架
4. 定期更新数据（建议每学期更新一次）

## 注意事项

1. 学费单位为港币（香港大学）或新币（新加坡大学）
2. 排名数据基于2024年QS世界大学排名
3. 申请截止日期需根据官网及时更新
4. 语言要求可能因专业而异，以官网为准
5. 部分数据为估算值，实际金额请以大学官网为准

## 联系方式

如有数据问题或建议，请联系：
- 邮箱：data@huananliuxue.com
- 电话：400-xxx-xxxx

---

**最后更新时间：** ${new Date().toISOString()}
`;

fs.writeFileSync(path.join(__dirname, 'README.md'), readme);
console.log('README.md 已生成');

console.log('\n========================================');
console.log('数据生成完成！');
console.log('========================================');
console.log('\n生成的文件：');
console.log('- full-data.json (完整数据)');
console.log('- listing-list.json (上架清单)');
console.log('- category-report.json (分类报告)');
console.log('- README.md (说明文档)');
console.log('\n路径：', __dirname);
