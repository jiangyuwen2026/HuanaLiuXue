# Word 导入功能 - 快速开始

## 1. 启动后端服务

```bash
cd /Users/jiangyuwen/WorkBuddy/20260310085315/python-service

# 安装依赖（首次）
pip install -r requirements.txt

# 启动服务
python start.py
```

服务启动后访问: http://localhost:8000/docs

## 2. 测试导入功能

### 方式1: 使用现有 Word 文件

```bash
cd /Users/jiangyuwen/WorkBuddy/20260310085315/python-service
python test_import.py test.docx
```

### 方式2: 创建测试文档并测试

```bash
cd /Users/jiangyuwen/WorkBuddy/20260310085315/python-service
python test_import.py --create
```

### 方式3: 使用 curl

```bash
curl -X POST -F "file=@test.docx" http://localhost:8000/api/import/docx
```

## 3. 前端集成

### 安装组件

组件已创建在:
- `/huananliu-web/frontend/admin/src/components/editor/EditableContent.jsx`
- `/huananliu-web/frontend/admin/src/components/editor/FormulaRenderer.jsx`
- `/huananliu-web/frontend/admin/src/components/editor/WordImportButton.jsx`

### 使用示例

```jsx
import { WordImportButton, EditableContent } from './components/editor';

function MyComponent() {
  const [content, setContent] = useState([]);
  
  return (
    <div>
      <WordImportButton onImport={setContent} />
      <EditableContent value={content} />
    </div>
  );
}
```

## 4. 功能验证清单

### 分页符 ✅
- Word 中插入：布局 → 分隔符 → 分页符
- 检测方式：`w:br w:type="page"` 或 `w:sectPr`
- 前端显示：虚线分隔 + "分页符" 标签

### 公式 ⚠️
- Word 公式使用 OMML 格式
- 当前显示为 `[公式]` 占位符
- 后续可集成 MathJax 实现完整渲染

### 字体 ✅
- 中文字体：宋体、黑体、楷体、仿宋、微软雅黑
- 英文字体：Times New Roman、Calibri、Arial
- 支持继承链：Run → Paragraph → Style → docDefaults

### 缩进 ✅
- 首行缩进：`w:firstLineChars` (400 = 4 字符)
- 悬挂缩进：`w:hangingChars` + 左缩进
- 单位：字符（100 分之 1 字符）

## 5. 常见问题

### 服务启动失败
```bash
# 检查依赖
pip install python-docx docx2python fastapi uvicorn pydantic
```

### 分页符未检测到
- 确保使用 Word 的正式分页符功能
- 手动换行不会被识别为分页符

### 公式显示问题
- 当前版本只提取 OMML XML
- 如需渲染，需额外集成 MathJax

## 6. API 文档

### POST /api/import/docx

**请求**: `multipart/form-data`
```
file: Word 文档 (.docx)
```

**响应**:
```json
{
  "success": true,
  "content": [...],
  "statistics": {
    "paragraphs": 10,
    "headings": 2,
    "images": 3,
    "tables": 1,
    "page_breaks": 2,
    "formulas": 1
  },
  "fonts": ["宋体", "Times New Roman"]
}
```

### GET /api/import/formats

返回支持的导入格式和库状态。

## 7. 项目文件结构

```
python-service/
├── app/
│   ├── api/
│   │   └── import_doc.py      # 核心导入逻辑
│   └── main.py                 # FastAPI 应用
├── requirements.txt            # Python 依赖
├── start.py                    # 启动脚本
├── create_test_doc.py          # 创建测试文档
├── test_import.py              # 测试脚本
└── test_result.json            # 测试结果输出

huananliu-web/frontend/admin/src/components/editor/
├── EditableContent.jsx         # 编辑器内容渲染
├── FormulaRenderer.jsx         # 公式渲染组件
├── WordImportButton.jsx        # 导入按钮组件
└── index.js                    # 组件导出
```

## 8. 后续优化方向

1. **公式渲染**: 集成 MathJax 实现 OMML→MathML→渲染
2. **样式扩展**: 支持更多 Word 样式（项目符号、编号列表）
3. **图片上传**: 将图片上传到 CDN 而非 base64
4. **性能优化**: 大文档分片处理
5. **ReactQuill 集成**: 提供专门的 ReactQuill 适配器
