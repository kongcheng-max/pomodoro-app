# 技术架构概要

> 本文档为开发团队提供技术选型、项目结构和数据模型参考。
> 标注 `[MVP]` 为第一版必须实现；`[P1]` 为第二版迭代。

---

## 1. 技术栈建议

### 推荐方案：React + Vite + TypeScript

| 层级 | 技术 | 选型理由 |
|------|------|----------|
| 框架 | **React 19** | 生态成熟，社区资源丰富，Hooks 适合状态管理 |
| 构建 | **Vite 8** | 秒级 HMR，零配置启动，PWA 插件开箱即用 |
| 语言 | **TypeScript 6** | 类型安全，提升代码可维护性 |
| 样式 | **Tailwind CSS 4**（Vite 插件） | 原子化 CSS，CSS-first 配置，移动端优先响应式 |
| 代码检查 | **oxlint** | Rust 编写，速度远超 ESLint |
| 状态管理 | **Zustand 5** | 比 Redux 轻量，API 简洁，适合中小型应用 |
| 路由 | **React Router v6** `[P1]` | MVP 阶段单页面可能不需要，多页面时引入 |
| 图标 | **Lucide React** | 轻量、Tree-shaking 友好 |
| 通知 | **浏览器 Notification API** | 无额外依赖 |
| 存储 | **localStorage** `[MVP]` → **IndexedDB (Dexie.js)** `[P1]` | 数据量增大时迁移 |
| PWA | **vite-plugin-pwa** `[P1]` | service worker 自动生成，离线缓存 |
| 测试 | **Vitest + React Testing Library** `[P1]` | 与 Vite 同生态 |
| 部署 `[MVP]` | **GitHub Pages** | 免费、绑定自定义域名、国内基本可访问 |
| 部署 `[P1]` | **阿里云 OSS 静态网站托管** | 国内 CDN 加速、免备案域名、与 npm 镜像/统计同一生态 |

### 备选方案

| 方案 | 适用场景 |
|------|----------|
| **Vanilla JS + HTML + CSS** | 如果团队想最快速 MVP，不介意后期重构 |
| **Vue 3 + Vite** | 团队更熟悉 Vue 生态 |
| **Svelte** | 追求极致轻量，但生态相对小 |

### 国内开发环境配置

> ⚠️ 针对国内网络，以下配置建议写入项目 `.npmrc` 和 README。
> 
> **统一厂商策略**：所有外部服务统一使用**阿里云生态**，避免混用不同厂商导致
> 账号管理混乱、账单分散、服务间网络延迟不可控。

| 资源 | 默认源（可能慢/不可用） | 国内替代（阿里云生态） |
|------|------------------------|----------------------|
| npm registry | `registry.npmjs.org` | `registry.npmmirror.com`（阿里-淘宝镜像） |
| Google Fonts | `fonts.googleapis.com` | **不用** — 优先系统字体 |
| 图标/资源 CDN | unpkg / jsDelivr | **本地打包**（Vite tree-shaking 已天然支持） |
| Tailwind CSS CDN | Play CDN | **不用 CDN** — Vite + PostCSS 构建时编译 |
| 静态资源托管 `[P1]` | — | **阿里云 OSS** + CDN 加速 |
| 统计分析 `[P1]` | Google Analytics | **友盟+** Web 统计（阿里系） |
| 后端服务 `[P2+]` | — | **阿里云函数计算 FC** (Serverless) |

**.npmrc 建议配置：**

```ini
registry=https://registry.npmmirror.com
```

---

## 2. 项目结构 `[MVP]`

