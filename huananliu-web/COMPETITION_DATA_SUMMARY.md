# 华南留学竞赛数据库 - 数据导入总结

## 📊 导入概况

成功导入 **21个** 国际主流竞赛，涵盖数学、物理、化学、生物、计算机、商科六大领域。

## 📁 竞赛列表

### 数学竞赛 (6个)

| Slug | 名称 | 难度 | 特点 |
|------|------|------|------|
| amc-8-10-12 | AMC 8/10/12 | 中级 | 美国数学竞赛，全球30万+参赛者 |
| aime | AIME | 高级 | AMC晋级赛，通往USAMO必经之路 |
| usamo | USAMO/USAJMO | 高级 | 美国数学奥赛，IMO美国队选拔赛 |
| bmo | BMO | 高级 | 英国数学奥赛，IMO英国队选拔赛 |
| himcm | HiMCM/MidMCM | 中级 | 数学建模竞赛，团队协作 |
| euclid | Euclid | 中级 | 加拿大欧几里得数学竞赛 |

### 物理竞赛 (5个)

| Slug | 名称 | 难度 | 特点 |
|------|------|------|------|
| physics-bowl | Physics Bowl | 中级 | 物理碗，美国权威物理竞赛 |
| f-ma | F=ma | 高级 | 美国物理奥赛初赛 |
| usapho | USAPhO | 高级 | 美国物理奥赛，IPHO选拔赛 |
| bpho | BPhO | 高级 | 英国物理奥赛，IPHO选拔赛 |
| cap | CAP | 中级 | 加拿大物理竞赛 |

### 生物竞赛 (4个)

| Slug | 名称 | 难度 | 特点 |
|------|------|------|------|
| usabo | USABO | 高级 | 美国生物奥赛，IBO选拔赛 |
| bbo | BBO | 高级 | 英国生物奥赛，IBO选拔赛 |
| brain-bee | Brain Bee | 中级 | 脑科学大赛，神经科学入门 |
| hosa | HOSA | 中级 | 生物与健康领袖挑战 |

### 计算机竞赛 (2个)

| Slug | 名称 | 难度 | 特点 |
|------|------|------|------|
| usaco | USACO | 高级 | 美国信息学奥赛，IOI选拔赛 |
| noip | NOIP/CSP-J/S | 高级 | 中国信息学联赛，NOI选拔赛 |

### 商科竞赛 (4个)

| Slug | 名称 | 难度 | 特点 |
|------|------|------|------|
| nec | NEC | 中级 | 全美经济学挑战，沃顿认可 |
| ieo | IEO | 高级 | 国际经济学奥赛 |
| fbla | FBLA | 中级 | 未来商业领袖挑战 |
| kwhs | KWHS | 中级 | 沃顿投资竞赛，投资领域顶级 |

## 🎯 数据字段

每个竞赛包含以下详细信息：

### 基本信息
- slug: URL唯一标识
- name: 竞赛中文名称
- name_en: 竞赛英文名称
- category: 分类（math/physics/biology/computer/business）
- level: 难度级别（beginner/intermediate/advanced）

### Hero区域
- hero_tag: 标签（如"国际顶尖数学竞赛"）
- hero_short_desc: 简短描述

### 竞赛内容
- overview: 竞赛概述（HTML格式）
- eligibility: 参赛资格
- format: 竞赛形式（HTML格式）
- syllabus: 考试大纲（HTML格式）
- scoring: 评分标准

### 时间安排
- timeline: JSON数组，包含日期、标题、描述

### 奖项设置
- awards: 奖项说明（HTML格式）
- award_details: JSON数组，包含奖项级别、条件、权益
- score_history: JSON数组，历年分数线

### 其他信息
- participants: 参赛人数（如"30万+"）
- countries: 参与国家数（如"80+"）
- difficulty_score: 难度评分（1-10）
- recognition: 认可度说明
- logo: Logo图片URL
- banner: Banner图片URL
- official_url: 官网链接

## 🔗 可访问链接

### 前台详情页
- AMC: http://localhost:3000/competition/amc-8-10-12
- AIME: http://localhost:3000/competition/aime
- Physics Bowl: http://localhost:3000/competition/physics-bowl
- USABO: http://localhost:3000/competition/usabo
- BBO: http://localhost:3000/competition/bbo
- USACO: http://localhost:3000/competition/usaco
- NEC: http://localhost:3000/competition/nec
- KWHS: http://localhost:3000/competition/kwhs
- (其他竞赛以此类推)

### 后台管理
- 竞赛管理: http://localhost:3002/services/competition-management

## 📈 竞赛规划页面链接

前台竞赛规划页面（/competition）中的竞赛卡片已配置好 slug，点击即可跳转到对应详情页。

## 📝 补充说明

1. **数据完整性**: 所有竞赛都包含完整的概述、赛制、大纲、时间节点、奖项等信息
2. **HTML支持**: 支持富文本内容，可在后台编辑器中进一步完善
3. **JSON字段**: timeline、award_details、score_history 为JSON格式，支持动态扩展
4. **图片字段**: logo和banner字段已预留，可在后台上传图片后填写URL

## 🚀 后续操作

如需添加更多竞赛或修改现有竞赛信息：

1. 登录后台管理: http://localhost:3002
2. 进入「产品服务」→「竞赛管理」
3. 点击「添加竞赛」或编辑现有竞赛
4. 填写完整信息后保存即可
