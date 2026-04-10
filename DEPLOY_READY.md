# 🚀 部署准备就绪 - Vercel + GitHub Pages

## ✅ 已完成配置

### 文件结构
```
Arrival-Talking-to-the-Alien/
├── vercel.json              # Vercel 配置
├── api/
│   └── chat.js             # Vercel API (30s 超时)
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions 自动部署
├── deploy-to-vercel.sh     # Vercel 一键部署
├── deploy-frontend-gh.sh   # GitHub Pages 一键部署
├── VERCEL_DEPLOY.md        # 完整部署文档
└── modules/api/config.js   # 自动检测环境
```

---

## 🎯 部署流程（5分钟）

### Step 1: 初始化 Git 仓库（如未做）
```bash
cd Arrival-Talking-to-the-Alien
git init
git add .
git commit -m "Initial commit"
git branch -M main
```

### Step 2: 部署 API 到 Vercel（1分钟）
```bash
# 设置环境变量
export DEEPSEEK_API_KEY=sk-your-deepseek-key
export OPENAI_API_KEY=sk-your-openai-key  # 可选

# 安装 Vercel CLI
npm install -g vercel

# 登录并部署
vercel login
vercel --prod
```

部署成功后记录 URL：
```
✅ Production: https://arrival-chat-xxx.vercel.app
```

### Step 3: 更新前端 API 地址（30秒）
编辑 `modules/api/config.js`：
```javascript
// 找到这一行并更新
return 'https://arrival-chat-xxx.vercel.app/api/chat';
```

### Step 4: 推送到 GitHub（1分钟）
```bash
# 创建 GitHub 仓库（在 GitHub 网站上）
# 然后：
git remote add origin https://github.com/yi-jiaqi/arrival.git
git add .
git commit -m "Update API endpoint"
git push -u origin main
```

### Step 5: 启用 GitHub Pages（1分钟）
1. 访问：https://github.com/yi-jiaqi/arrival/settings/pages
2. Source: GitHub Actions
3. 等待自动部署完成（约1分钟）

---

## 🌐 最终 URL

| 部分 | URL |
|------|-----|
| 前端 | https://yi-jiaqi.github.io/arrival |
| API | https://arrival-chat-xxx.vercel.app/api/chat |

---

## 🔧 或者使用一键脚本

### 部署 API
```bash
./deploy-to-vercel.sh
```

### 部署前端
```bash
./deploy-frontend-gh.sh
```

---

## ✅ 验证

1. **API 测试**：
   ```bash
   curl https://arrival-chat-xxx.vercel.app/api/chat
   # 应该返回: {"ok":true,"service":"arrival-chat","provider":"vercel"}
   ```

2. **前端测试**：
   打开 https://yi-jiaqi.github.io/arrival
   输入问题，应该能看到外星人回复

---

## 📊 对比 Firebase 方案

| 特性 | Vercel + GitHub Pages | Firebase |
|------|----------------------|----------|
| 需要信用卡 | ❌ 不需要 | ✅ 需要 Blaze |
| 设置复杂度 | 简单 | 较复杂 |
| Function 超时 | 60s | 9分钟 |
| 冷启动 | 100-500ms | 1-3s |
| 免费额度 | 足够 | 更大 |
| 适合场景 | 快速上线 | 长期稳定 |

---

## ⚠️ 重要提示

**Vercel 免费版限制：**
- Serverless Function 超时：**60秒**（已配置 30s）
- 每月 125k 调用（你的项目肯定够用）

**GitHub Pages 限制：**
- 100GB 带宽/月
- 1GB 存储

---

## 🆘 故障排查

### CORS 错误
API 已配置 CORS，如果仍有错误，检查 `vercel.json` 是否正确上传。

### API 超时
如果 DeepSeek 响应慢，可能需要升级到 Vercel Pro（$20/月）。

### 环境变量问题
在 Vercel Dashboard 检查：
https://vercel.com/dashboard → 你的项目 → Settings → Environment Variables

---

**准备就绪！执行上面的 Step 1-5 即可部署 🎉**
