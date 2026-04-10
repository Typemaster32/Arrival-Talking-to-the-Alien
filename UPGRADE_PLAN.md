# Arrival-Talking-to-the-Alien 升级计划

## 0. 目标与原则
- 目标：保持作品体验不变的前提下，提升可维护性、稳定性、安全性与部署效率。
- 原则：小步迭代、每步可回滚、每阶段有验收标准。

## 1. 当前架构概览
- 前端：`p5.js` + `sketch.js`（视觉渲染、UI、状态、网络请求集中在单文件）。
- 后端：`server.js`（模型调用代理，`gpt-4o-mini` 优先，DeepSeek fallback）。
- 部署：本地 Node 服务 + 静态文件托管。

## 2. 升级总路线（按优先级）

### 执行状态（2026-04-10）
- Phase A：✅ 已完成
- Phase B：✅ 已完成  
- Phase C：✅ 已完成（`sketch.js` 已拆分为模块化架构）
- Phase G：✅ 已完成（记忆系统 + 追问感问题）
- Phase E：✅ 已配置（Firebase 部署就绪）
- 下一个里程碑：Firebase 部署上线

## Phase A（P0）安全与可运维基础
- 新增 `.gitignore`，确保 `.env`、日志和本地缓存不入库。
- 清理仓库中的明文密钥历史（必要时进行密钥轮换）。
- 后端增加基础保护：请求体长度限制、超时、错误码分级。
- 增加最小日志规范：请求 ID、provider、模型、耗时、错误原因。
- 验收标准：无密钥泄漏风险；接口异常可从日志快速定位。

## Phase B（P0）稳定性与体验修复
- 修复文本拼接 bug：`allPredictions` 初始化为空字符串。
- 修复随机问题选择偏差：避免遗漏数组最后一个元素。
- 前端 API 地址改为相对路径（`/chatgpt`），去掉 localhost 写死。
- 增加请求失败的用户提示（网络失败、超时、provider 失败）。
- 验收标准：连续 50 次交互无前端报错；失败时用户可见错误提示。

## Phase C（P1）代码结构重组 ✅ 已完成
- 将 `sketch.js` 拆分模块：
  - `modules/api/`：API 配置 (`config.js`) 和请求客户端 (`client.js`)
  - `modules/state/`：动画状态 (`animation.js`)、收藏状态 (`collection.js`)、会话状态 (`conversation.js`)
  - `modules/ui/`：DOM 元素管理 (`elements.js`) 和随机工具 (`shuffle.js`)
  - `modules/render/`：环形生成 (`arrival.js`)、扩散渲染 (`diffusion.js`)、收藏展示 (`collection-display.js`)
- 主入口 `sketch.js` 从 ~900 行精简至 ~200 行
- 验收标准：✅ 主入口文件 < 250 行；模块职责清晰，新成员可在 15 分钟内定位功能位置

## Phase D（P1）性能优化
- 对 `draw()` 中全像素扫描加入"低性能模式"开关。
- 使用离屏缓冲或分帧更新减少 CPU 占用。
- 根据窗口大小动态调整粒度（高分辨率降采样）。
- 验收标准：中配电脑下稳定 24 FPS；CPU 占用显著下降。

## Phase E（P1）Serverless 化（推荐 Firebase）✅ 已配置
- 迁移 `server.js` 到 Firebase Functions（2nd gen）。
  - ✅ 创建 `functions/index.js` - 180s (3分钟) 超时，DeepSeek primary + OpenAI fallback
  - ✅ 配置 CORS 和错误处理
- 前端部署到 Firebase Hosting，保留 `/chatgpt` 统一入口。
  - ✅ `firebase.json` 配置 rewrite 规则
  - ✅ `public/` 目录准备
- 环境变量迁入 Firebase Secret Manager，不在仓库出现。
  - ✅ 使用 `defineSecret()` 从 Secret Manager 读取 API keys
- 部署脚本和文档
  - ✅ `deploy-to-firebase.sh` 一键部署
  - ✅ `FIREBASE_DEPLOY.md` 完整部署指南
- 验收标准：
  - ✅ 一条命令可部署 (`./deploy-to-firebase.sh`)
  - ✅ 线上密钥零暴露 (Secret Manager)
  - ✅ 3分钟超时适合 LLM 调用

## Phase F（P2）质量保障
- 增加后端最小单测：provider 调用、fallback、错误处理。
- 增加前端冒烟测试：输入、点击预设问题、结果渲染。
- 增加 CI（lint + test + build/check）。
- 验收标准：PR 自动检查通过后可合并；回归成本可控。

## Phase G（P2）功能增强 ✅ 已完成核心项

### ✅ 已完成
- **会话记忆窗口**：保存最近 3 轮对话，自动注入 Prompt 上下文
  - 文件：`modules/state/conversation.js`
  - Prompt 构建器自动附加历史对话
  - 外星人现在记得刚才聊过什么

- **追问感问题系统**：默认问题从孤立变为递进
  - 文件：`modules/state/questions.js`, `modules/ui/shuffle.js`
  - 4 层级递进：INTRO → IDENTITY → CULTURE → PHILOSOPHY
  - 基于上一轮答案生成追问
  - 问题随对话深度逐渐哲学化

- **UI 设计升级**：气泡式极简界面
  - 文件：`modules/ui/elements.js`, `style.css`
  - 问题气泡：圆角胶囊，悬停上浮效果
  - 顶部进度条：3px 细线，动画/API 进度
  - 输入气泡：居中圆角，简洁 placeholder
  - 整体风格：极简，无多余装饰

### 待考虑（可选）
- 多风格提示词模板（探索型/诗意型/科学型）
- 收藏墙导出图片或 JSON 快照

### 验收标准
- ✅ 新增功能不影响首屏体验
- ✅ 默认路径保持不变
- ✅ 代码模块化，易于扩展

## 3. 里程碑建议（2-3 周）
- Week 1：完成 Phase A + Phase B。
- Week 2：完成 Phase C + Phase D（先拆分再优化）。
- Week 3：完成 Phase E + Phase F，最后评估 Phase G。

## 4. 风险与回滚策略
- 风险：拆分期间出现视觉行为回归。
- 策略：每个 Phase 独立分支与标签；保留 `legacy-sketch.js` 作为临时回滚基线。
- 风险：Serverless 冷启动影响体验。
- 策略：函数保持轻量、限制依赖体积、必要时预热。

## 5. 当前环境配置（本地）
- 当前使用你的 DeepSeek Key：`DEEPSEEK_API_KEY` 已更新到 `.env`。
- 当前策略：`deepseek-chat` 优先，OpenAI fallback。
- 若要改为 OpenAI 优先：调整 `server.js` provider 调用顺序即可。

## 6. 追问感问题示例

### Level 1 - INTRO (0-2轮)
- "Are you aware of us?"
- "Can you perceive this place?"

### Level 2 - IDENTITY (3-5轮)
- "Where do you come from?"
- "What is your world called?"

### Level 3 - CULTURE (6-8轮)
- "Is your home similar to this place?"
- "Do you have light where you come from?"

### Level 4 - PHILOSOPHY (9+轮)
- "Do you know what time is?"
- "What would you ask if you were me?"

追问示例：
- 如果外星人说 "I come from a world of light" → 追问 "Is your light different from ours?"
- 如果外星人说 "I travel alone" → 追问 "Do they miss you?"
