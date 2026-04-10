# Vercel + GitHub Pages 部署指南

## 架构

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Pages                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  index.html | sketch.js | modules/ | p5.js         │   │
│  │  URL: yi-jiaqi.github.io/arrival                   │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │
            POST /api/chat
                     │
┌────────────────────▼────────────────────────────────────────┐
│                      Vercel                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  api/chat.js - Serverless Function                 │   │
│  │  • DeepSeek primary, OpenAI fallback               │   │
│  │  • 30s timeout                                     │   │
│  │  • Environment variables (no Secrets needed)       │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 免费额度

| 平台 | 免费额度 |
|------|----------|
| **Vercel** | 100GB 带宽/月，125k 调用/月 |
| **GitHub Pages** | 100GB 带宽/月，1GB 存储 |

对于 Arrival 项目完全够用。

## 部署步骤

### 1. 准备工作

确保你在 `Arrival-Talking-to-the-Alien` 目录下，且是 git 仓库：

```bash
cd Arrival-Talking-to-the-Alien
git init
git add .
git commit -m "Initial commit"
```

### 2. 设置环境变量

```bash
# DeepSeek API Key (必需)
export DEEPSEEK_API_KEY=sk-...

# OpenAI API Key (可选，用于 fallback)
export OPENAI_API_KEY=sk-...
```

添加到 `~/.bashrc` 或 `~/.zshrc` 使其永久生效。

### 3. 部署 API 到 Vercel

```bash
# 安装 Vercel CLI（如未安装）
npm install -g vercel

# 登录
vercel login

# 部署（会自动检测 vercel.json）
vercel --prod
```

部署成功后，你会得到一个 URL：
```
✅  Production: https://arrival-chat-xxx.vercel.app
```

### 4. 部署前端到 GitHub Pages

#### 4.1 推送到 GitHub

```bash
# 创建 GitHub 仓库（在 GitHub 网站上操作）
# 然后：
git remote add origin https://github.com/yi-jiaqi/arrival.git
git push -u origin main
```

#### 4.2 启用 GitHub Pages

1. 打开仓库设置：https://github.com/yi-jiaqi/arrival/settings/pages
2. Source: GitHub Actions
3. 我们的 `.github/workflows/deploy.yml` 会自动部署

#### 4.3 更新 API 地址

编辑 `modules/api/config.js`，将 endpoint 改为 Vercel URL：

```javascript
const API_CONFIG = {
    timeoutMs: 30000,
    endpoint: 'https://arrival-chat-xxx.vercel.app/api/chat'
};
```

然后推送：
```bash
git add .
git commit -m "Update API endpoint"
git push
```

### 5. 一键部署脚本

或者使用我们准备的脚本：

```bash
# 部署 API
./deploy-to-vercel.sh

# 部署前端（运行后输入 Vercel URL）
./deploy-frontend-gh.sh
```

## 验证部署

1. **API 健康检查**：
   ```bash
   curl https://arrival-chat-xxx.vercel.app/api/chat
   ```

2. **前端访问**：
   打开 https://yi-jiaqi.github.io/arrival

3. **完整测试**：
   在网页上问一个问题，看是否能收到外星人回复

## 更新部署

### 更新 API（Vercel）
```bash
vercel --prod
```

### 更新前端（GitHub Pages）
```bash
git add .
git commit -m "Update frontend"
git push
```

GitHub Actions 会自动部署。

## 故障排查

### CORS 错误
Vercel 已配置 CORS，如果仍有错误：
```bash
vercel --prod
```

### API 超时
Vercel Hobby 计划限制 10s（边缘）/ 60s（Serverless）。
如果不够，考虑升级到 Pro 或使用 Firebase。

### 环境变量未生效
检查 Vercel Dashboard：
https://vercel.com/dashboard → 你的项目 → Settings → Environment Variables

确保添加了：
- `DEEPSEEK_API_KEY`
- `OPENAI_API_KEY` (可选)

## 比较：Vercel vs Firebase

| 特性 | Vercel | Firebase |
|------|--------|----------|
| 需要信用卡 | ❌ 不需要 | ✅ 需要（Blaze 计划）|
| Function 超时 | 10s-60s | 9 分钟 |
| Secrets 管理 | 环境变量 | Secret Manager |
| 冷启动 | 100-500ms | 1-3s |
| 免费额度 | 125k 调用 | 2M 调用 |
| 设置复杂度 | 简单 | 较复杂 |

**Vercel 更适合**：快速上线、无需绑卡、轻量级项目
