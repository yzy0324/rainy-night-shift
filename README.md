# Rainy Night Shift / 雨夜值班

> Version / 版本: **1.4.0**

---

## 中文

### 1) 游戏标题
**雨夜值班**（Rainy Night Shift）

### 2) 简介（无剧透）
你是北桥站夜班值班员。暴雨中的电话、异常的站台信号、互相矛盾的口供，让这次值班逐渐偏离常规。

《雨夜值班》是一款以“调度台”为叙事舞台的文字悬疑游戏。你将通过接听电话、整理线索与做出关键判断，逐步拼出真相轮廓。你的每一个决定都会留下痕迹，并导向不同结局。

### 3) 类型
**文字悬疑 / 心理惊悚叙事游戏**

### 4) 如何游玩
- 阅读当前场景文本。
- 点击选项推进剧情。
- 观察并利用线索：
  - 桌面端为右侧线索面板。
  - 移动端为底部线索抽屉。
- 到达结局后，结局会记录进档案；重复游玩可探索分支与隐藏内容。

### 5) 本地运行方式
本项目为静态网页游戏，无需构建。

方式 A（推荐）：

```bash
node server.js
```

浏览器访问：`http://localhost:3000`

方式 B：
- 直接打开 `index.html`（`file://`）
- 若出现资源加载限制，请改用方式 A。

### 6) 项目结构
```text
.
├─ index.html              # 页面入口
├─ style.css               # 样式与响应式布局
├─ game.js                 # 启动入口（连接引擎与 UI）
├─ server.js               # 本地静态服务器
├─ data/
│  ├─ metadata.js          # 元数据（版本、起始场景）
│  ├─ scenes.js            # 场景与选项数据
│  ├─ clues.js             # 线索定义
│  └─ endingHints.js       # 结局后系统提示
├─ src/
│  ├─ engine.js            # 叙事引擎
│  ├─ state.js             # 状态管理
│  ├─ effects.js           # 选项效果处理
│  ├─ conditions.js        # 条件判定
│  ├─ ui.js                # 界面渲染
│  └─ archive.js           # 结局档案系统
└─ tools/
   └─ verify-all.js        # 完整性校验脚本
```

### 7) 核心特性
- 场景化叙事（scene-based narrative）
- 线索面板（clue panel）
- 移动端线索抽屉（mobile clue drawer）
- 结局档案（ending archive）
- 结局后系统提示（post-ending system hints）
- 二周目惊悚记忆（second-run horror memory）
- 证据质量分级结局（evidence-quality endings）
- 陈明支线回收（Chen Ming branch payoff）

### 8) 验证
```bash
node tools/verify-all.js
```

### 9) GitHub Pages 部署
1. 将仓库推送到 GitHub。
2. 打开仓库 **Settings → Pages**。
3. 在 **Build and deployment** 中选择 **Deploy from a branch**。
4. 分支选择 `main`（或你的默认分支），目录选择 `/ (root)`。
5. 保存后等待部署完成。
6. 访问：`https://<your-username>.github.io/<repo-name>/`

### 10) 剧透警告
> 以下内容包含结局信息。建议至少完成一轮游玩后再展开。部分结局为隐藏结局。

### 11) 结局列表（剧透）
<details>
<summary>点击展开结局列表（Spoilers）</summary>

| Internal ID | Ending Title |
|---|---|
| ending_loose_ends | 也许是，也许不是 |
| ending_silence | 信号静默 |
| ending_bad_alone | 独自承担 |
| ending_rescue_but_partial_truth | 救援，不完整 |
| ending_failed_interception | 拦截失败 |
| ending_full_truth | 完整的真相 |
| ending_full_truth_complete | 完整证据链 |
| ending_true_horror | 旧三号站台 |
| ending_lin_xia_left_behind | 林夏不见了 |
| ending_taken_by_shift | 你成了值班室 |

其中部分结局为隐藏路线，需要特定前置选择与多轮探索。
</details>

