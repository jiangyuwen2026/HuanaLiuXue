# 完整服务启动指南

## 服务架构

```
┌─────────────────────────────────────────────────────────────┐
│                     浏览器访问                                │
│              http://localhost:3002 (前端)                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
         ▼             ▼             ▼
┌────────────────┐ ┌──────────┐ ┌──────────────────┐
│  前端开发服务器  │ │ 主后端 API │ │  Word 导入服务   │
│  Port: 3002    │ │ Port:3001│ │  Port: 8081      │
│  (Vite + React)│ │ (Node.js)│ │  (Python/FastAPI)│
└────────────────┘ └──────────┘ └──────────────────┘
```

## 需要启动的服务

| 服务 | 端口 | 启动命令 | 说明 |
|------|------|----------|------|
| Word 导入服务 | 8081 | `python start.py --port 8081` | Python FastAPI |
| 主后端 API | 3001 | `npm run dev` (backend) | Node.js Express |
| 前端开发服务器 | 3002 | `npm run dev` (frontend) | Vite + React |

## 快速启动（推荐）

### 方式 1: 只使用 Word 导入功能（无需主后端）

```bash
# 终端 1: 启动 Word 导入服务
cd /Users/jiangyuwen/WorkBuddy/20260310085315/python-service
source .venv/bin/activate
python start.py --port 8081

# 终端 2: 启动前端
cd /Users/jiangyuwen/WorkBuddy/20260310085315/huananliu-web/frontend/admin
npm run dev
```

访问: http://localhost:3002

### 方式 2: 使用 WordImportDemo 组件测试

创建一个测试页面来验证功能：

```bash
# 1. 确保 Word 导入服务已启动
curl http://localhost:8081/health

# 2. 启动前端
cd /Users/jiangyuwen/WorkBuddy/20260310085315/huananliu-web/frontend/admin
npm run dev
```

## 分步详细说明

### 步骤 1: 启动 Word 导入服务

```bash
cd /Users/jiangyuwen/WorkBuddy/20260310085315/python-service

# 如果虚拟环境未激活
source .venv/bin/activate

# 启动服务
python start.py --port 8081

# 验证
curl http://localhost:8081/health
# 输出: {"status":"ok","service":"word-import"}
```

### 步骤 2: 启动前端开发服务器

```bash
cd /Users/jiangyuwen/WorkBuddy/20260310085315/huananliu-web/frontend/admin

# 安装依赖（如果未安装）
npm install

# 启动开发服务器
npm run dev

# 预期输出:
# VITE v5.x.x  ready in xxx ms
#
# ➜  Local:   http://localhost:3002/
# ➜  Network: http://192.168.x.x:3002/
```

### 步骤 3: 浏览器访问

打开浏览器访问：

```
http://localhost:3002
```

**注意**：不是 5174 或 8081，而是 **3002**

## 前端集成 Word 导入

### 1. 在现有页面中使用

编辑 `/src/pages/News.jsx` 或其他页面：

```jsx
import { WordImportButton, EditableContent } from '../components/editor';

function News() {
  const [importedContent, setImportedContent] = useState([]);
  
  return (
    <div>
      <h2>新闻管理</h2>
      
      {/* Word 导入按钮 */}
      <WordImportButton 
        onImport={setImportedContent}
        buttonText="导入 Word 文档"
      />
      
      {/* 显示导入的内容 */}
      {importedContent.length > 0 && (
        <EditableContent 
          value={importedContent}
          displayMode="pages"  // 或 "continuous"
        />
      )}
    </div>
  );
}
```

### 2. 创建独立测试页面

创建 `/src/pages/WordImportTest.jsx`：

```jsx
import { WordImportDemo } from '../components/editor';

export default function WordImportTest() {
  return <WordImportDemo />;
}
```

在 `/src/App.jsx` 中添加路由：

```jsx
import WordImportTest from './pages/WordImportTest';

// 在路由中添加
<Route path="/word-import" element={<WordImportTest />} />
```

访问: http://localhost:3002/word-import

## 常见问题

### Q1: 访问 localhost:3002 显示空白

**解决**: 检查前端是否正确启动
```bash
cd /Users/jiangyuwen/WorkBuddy/20260310085315/huananliu-web/frontend/admin
npm run dev
```

### Q2: 点击导入按钮无反应

**检查**:
1. Word 导入服务是否启动 (`curl http://localhost:8081/health`)
2. 浏览器控制台是否有错误
3. 网络请求是否 404

### Q3: 导入时提示 "导入失败"

**检查**:
1. 后端服务日志: `tail -f /tmp/word_service.log`
2. 文件是否为 .docx 格式
3. 文件是否损坏

### Q4: 如何修改前端端口

编辑 `vite.config.js`：

```javascript
server: {
  port: 3003,  // 改为其他端口
}
```

## 端口占用检查

```bash
# 检查端口占用
lsof -i :3001  # 主后端
lsof -i :3002  # 前端
lsof -i :8081  # Word 导入服务

# 释放端口
kill -9 <PID>
```

## 一键启动脚本

```bash
#!/bin/bash
# start-all.sh

echo "启动 Word 导入功能..."

# 启动 Word 导入服务
cd /Users/jiangyuwen/WorkBuddy/20260310085315/python-service
source .venv/bin/activate
python start.py --port 8081 &
WORD_PID=$!
echo "Word 导入服务 PID: $WORD_PID"

# 等待服务启动
sleep 2

# 启动前端
cd /Users/jiangyuwen/WorkBuddy/20260310085315/huananliu-web/frontend/admin
npm run dev &
FRONTEND_PID=$!
echo "前端服务 PID: $FRONTEND_PID"

echo ""
echo "服务已启动:"
echo "  - Word 导入服务: http://localhost:8081"
echo "  - 前端: http://localhost:3002"
echo ""
echo "按 Ctrl+C 停止所有服务"

wait
```

## 验证清单

- [ ] Word 导入服务: `curl http://localhost:8081/health`
- [ ] 前端服务: 访问 `http://localhost:3002`
- [ ] 导入按钮: 点击后出现文件选择框
- [ ] 导入成功: 显示文档内容和分页
