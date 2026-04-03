# Word 分页显示 - 快速开始

## 1. 启动后端服务

```bash
cd /Users/jiangyuwen/WorkBuddy/20260310085315/python-service
python start.py
```

## 2. 使用分页显示组件

### 基础用法

```jsx
import { EditableContent, WordImportButton } from './components/editor';

function App() {
  const [content, setContent] = useState([]);
  
  return (
    <div>
      <WordImportButton onImport={setContent} />
      <EditableContent value={content} displayMode="pages" />
    </div>
  );
}
```

### 切换显示模式

```jsx
const [mode, setMode] = useState('pages'); // 'pages' 或 'continuous'

<Radio.Group value={mode} onChange={e => setMode(e.target.value)}>
  <Radio.Button value="continuous">连续显示</Radio.Button>
  <Radio.Button value="pages">分页显示</Radio.Button>
</Radio.Group>

<EditableContent value={content} displayMode={mode} />
```

## 3. 完整示例

```jsx
import { WordImportDemo } from './components/editor';

function App() {
  return <WordImportDemo />;
}
```

## 4. 效果预览

### 分页显示模式 (`displayMode="pages"`)

```
┌─────────────────────────────────────────┐
│  ← 上一页  第 1 页 / 共 3 页  下一页 →  │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │     第 1 页内容                 │   │
│  │                                 │   │
│  │                                 │   │
│  │                         1 / 3   │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### 连续显示模式 (`displayMode="continuous"`)

```
┌─────────────────────────────────────────┐
│  第 1 页内容                            │
│  ...                                    │
│  ─────────── 分页符 ───────────         │
│  第 2 页内容                            │
│  ...                                    │
│  ─────────── 分页符 ───────────         │
│  第 3 页内容                            │
└─────────────────────────────────────────┘
```

## 5. 文件清单

```
python-service/
├── app/api/import_doc.py       # Word 导入 API
├── start.py                     # 启动脚本
└── ...

huananliu-web/frontend/admin/src/components/editor/
├── EditableContent.jsx          # ✅ 分页显示组件
├── FormulaRenderer.jsx          # 公式渲染
├── WordImportButton.jsx         # ✅ 导入按钮（支持预览）
├── WordImportDemo.jsx           # ✅ 完整示例
└── index.js                     # 组件导出
```

## 6. 关键特性

| 特性 | 说明 |
|------|------|
| 分页符检测 | 支持 `w:br w:type="page"` 和 `w:sectPr` |
| 页面尺寸 | A4 (210mm × 297mm) |
| 页码显示 | 页面底部显示 "N / M" |
| 页面导航 | 上一页/下一页/页码选择 |
| 显示模式 | 分页显示 / 连续显示 可切换 |

## 7. 测试导入

```bash
cd /Users/jiangyuwen/WorkBuddy/20260310085315/python-service

# 创建测试文档
python create_test_doc.py

# 测试导入
python test_import.py test.docx
```
