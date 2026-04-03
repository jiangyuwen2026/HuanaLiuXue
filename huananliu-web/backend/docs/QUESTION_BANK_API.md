# 雅思/托福题库系统 - API 文档

**文档版本**: v1.0  
**创建日期**: 2026-04-03  
**基础路径**: `/api`

---

## 📚 API 概览

| 模块 | 基础路径 | 说明 |
|------|----------|------|
| 题目管理 | `/api/questions` | 题目的增删改查、分类、标签 |
| 试卷管理 | `/api/exam-papers` | 模考卷的创建、组卷 |
| 练习/考试 | `/api/exam` | 在线刷题、提交答案、查看报告 |
| 错题本 | `/api/exam/wrong-book` | 错题管理、统计 |

---

## 📝 题目管理 API

### 分类管理

#### 获取分类列表
```http
GET /api/questions/categories?exam_type=ielts&subject=listening
```

**响应**: 返回树形结构的分类列表

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "exam_type": "ielts",
      "subject": "listening",
      "name": "雅思听力",
      "children": [
        { "id": 2, "name": "场景对话", "children": [] }
      ]
    }
  ]
}
```

#### 创建分类
```http
POST /api/questions/categories
Content-Type: application/json

{
  "exam_type": "ielts",
  "subject": "listening",
  "name": "图书馆场景",
  "parent_id": 2,
  "sort_order": 1
}
```

---

### 标签管理

#### 获取标签列表
```http
GET /api/questions/tags
```

#### 创建标签
```http
POST /api/questions/tags
Content-Type: application/json

