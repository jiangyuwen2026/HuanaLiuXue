# 修复 iframe 跨域错误

## 错误原因

```
Unsafe attempt to load URL http://localhost:3002/ from frame with URL chrome-error://chromewebdata/
```

这个错误表示：
1. **前端服务 (端口 3002) 没有运行**
2. 浏览器尝试访问 `http://localhost:3002/` 但失败了
3. Chrome 显示错误页面 `chrome-error://chromewebdata/`

## 解决方案

### 步骤 1: 启动前端开发服务器

在**新终端窗口**中运行：

```bash
cd /Users/jiangyuwen/WorkBuddy/20260310085315/huananliu-web/frontend/admin
npm run dev
```

等待看到以下输出：
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3002/
➜  Network: http://192.168.x.x:3002/
```

### 步骤 2: 刷新页面

按 `Ctrl+Shift+R` 强制刷新浏览器

## 验证服务状态

```bash
# 检查 3002 端口
curl http://localhost:3002

# 检查 Word 导入服务
curl http://localhost:8081/health
```

## 正确的访问流程

```
浏览器访问 http://localhost:3002
           ↓
    Vite 开发服务器响应
           ↓
    页面加载完成
           ↓
    点击"导入 Word"按钮
           ↓
    调用 http://localhost:8081/api/import/docx
```

## 常见问题

### Q: 为什么不是直接访问 3002？

如果您是在其他网站中嵌入 iframe 访问 3002，需要确保：
1. 3002 端口的服务已启动
2. iframe 的 src 地址正确

### Q: 如果要在其他网站嵌入 Word 导入功能

需要修改后端允许跨域：

```python
# app/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 一键修复

```bash
# 1. 确保 Word 导入服务运行
curl http://localhost:8081/health || (
    cd python-service && source .venv/bin/activate && python start.py --port 8081 &
)

# 2. 启动前端服务
cd huananliu-web/frontend/admin && npm run dev

# 3. 访问
open http://localhost:3002
```
