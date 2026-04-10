# Firebase 部署指南

## 架构

```
┌─────────────────────────────────────────────────────────────┐
│                    Firebase Hosting                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  index.html | sketch.js | modules/ | p5.js         │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │
              /chatgpt │ /health
                     │
┌────────────────────▼────────────────────────────────────────┐
│                 Cloud Functions (2nd gen)                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  • DeepSeek primary, OpenAI fallback               │   │
│  │  • 60s timeout (suitable for LLM calls)            │   │
│  │  • Secrets stored in Firebase Secret Manager       │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 免费额度

| 资源 | 免费额度 |
|------|----------|
| Functions 调用 | 2,000,000/月 |
| Functions 计算时间 | 400,000 GB-秒/月 |
| Hosting 带宽 | 10 GB/月 |
| Hosting 存储 | 1 GB |

对于 Arrival 项目，免费额度完全够用。

## 部署步骤

### 1. 安装 Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. 登录 Firebase

```bash
firebase login
```

### 3. 创建 Firebase 项目

```bash
firebase projects:create arrival-chat-art
# 或使用已有项目
firebase projects:list
```

### 4. 更新项目配置

编辑 `.firebaserc`，填入你的项目 ID：

```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

### 5. 设置 API 密钥（Secret Manager）

```bash
# 设置 DeepSeek API Key
firebase functions:secrets:set DEEPSEEK_API_KEY
# 输入你的 DeepSeek API Key

# 设置 OpenAI API Key（可选，用于 fallback）
firebase functions:secrets:set OPENAI_API_KEY
# 输入你的 OpenAI API Key
```

### 6. 部署

使用脚本一键部署：

```bash
./deploy-to-firebase.sh
```

或手动部署：

```bash
# 复制文件到 public/
cp index.html style.css sketch.js p5.js p5.sound.min.js public/
cp -r modules public/

# 安装依赖
cd functions && npm install && cd ..

# 部署 Functions
firebase deploy --only functions

# 部署 Hosting
firebase deploy --only hosting
```

## 验证部署

部署完成后，你会得到一个 URL：

```
✔ Deploy complete!

Project Console: https://console.firebase.google.com/project/your-project-id/overview
Hosting URL: https://your-project-id.web.app
```

测试 API：

```bash
# 健康检查
curl https://your-project-id.web.app/health

# API 调用
curl -X POST https://your-project-id.web.app/chatgpt \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello alien"}'
```

## 优势对比

| 特性 | Firebase | Vercel | Railway |
|------|----------|--------|---------|
| Function 超时 | 180s (3min, 可配 9min) | 60s | 无限制 |
| 冷启动 | 1-3s | 100-500ms | 几乎无 |
| 免费额度 | 200 万调用/月 | 100 万调用/月 | $5/月起 |
| 密钥管理 | Secret Manager | 环境变量 | 环境变量 |
| 静态托管 | ✅ | ✅ | ❌ |

Firebase 的 **60 秒超时** 对 LLM API 调用更友好，且 **Secret Manager** 更安全。

## 故障排查

### 函数部署失败

```bash
# 查看日志
firebase functions:log

# 检查 secrets 是否设置
firebase functions:secrets:get DEEPSEEK_API_KEY
```

### CORS 错误

已在前端和后端都配置了 CORS，如果仍有问题：

```bash
# 重新部署函数
firebase deploy --only functions
```

### 超时问题

当前已配置 **3 分钟**（180 秒），如需调整可编辑 `functions/index.js`：

```javascript
exports.chatgpt = onRequest(
  {
    secrets: [deepseekApiKey, openaiApiKey],
    timeoutSeconds: 180, // 当前: 3 分钟 (最大 9 分钟/540 秒)
    // ...
  },
  // ...
);
```

## 监控

在 Firebase Console 中查看：
- Functions 调用次数和延迟
- Hosting 带宽使用
- 日志和错误率

URL: https://console.firebase.google.com/project/your-project-id/functions