{
  "name": "同义替换",
  "color": "#3A7CA5"
}
```

---

### 题目管理

#### 获取题目列表
```http
GET /api/questions?exam_type=ielts&subject=listening&difficulty=2&page=1&pageSize=20
```

**查询参数**:
- `exam_type`: `ielts` | `toefl`
- `subject`: `listening` | `reading` | `writing` | `speaking`
- `type`: 题型代码
- `difficulty`: `1` | `2` | `3`
- `category_id`: 分类ID
- `tag_id`: 标签ID
- `keyword`: 关键词搜索

**响应**:
```json
{
  "success": true,
  "data": {
    "list": [
      {
        "id": 1,
        "exam_type": "ielts",
        "subject": "listening",
        "type": "single_choice",
        "title": "What is the main topic?",
        "options": [{"key": "A", "text": "Library"}],
        "difficulty": 2,
        "tags": [{"id": 1, "name": "主旨大意"}],
        "category": {"id": 1, "name": "场景对话"}
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

#### 获取题目详情
```http
GET /api/questions/:id
```

**说明**: 返回完整题目信息（包含正确答案和解析）

#### 获取练习题目
```http
GET /api/questions/:id/practice
```

**说明**: 返回题目（隐藏正确答案，用于练习时展示）

#### 创建题目
```http
POST /api/questions
Content-Type: application/json

{
  "exam_type": "ielts",
  "subject": "listening",
  "type": "single_choice",
  "category_id": 1,
  "title": "What is the main topic?",
  "content": "详细题干...",
  "options": [
    {"key": "A", "text": "Library services"},
    {"key": "B", "text": "Course registration"}
  ],
  "correct_answer": "A",
  "answer_analysis": "解析...",
  "difficulty": 2,
  "tag_ids": [1, 2]
}
```

#### 更新题目
```http
PUT /api/questions/:id
Content-Type: application/json

{
  "title": "新标题",
  "tag_ids": [1, 3]
}
```

#### 删除题目
```http
DELETE /api/questions/:id
```

#### 批量删除
```http
POST /api/questions/batch-delete
Content-Type: application/json

{
  "ids": [1, 2, 3]
}
```

#### 获取题型选项
```http
GET /api/questions/options/types
```

#### 题库统计
```http
GET /api/questions/stats/overview?exam_type=ielts
```

---

## 📄 试卷管理 API

#### 获取试卷列表
```http
GET /api/exam-papers?exam_type=ielts&is_official=1
```

#### 获取试卷详情
```http
GET /api/exam-papers/:id
```

#### 创建试卷
```http
POST /api/exam-papers
Content-Type: application/json

{
  "title": "雅思全真模拟卷-Test 1",
  "exam_type": "ielts",
  "subject": null,
  "description": "完整模拟考试",
  "time_limit": 10800,
  "is_official": 1,
  "question_ids": [1, 2, 3, 4, 5],
  "scores": {
    "1": 1,
    "2": 1,
    "3": 2
  }
}
```

#### 更新试卷
```http
PUT /api/exam-papers/:id
```

#### 删除试卷
```http
DELETE /api/exam-papers/:id
```

#### 获取可选题目
```http
GET /api/exam-papers/options/available-questions?exam_type=ielts&subject=listening&exclude_ids=1,2,3
```

---

## 🎯 练习/考试 API

#### 开始练习/考试
```http
POST /api/exam/start
Content-Type: application/json

{
  "mode": "practice",
  "exam_type": "ielts",
  "subject": "listening",
  "category_id": 1,
  "question_count": 20,
  "user_id": 123
}
```

**模式 (mode) 说明**:
- `practice`: 专项练习（按科目/分类）
- `exam`: 模考（需传 paper_id）
- `wrong_book`: 错题重练
- `random`: 随机练习
- `tag_practice`: 知识点专项

**响应**:
```json
{
  "success": true,
  "data": {
    "exam_id": 100,
    "title": "专项练习 - 听力",
    "mode": "practice",
    "total_questions": 20,
    "time_limit": 0,
    "questions": [
      {
        "id": 1,
        "title": "...",
        "options": [...]
        // 不包含 correct_answer 和 answer_analysis
      }
    ]
  }
}
```

#### 提交答案
```http
POST /api/exam/:exam_id/submit
Content-Type: application/json

{
  "user_id": 123,
  "answers": [
    {
      "question_id": 1,
      "user_answer": "A",
      "time_spent": 30
    },
    {
      "question_id": 2,
      "user_answer": "B,C",
      "time_spent": 45
    }
  ]
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "exam_id": 100,
    "total_questions": 20,
    "answered_questions": 20,
    "correct_count": 15,
    "score": 15,
    "accuracy": 75,
    "time_spent": 1200
  }
}
```

#### 获取考试报告
```http
GET /api/exam/:exam_id/report
```

**响应**:
```json
{
  "success": true,
  "data": {
    "exam": {
      "id": 100,
      "title": "专项练习 - 听力",
      "total_questions": 20,
      "correct_count": 15,
      "accuracy": 75,
      "time_spent": 1200
    },
    "subject_stats": {
      "listening": { "total": 20, "correct": 15, "accuracy": 75 }
    },
    "tag_stats": {
      "同义替换": { "total": 5, "correct": 4, "accuracy": 80 }
    },
    "answers": [
      {
        "question_id": 1,
        "user_answer": "A",
        "is_correct": 1,
        "question": {
          "correct_answer": "A",
          "answer_analysis": "解析..."
        }
      }
    ]
  }
}
```

---

## 📝 错题本 API

#### 获取错题本
```http
GET /api/exam/wrong-book?user_id=123&exam_type=ielts&page=1&pageSize=20
```

#### 标记已掌握
```http
POST /api/exam/wrong-book/:id/master
```

#### 移除错题
```http
DELETE /api/exam/wrong-book/:id
```

#### 错题统计
```http
GET /api/exam/wrong-book/stats?user_id=123
```

---

## 📊 学习记录 API

#### 练习历史
```http
GET /api/exam/history?user_id=123&mode=practice&page=1
```

#### 学习统计
```http
GET /api/exam/stats/overview?user_id=123
```

**响应**:
```json
{
  "success": true,
  "data": {
    "total_exams": 50,
    "total_answers": 1000,
    "accuracy": 78,
    "wrong_count": 45,
    "today_exams": 3,
    "recent_study_days": 7
  }
}
```

---

## 🔄 完整刷题流程示例

### 1. 用户选择练习
```javascript
// 前端：用户选择雅思听力专项练习
const response = await fetch('/api/exam/start', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    mode: 'practice',
    exam_type: 'ielts',
    subject: 'listening',
    question_count: 10,
    user_id: 123
  })
});

const { data } = await response.json();
const { exam_id, questions } = data;
// 保存 exam_id，展示 questions 给用户答题
```

### 2. 用户答题并提交
```javascript
// 用户答完所有题目
const answers = questions.map((q, index) => ({
  question_id: q.id,
  user_answer: userAnswers[index], // 用户选择的答案
  time_spent: questionTimes[index] // 每题用时（秒）
}));

const response = await fetch(`/api/exam/${exam_id}/submit`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: 123,
    answers
  })
});

const result = await response.json();
// 显示得分、正确率
```

### 3. 查看详细报告
```javascript
const response = await fetch(`/api/exam/${exam_id}/report`);
const { data } = await response.json();

// 展示：
// - 总体得分、正确率
// - 各科目表现
// - 各知识点掌握情况
// - 每道题的对错和解析
```

---

## ⚠️ 注意事项

1. **用户认证**: 当前 API 使用简单的 `user_id` 参数，生产环境应接入 JWT 认证
2. **自动判分**: 客观题（单选、判断、填空）自动判分；主观题（写作、口语）标记为"待批改"（is_correct=3）
3. **错题本**: 答错的题目自动加入错题本，掌握后可标记移除
4. **音频/图片**: 听力音频和题目图片通过 `audio_url` 和 `images` 字段存储 URL

---

**文档维护**: 华南留学技术团队  
**最后更新**: 2026-04-03
