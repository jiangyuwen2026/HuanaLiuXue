# 连接问题故障排除

## 当前服务状态

```
服务:      Word 导入服务
端口:      8081
进程:      63593
状态:      ✅ 运行中
API 测试:  ✅ 正常
```

## 正确的访问地址

| 地址 | 说明 |
|------|------|
| http://localhost:8081 | ✅ 正确 |
| http://127.0.0.1:8081 | ✅ 正确 |
| http://localhost:8000 | ❌ 端口错误 |
| http://localhost:8080 | ❌ 端口错误 |

## 快速诊断

### 1. 浏览器直接访问
```
http://localhost:8081/health
```

### 2. 如果显示拒绝连接，检查：

#### 检查 A: 服务是否真的在运行
```bash
curl http://localhost:8081/health
```
预期输出: `{"status":"ok","service":"word-import"}`

#### 检查 B: 端口是否正确
```bash
lsof -i :8081 | grep python
```
预期输出: 显示 python 进程在监听 8081

#### 检查 C: 使用 IP 地址代替 localhost
```
http://127.0.0.1:8081/health
```

### 3. 常见错误

#### 错误: ERR_CONNECTION_REFUSED
**原因**: 服务未启动或使用了错误端口
**解决**: 
```bash
cd /Users/jiangyuwen/WorkBuddy/20260310085315/python-service
source .venv/bin/activate
python start.py --port 8081
```

#### 错误: 404 Not Found
**原因**: 路径错误
**正确路径**:
- `/health` - 健康检查
- `/docs` - API 文档
- `/api/import/docx` - 导入接口
- `/api/import/formats` - 格式列表

#### 错误: 无法访问此网站
**可能原因**:
1. 浏览器缓存 - 尝试 Ctrl+Shift+R 强制刷新
2. 防火墙/代理 - 检查系统代理设置
3. hosts 文件 - 检查 localhost 是否指向 127.0.0.1

## 重启服务步骤

如果服务停止，按以下步骤重启：

```bash
# 1. 停止现有服务
pkill -f "python.*start.py"

# 2. 确认端口释放
lsof -i :8081

# 3. 启动服务
cd /Users/jiangyuwen/WorkBuddy/20260310085315/python-service
source .venv/bin/activate
python start.py --port 8081

# 4. 验证
open http://localhost:8081/docs
```

## 测试导入功能

```bash
cd /Users/jiangyuwen/WorkBuddy/20260310085315/python-service

curl -X POST -F "file=@test.docx" http://localhost:8081/api/import/docx
```

## 前端配置

前端已配置为使用 8081 端口:

```javascript
// config.js
return 'http://localhost:8081';
```

如果更改了端口，需要同步更新前端配置。

## 一键修复脚本

```bash
cd /Users/jiangyuwen/WorkBuddy/20260310085315
./fix-and-start.sh
```

## 查看日志

```bash
tail -f /tmp/word_service.log
```
