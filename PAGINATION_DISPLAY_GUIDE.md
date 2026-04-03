# Word 导入分页显示功能指南

## 功能概述

Word 文档导入后，根据文档中的**分页符**将内容分割成多个页面显示，提供类似 Word 的阅读体验。

## 显示模式

### 1. 分页显示模式 (`displayMode="pages"`)

每页内容独立显示，类似 Word 的页面视图：

- ✅ A4 纸张尺寸 (210mm × 297mm)
- ✅ 白色纸张背景 + 阴影效果
- ✅ 页面底部显示页码 (第 N 页 / 共 M 页)
- ✅ 页面导航栏（上一页/下一页/页码选择）
- ✅ 适合查看正式文档

```jsx
<EditableContent 
  value={content} 
  displayMode="pages"  // 分页显示
/>
```

### 2. 连续显示模式 (`displayMode="continuous"`)

所有内容在一个滚动区域连续显示：

- ✅ 分页符显示为虚线分隔线
- ✅ 适合编辑和快速浏览
- ✅ 更好的整体阅读体验

```jsx
<EditableContent 
  value={content} 
  displayMode="continuous"  // 连续显示
/>
```

## 使用示例

### 基础用法

```jsx
import { EditableContent, WordImportButton } from './components/editor';

function MyEditor() {
  const [content, setContent] = useState([]);
  const [displayMode, setDisplayMode] = useState('pages');
  
  return (
    <div>
      {/* 导入按钮 */}
      <WordImportButton onImport={setContent} />
      
      {/* 显示模式切换 */}
      <Radio.Group value={displayMode} onChange={e => setDisplayMode(e.target.value)}>
        <Radio.Button value="continuous">连续显示</Radio.Button>
        <Radio.Button value="pages">分页显示</Radio.Button>
      </Radio.Group>
      
      {/* 内容显示 */}
      <EditableContent 
        value={content} 
        displayMode={displayMode}
      />
    </div>
  );
}
```

### 完整示例

```jsx
import { WordImportDemo } from './components/editor';

function App() {
  return <WordImportDemo />;
}
```

## 分页符检测

### Word 中的分页符类型

| 类型 | Word 操作 | 检测方式 |
|------|-----------|----------|
| 分页符 | 布局 → 分隔符 → 分页符 | `w:br w:type="page"` |
| 分节符（下一页） | 布局 → 分隔符 → 下一页 | `w:sectPr` |

### 后端检测逻辑

```python
def has_page_break_in_para(para) -> bool:
    # 方法1: 检查 w:br w:type="page"
    for run in para.runs:
        for child in run._r:
            if child.tag.endswith('br'):
                br_type = child.get(qn('w:type'))
                if br_type == 'page':
                    return True
    
    # 方法2: 检查分节符 w:sectPr
    pPr = para._p.find(qn('w:pPr'))
    if pPr is not None:
        sectPr = pPr.find(qn('w:sectPr'))
        if sectPr is not None:
            return True
    return False
```

### 前端分割逻辑

```javascript
function splitContentByPageBreaks(nodes) {
  const pages = [];
  let currentPage = [];
  
  for (const node of nodes) {
    if (node.type === 'page-break') {
      if (currentPage.length > 0) {
        pages.push(currentPage);
        currentPage = [];
      }
    } else {
      currentPage.push(node);
    }
  }
  
  if (currentPage.length > 0) {
    pages.push(currentPage);
  }
  
  return pages;
}
```

## 页面样式

### A4 纸张尺寸

```javascript
const pageStyle = {
  width: '794px',       // 210mm at 96dpi
  minHeight: '1123px',  // 297mm at 96dpi
  padding: '60px 80px', // 页边距
  backgroundColor: '#fff',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  margin: '20px auto'
};
```

### 页面容器

```jsx
function PageContainer({ pageNumber, children, totalPages }) {
  return (
    <div className="document-page" style={pageStyle}>
      <div style={{ minHeight: '900px' }}>
        {children}
      </div>
      <div style={{ textAlign: 'center', fontSize: '12px', color: '#999' }}>
        {pageNumber} / {totalPages}
      </div>
    </div>
  );
}
```

## 页面导航

### 导航栏功能

- **上一页/下一页按钮**: 快速翻页
- **页码显示**: 当前页 / 总页数
- **页码选择器**: 直接跳转到指定页面

```jsx
<div className="page-navigation">
  <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 0}>
    上一页
  </button>
  
  <span>第 {currentPage + 1} 页 / 共 {pages.length} 页</span>
  
  <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === pages.length - 1}>
    下一页
  </button>
  
  <select value={currentPage} onChange={e => setCurrentPage(Number(e.target.value))}>
    {pages.map((_, i) => (
      <option key={i} value={i}>第 {i + 1} 页</option>
    ))}
  </select>
</div>
```

## 响应式考虑

### 小屏幕适配

分页显示模式在小屏幕上可能需要缩放：

```css
@media (max-width: 900px) {
  .document-page {
    transform: scale(0.8);
    transform-origin: top center;
  }
}
```

### 打印样式

```css
@media print {
  .document-page {
    box-shadow: none;
    margin: 0;
    page-break-after: always;
  }
}
```

## 组件 API

### EditableContent Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` | `Array` | `[]` | Slate 节点数组 |
| `displayMode` | `'continuous' \| 'pages'` | `'pages'` | 显示模式 |
| `readOnly` | `boolean` | `false` | 是否只读 |
| `onChange` | `Function` | - | 内容变化回调 |

### WordImportButton Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `onImport` | `Function` | - | 导入成功回调 |
| `buttonText` | `string` | `'导入 Word'` | 按钮文字 |
| `buttonType` | `string` | `'default'` | 按钮类型 |
| `defaultDisplayMode` | `'continuous' \| 'pages'` | `'pages'` | 预览默认显示模式 |

## 使用场景

### 场景1: 文档预览

使用分页显示模式，提供类似 Word 的阅读体验：

```jsx
<EditableContent value={content} displayMode="pages" readOnly />
```

### 场景2: 文档编辑

使用连续显示模式，方便编辑和查看整体结构：

```jsx
<EditableContent 
  value={content} 
  displayMode="continuous"
  onChange={setContent}
/>
```

### 场景3: 打印导出

分页显示模式更接近打印效果：

```jsx
<EditableContent 
  value={content} 
  displayMode="pages"
  style={{ printColorAdjust: 'exact' }}
/>
```

## 常见问题

### Q1: 分页符未正确分割页面

**检查**:
1. Word 中是否正确插入了分页符（不是手动换行）
2. 后端是否正确检测到分页符节点
3. 前端 `splitContentByPageBreaks` 函数是否正确分割

### Q2: 页面显示不完整

**原因**: A4 尺寸固定为 794×1123 像素，内容过多时会溢出。

**解决**: 
- 设置 `overflow: 'auto'` 允许滚动
- 或使用 `minHeight` 让页面自动扩展

### Q3: 如何在分页显示模式下显示所有页面

可以修改组件支持"显示所有页面"选项：

```jsx
// 在 EditableContent 组件中
{displayMode === 'pages' && showAllPages && pages.map((page, i) => (
  <PageContainer key={i} pageNumber={i + 1} totalPages={pages.length}>
    {page.map((node, j) => renderNode(node, j))}
  </PageContainer>
))}
```

## 后续优化

1. **缩略图导航**: 左侧显示页面缩略图
2. **缩放功能**: 支持页面缩放（50% - 200%）
3. **双页显示**: 类似 Word 的并排双页视图
4. **页眉页脚**: 支持自定义页眉页脚
5. **打印优化**: 添加打印样式和打印预览