```
pomodoro-app/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── PomodoroTimer/     # 番茄钟组件
│   │   │   ├── index.tsx
│   │   │   ├── TimerDisplay.tsx     # 倒计时显示
│   │   │   ├── TimerControls.tsx    # 开始/暂停/放弃按钮
│   │   │   └── TimerSettings.tsx    # 时长/模式设置
│   │   ├── TodoList/          # 待办组件
│   │   │   ├── index.tsx
│   │   │   ├── TodoItem.tsx         # 单条待办
│   │   │   ├── TodoInput.tsx        # 添加输入框
│   │   │   └── TodoStats.tsx        # 统计栏
│   │   ├── Stats/              # 统计图表 `[P1·待建]`
│   │   │   ├── index.tsx
│   │   │   ├── DailyChart.tsx
│   │   │   └── StreakCounter.tsx
│   │   ├── Achievements/       # 成就组件 `[P1·待建]`
│   │   │   ├── index.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── BadgeWall.tsx
│   │   └── Layout/             # 布局组件
│   │       └── Header.tsx       # 顶部导航（含深色主题切换）
│   ├── hooks/
│   │   ├── useTimer.ts         # 番茄钟计时逻辑
│   │   ├── useTodos.ts         # 待办 CRUD 逻辑
│   │   └── useNotification.ts  # 浏览器通知
│   ├── stores/
│   │   ├── timerStore.ts       # 番茄钟状态 (Zustand)
│   │   └── todoStore.ts        # 待办状态 (Zustand)
│   ├── utils/
│   │   ├── storage.ts          # localStorage 读写工具
│   │   ├── time.ts             # 时间格式化工具
│   │   └── sound.ts            # 提示音播放 (Web Audio API)
│   ├── types/
│   │   └── index.ts            # 全局类型定义
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css               # Tailwind v4 + CSS 变量双主题
├── .npmrc                      # npm 镜像配置
├── .oxlintrc.json
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── .gitignore
```

---

## 3. 数据模型设计

### 3.1 核心类型定义

```ts
// types/index.ts

/** 番茄记录 */
interface PomodoroRecord {
  id: string;
  todoId: string | null;    // 关联的待办ID（null=通用番茄）
  startTime: number;        // 开始时间戳
  endTime: number;          // 结束时间戳
  duration: number;         // 设定时长（分钟）
  completed: boolean;       // true=自然完成, false=被放弃
}

/** 待办事项 */
interface Todo {
  id: string;               // nanoid 生成
  title: string;
  completed: boolean;
  pomodoroCount: number;    // 已投入番茄数
  createdAt: number;        // 创建时间戳
  completedAt: number | null;
  order: number;            // 排序序号
  dateKey: string;          // 所属日期 "2026-06-26"
}

/** 应用设置 */
interface AppSettings {
  focusDuration: number;    // 专注时长（分钟）, 默认 25
  shortBreakDuration: number; // 短休息时长, 默认 5
  longBreakDuration: number;  // 长休息时长, 默认 15 `[P1]`
  longBreakInterval: number;  // 几轮后长休息, 默认 4 `[P1]`
  soundEnabled: boolean;      // 提示音开关
  theme: 'light' | 'dark';    // 主题
}

/** localStorage 顶层结构 */
interface AppData {
  version: number;            // 数据版本号 (初始 1)
  todos: Todo[];
  records: PomodoroRecord[];
  settings: AppSettings;
  streak: number;             // 连续打卡天数 `[P1]`
  lastActiveDate: string | null; // 最后活跃日期
}
```

### 3.2 存储估算

| 项目 | 单条大小 | 日增 | 年增 |
|------|---------|------|------|
| Todo | ~200 B | 10 条 → 2 KB | ~700 KB |
| PomodoroRecord | ~100 B | 8 条 → 0.8 KB | ~300 KB |
| **总计** | | **~3 KB/天** | **~1 MB/年** |

结论：localStorage 完全够用（5MB 上限），考虑到学生数据量远小于商业用户，至少可用 3-5 年。`[P1]` 可引入 IndexedDB 做未来保险。

---

## 4. 关键逻辑设计

### 4.1 计时器核心 (useTimer)

```
难点：浏览器后台标签页的 setTimeout 会被节流到 1 分钟
方案：使用 "剩余时间 = 目标结束时间戳 - Date.now()" 的方式，
      而非每秒递减计数器。这样即使标签页休眠，恢复后时间依然准确。
```

实现思路：
```ts
// 记录"应该结束的时间戳"，而非"已过了多少秒"
const endTimestamp = useRef(Date.now() + durationMinutes * 60 * 1000)

// 每秒刷新显示，但计算基于时间戳差值
useEffect(() => {
  const interval = setInterval(() => {
    const remaining = Math.max(0, endTimestamp.current - Date.now())
    setDisplay(formatTime(remaining))
    if (remaining <= 0) onFinish()
  }, 200) // 200ms 刷新保证视觉流畅
  return () => clearInterval(interval)
}, [])
```