### 12) 开发说明
- 原生 HTML / CSS / JavaScript，无框架依赖。
- 采用场景数据驱动：文本、选项、条件、效果均由数据层控制。
- 结局档案基于本地存储，支持多轮路线探索。
- 建议每次改动叙事数据后执行 `node tools/verify-all.js` 做完整性回归检查。

---

## English

### 1) Game Title
**Rainy Night Shift** (雨夜值班)

### 2) Short Description (Spoiler-Free)
You are the night-shift dispatcher at Beiqiao Station. In a storm-soaked shift filled with strange calls, inconsistent accounts, and abnormal platform signals, routine duty slowly turns into a layered investigation.

*Rainy Night Shift* is a text-based suspense narrative game set around a dispatch console. By handling calls, organizing clues, and making critical decisions, you shape how the night unfolds and which truth you reach.

### 3) Genre
**Text-based suspense / psychological horror narrative game**

### 4) How to Play
- Read the current scene text.
- Click a choice to progress.
- Track and use clues:
  - Desktop: right-side clue panel.
  - Mobile: bottom clue drawer.
- Endings are saved to your archive; replay to discover branching and hidden outcomes.

### 5) How to Run Locally
This project is a static web game and does not require a build step.

Option A (recommended):

```bash
node server.js
```

Open: `http://localhost:3000`

Option B:
- Open `index.html` directly via `file://`
- If asset loading is blocked by browser policy, use Option A.

### 6) Project Structure
```text
.
├─ index.html              # App entry page
├─ style.css               # Styling + responsive layout
├─ game.js                 # Bootstrap entry (engine + UI wiring)
├─ server.js               # Local static server
├─ data/
│  ├─ metadata.js          # Metadata (version, start scene)
│  ├─ scenes.js            # Scene and choice data
│  ├─ clues.js             # Clue definitions
│  └─ endingHints.js       # Post-ending system hints
├─ src/
│  ├─ engine.js            # Narrative engine
│  ├─ state.js             # State management
│  ├─ effects.js           # Choice effect handling
│  ├─ conditions.js        # Condition checks
│  ├─ ui.js                # UI renderer
│  └─ archive.js           # Ending archive system
└─ tools/
   └─ verify-all.js        # Full integrity verification
```

### 7) Core Features
- Scene-based narrative
- Clue panel
- Mobile clue drawer
- Ending archive
- Post-ending system hints
- Second-run horror memory
- Evidence-quality endings
- Chen Ming branch payoff

### 8) Verification
```bash
node tools/verify-all.js
```

### 9) GitHub Pages Deployment
1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Choose `main` (or your default branch) and `/ (root)`.
5. Save and wait for deployment.
6. Visit: `https://<your-username>.github.io/<repo-name>/`

### 10) Spoiler Warning
> The section below contains ending information. It is recommended to finish at least one run first. Some endings are hidden.

### 11) Ending List (Spoilers)
<details>
<summary>Click to expand ending list</summary>

| Internal ID | Ending Title |
|---|---|
| ending_loose_ends | Maybe, Maybe Not |
| ending_silence | Signal Silence |
| ending_bad_alone | Alone With It |
| ending_rescue_but_partial_truth | Rescue, Incomplete |
| ending_failed_interception | Interception Failed |
| ending_full_truth | The Full Truth |
| ending_full_truth_complete | Complete Evidence Chain |
| ending_true_horror | Old Platform Three |
| ending_lin_xia_left_behind | Lin Xia Was Left Behind |
| ending_taken_by_shift | You Became the Shift |

Some outcomes are hidden and require specific setup choices across runs.
</details>

### 12) Development Notes
- Built with plain HTML / CSS / JavaScript (no framework build pipeline).
- Data-driven scene architecture for text, choices, conditions, and effects.
- Ending archive uses local storage to support multi-run route discovery.
- Run `node tools/verify-all.js` after narrative/content changes for regression checks.