### 4.2 通知触发

```ts
// 需要先请求权限
async function notify(title: string, body: string) {
  if (!("Notification" in window)) return
  if (Notification.permission === "granted") {
    new Notification(title, { body, icon: "/icons/icon-192.png" })
  } else if (Notification.permission !== "denied") {
    const perm = await Notification.requestPermission()
    if (perm === "granted") new Notification(title, { body })
  }
}
```

### 4.3 连续打卡计算 `[P0.5]`

```ts
// timerStore.finish() 中自动计算
const today = new Date().toISOString().slice(0, 10)
if (data.lastActiveDate === today) {
  // 今天已活跃，不变
} else if (data.lastActiveDate === getYesterday(data.lastActiveDate)) {
  data.streak += 1  // 连续打卡 +1
} else {
  data.streak = 1   // 中断，重置
}
data.lastActiveDate = today
```

### 4.4 数据持久化

```ts
// utils/storage.ts
const STORAGE_KEY = 'pomodoro_app_data'

function load(): AppData {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return getDefaultData()
  try {
    const data = JSON.parse(raw) as AppData
    // 数据版本迁移逻辑
    return migrate(data)
  } catch {
    return getDefaultData()
  }
}

function save(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}
```

---

## 5. PWA 方案 `[P1]`

### vite-plugin-pwa 配置要点

- **缓存策略**：Network First（优先网络，失败时用缓存）
- **离线页面**：自定义 offline.html
- **图标**：192px 和 512px，带 maskable 属性
- **安装提示**：监听 `beforeinstallprompt` 事件，在合适时机弹出自定义安装按钮

### MVP 阶段暂不做 PWA

MVP 先保证 Web 体验完整。PWA 安装能力放到 P1，因为：
1. MVP 目标是最小可用，不做多余功能
2. 浏览器标签页使用也是常见场景
3. PWA 需要额外的 service worker 调试成本

---

## 6. 部署方案

### MVP 阶段：GitHub Pages

> 免费、国内可直接访问、通过 `gh-pages` 一键部署。

```bash
npm install -D gh-pages
# package.json 加 "deploy": "vite build && gh-pages -d dist"
npm run deploy
```

- 自定义域名：CNAME 记录指向 `<user>.github.io`
- HTTPS 自动生效

### P1 阶段：阿里云 OSS 静态网站托管

> 国内 CDN 加速、免备案域名（OSS 自带测试域名）、与 npm 镜像/友盟+ 同一阿里云生态。

**迁移步骤：**
1. 阿里云控制台创建 OSS Bucket，开启**静态网站托管**
2. 构建产物 `dist/` 上传至 Bucket
3. 绑定自定义域名 + CDN 加速（可选，OSS 自带 CDN）
4. 接入**友盟+** Web 统计（阿里系，免费）

**费用参考（学生/低流量场景）：**
- OSS 存储：~0.12 元/GB/月，5 GB ≈ 0.6 元
- CDN 流量：~0.24 元/GB，月 10 GB ≈ 2.4 元
- 友盟+：免费
- **预估月费 < 5 元**

> ⚠️ 不推荐 Vercel / Netlify / 腾讯云 作为本项目部署——与选定阿里云生态不一致。

---

## 7. 开发里程碑

| 阶段 | 内容 | 状态 |
|------|------|------|
| **M0 项目初始化** | Vite + React + Tailwind + oxlint 搭建 | ✅ 已完成 |
| **M1 番茄钟** | 计时器 UI + 逻辑 + 通知 + 暂停/放弃 + 长休息 | ✅ 已完成 |
| **M2 待办清单** | CRUD + 完成勾选 + 关联番茄钟 + 撤销删除 | ✅ 已完成 |
| **M3 统计 + 整合** | 统计栏 + localStorage + 响应式 + 打卡天数 | ✅ 已完成 |
| **M4 打磨发布** | 深色主题 + 图标 + 动画 + GitHub Pages | ✅ 已完成 |
| **MVP 合计** | | **已验收通过** |
| **P1 迭代** | 图表、成就、PWA、自动切换、白噪声、模式切换 UI | 待开始 |
| **修复项** | BUG-001 ✅ · BUG-002 待修复 | — |

---

> 📅 版本：v1.0 · 2026-06-26 · P1 阶段修订
