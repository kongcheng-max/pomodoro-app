# UI 设计规格说明

> 版本：v2.0 · 2026-06-26
> 设计系统：轻新拟态（Neumorphism）
> 底色：浅冷白 #F0F4F9 · 主色：通透番茄红 #F25757

---

## 1. 设计理念

**轻新拟态（Soft Neumorphism）**— 柔和凹凸质感，活泼但不杂乱，区别于市面上普通扁平番茄钟。

| 原则 | 说明 |
|------|------|
| **软雕塑感** | 通过凹凸阴影塑造层次，界面像可触摸的实体 |
| **轻量拟物** | 保留新拟态的光影语言，但不堆砌纹理——干净、透气 |
| **色彩克制** | 大面浅冷白底 + 单点番茄红，视觉无负担 |
| **活泼有节** | 圆角、阴影带来亲切感，动效克制不过度 |

---

## 2. 色彩系统

### 2.1 核心色板

```
底色（Background）
─ bg:            #F0F4F9   浅冷白 · 全局底色

主色（Primary）
─ tomato:        #F25757   通透番茄红 · 按钮 / 高亮 / 进度环
─ tomato-light:  #FDE8E8   浅番茄 · 选中背景
─ tomato-dark:   #D94444   深番茄 · hover / active

中性色
─ text:          #2C3E50   正文（深蓝灰，不纯黑）
─ text-secondary:#7F8C8D   辅助文字
─ text-muted:    #BDC3C7   极弱文字 / placeholder
─ white:         #FFFFFF   卡片 / 按钮凸起面

阴影色
─ shadow-dark:   #D6DBE3   暗部阴影（底色加深）
─ shadow-light:  #FFFFFF   亮部高光

暗色模式
─ dark-bg:       #1E2A38   深蓝灰底
─ dark-card:     #243447   卡片
─ dark-shadow-d: #16212E   暗部（比底更深）
─ dark-shadow-l: #2C4053   亮部（比底更亮）
```

### 2.2 语义色

```
─ green:         #27AE60   完成 / 休息模式
─ amber:         #F39C12   暂停 / 连续打卡
─ blue:          #5DADE2   统计卡片辅助
─ purple:        #A569BD   完成率
```

### 2.3 使用规范

- 正文用 `#2C3E50`（深蓝灰），永远不用纯黑 `#000`
- 辅助信息用 `#7F8C8D`
- 操作按钮统一 `bg-tomato text-white`
- 破坏性操作（放弃）用灰色纯色填充，不用红色
- 完成态用绿色，暂停态用琥珀色

---

## 3. 新拟态阴影系统

### 3.1 核心公式

新拟态的精髓在于 **一组外凸阴影 + 一组内凹阴影**，模拟光源从左上方照射。

**底色 #F0F4F9 下的阴影基准值：**

```
凸起（Raised）— 元素浮出背景
  外阴影：8px 8px 16px #D6DBE3, -8px -8px 16px #FFFFFF

凹陷（Recessed）— 元素陷入背景
  内阴影：inset 6px 6px 12px #D6DBE3, inset -6px -6px 12px #FFFFFF

深凹陷（Deep Recessed）— 强烈的内凹感（轨道/沟槽）
  内阴影：inset 8px 8px 16px #C8CDD5, inset -4px -4px 8px #FFFFFF

微凸起（Subtle Raised）— 扁平元素的选中态
  外阴影：4px 4px 8px #D6DBE3, -2px -2px 4px #FFFFFF

按压态（Pressed）— 元素被按下去
  外阴影 + 内阴影叠加，scale 微缩
  2px 2px 4px #D6DBE3, -1px -1px 2px #FFFFFF,
  inset 2px 2px 4px rgba(214,219,227,0.5)
```

### 3.2 阴影 Token（Tailwind 集成）

```css
:root {
  --shadow-raised:    8px 8px 16px #D6DBE3, -8px -8px 16px #FFFFFF;
  --shadow-recessed:  inset 6px 6px 12px #D6DBE3, inset -6px -6px 12px #FFFFFF;
  --shadow-deep:      inset 8px 8px 16px #C8CDD5, inset -4px -4px 8px #FFFFFF;
  --shadow-subtle:    4px 4px 8px #D6DBE3, -2px -2px 4px #FFFFFF;
  --shadow-pressed:   2px 2px 4px #D6DBE3, -1px -1px 2px #FFFFFF,
                      inset 2px 2px 4px rgba(214,219,227,0.5);
}
```

### 3.3 暗色模式阴影

```css
.dark {
  --shadow-raised:    8px 8px 16px #16212E, -8px -8px 16px #2C4053;
  --shadow-recessed:  inset 6px 6px 12px #16212E, inset -6px -6px 12px #2C4053;
  --shadow-deep:      inset 8px 8px 16px #111A24, inset -4px -4px 8px #2C4053;
  --shadow-subtle:    4px 4px 8px #16212E, -2px -2px 4px #2C4053;
  --shadow-pressed:   2px 2px 4px #16212E, -1px -1px 2px #2C4053,
                      inset 2px 2px 4px rgba(22,33,46,0.5);
}
```

---

## 4. 圆角系统

新拟态需要**更大的圆角半径**来让阴影过渡更自然。

| Token | 值 | 用途 |
|-------|-----|------|
| `rounded-3xl` | 24px | 计时卡片（主视觉焦点） |
| `rounded-2xl` | 16px | 弹窗面板、统计卡片、成就卡片 |
| `rounded-xl` | 12px | 任务条目、按钮组容器、预设按钮 |
| `rounded-full` | 9999px | 胶囊按钮、模式标签 pill、进度环轨道 |

---

## 5. 排版

与 v1.0 保持一致：系统字体、不引入 Web Font，响应式字号 scale 不变。

---

## 6. 组件规格

### 6.1 番茄钟主卡片 ⭐

> **整个计时模块是一张从背景中凸起的卡片。**

```
┌──────────────────────────────────────┐
│           ╭──────────────────╮       │
│           │  bg: #F0F4F9     │       │
│           │  rounded-3xl     │       │
│           │  shadow-raised   │       │
│           │                  │       │
│           │   [ 专注 25min ]  │       │  ← 模式标签（见 §6.2）
│           │                  │       │
│           │    ┌─────────┐   │       │
│           │    │ 凹陷轨道  │   │       │  ← 圆环进度（见 §6.3）
│           │    │ 25:00    │   │       │
│           │    └─────────┘   │       │
│           │                  │       │
│           │  已选择：复习高数  │       │
│           │                  │       │
│           │  [ ▶ 开始 ]      │       │  ← 按钮（见 §6.4）│
│           │                  │       │
│           │  ⚙ 25分钟  🔊   │       │
│           │                  │       │
│           ╰──────────────────╯       │
└──────────────────────────────────────┘
      ↑ 卡片凸起（shadow-raised）
```

**CSS：**
```css
.timer-card {
  background: #F0F4F9;
  border-radius: 24px;
  box-shadow: var(--shadow-raised);
  padding: 32px;
}
```

**要点：**
- 卡片色必须与全局底色完全相同（`#F0F4F9`），仅靠阴影区分
- 不做 border——新拟态靠阴影定义边界
- 卡片内部元素（环形轨道、输入框）用 `shadow-recessed` 做凹陷

### 6.2 模式切换标签

> **扁平胶囊，选中项凸起。**

```
┌────────────────────────────────────────┐
│  ┌──────────┐  ┌────────┐  ┌────────┐ │
│  │ 专注 25min│  │短休息5min│  │长休息15min│ │
│  │  ↑ 凸起   │  │  扁平   │  │  扁平   │ │
│  └──────────┘  └────────┘  └────────┘ │
│  shadow-subtle  shadow: none           │
└────────────────────────────────────────┘
```

**规则：**

| 状态 | 阴影 | 效果 |
|------|------|------|
| 未选中 | `none` | 扁平，与背景同色，无边界 |
| 选中 | `var(--shadow-subtle)` | 凸起，bg=#FFFFFF |
| hover | `var(--shadow-subtle)`（弱化版）| 微凸提示 |
| disabled（计时中）| `none` + `opacity-50` | 扁平灰色，不可点 |

**CSS：**
```css
.mode-tab {
  background: transparent;
  border-radius: 9999px;
  padding: 6px 12px;
  transition: box-shadow 0.3s, background 0.3s;
}
.mode-tab[data-active="true"] {
  background: #FFFFFF;
  box-shadow: var(--shadow-subtle);
}
```

### 6.3 环形进度条

> **整个圆环是一个凹陷轨道，进度填充在轨道内前进。**

```
       ╭─────────────────╮
       │  凹陷环形轨道     │  ← 外圈：shadow-deep inset
       │  ╭───────────╮   │
       │  │  25:00     │   │  ← 中心数字
       │  ╰───────────╯   │
       │  进度弧线填充      │  ← #F25757，沿轨道内侧
       ╰─────────────────╯
```

**双层 SVG 结构：**

| 层 | 元素 | 颜色/阴影 |
|----|------|----------|
| 轨道（背景环） | `<circle>` | `fill: none; stroke: #E8ECF1`（比底色略深的灰）|
| 轨道凹陷感 | 同一 circle 加 `filter: drop-shadow` 或外层伪元素 | `shadow-recessed` 内阴影 |
| 进度弧 | `<circle>` with `stroke-dasharray` | `stroke: #F25757`，cap: round |
| 中心数字 | `<text>` 或绝对定位 div | `font-mono`, `#2C3E50` |

**轨道 CSS：**
```css
.ring-track {
  fill: none;
  stroke: #E8ECF1;
  stroke-width: 8;
}
.ring-progress {
  fill: none;
  stroke: #F25757;
  stroke-width: 8;
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: center;
  transition: stroke-dashoffset 0.3s ease;
}
```

**凹陷实现方案**：在 SVG 外层 div 上用 `box-shadow: var(--shadow-deep)` + `border-radius: 50%`，SVG 绝对定位在其中，让整个环形区域呈现嵌入感。

### 6.4 按钮系统

#### 主按钮（开始/继续）— 纯色填充 + 微凸

```css
.btn-primary {
  background: #F25757;
  color: #FFFFFF;
  border-radius: 9999px;
  padding: 12px 28px;
  box-shadow: 4px 4px 8px rgba(242,87,87,0.3), -2px -2px 4px rgba(255,255,255,0.5);
  /* 番茄红色投影 + 顶部微光 */
}
.btn-primary:hover {
  background: #D94444;
}
.btn-primary:active {
  transform: scale(0.96);
  box-shadow: inset 2px 2px 4px rgba(0,0,0,0.15);  /* 按压凹陷 */
}
```

#### 暂停按钮 — 琥珀色凹陷质感

```css
.btn-pause {
  background: #F0F4F9;          /* 与底色相同 */
  color: #F39C12;
  border-radius: 9999px;
  padding: 12px 24px;
  box-shadow: var(--shadow-recessed);  /* ← 内凹 */
}
.btn-pause:hover {
  box-shadow: var(--shadow-pressed);
}
.btn-pause:active {
  transform: scale(0.96);
  box-shadow: var(--shadow-deep);
}
```

#### 放弃按钮 — 纯色填充（无浮雕）

```css
.btn-giveup {
  background: #BDC3C7;          /* 灰色填充 */
  color: #FFFFFF;
  border-radius: 9999px;
  padding: 12px 24px;
  /* 无阴影 — 纯色填充，与浮雕按钮区分 */
}
.btn-giveup:hover {
  background: #95A5A6;
}
```

#### 完成/再来一轮按钮 — 绿色纯色填充

```css
.btn-finished {
  background: #27AE60;
  color: #FFFFFF;
  border-radius: 9999px;
  padding: 12px 28px;
  box-shadow: 4px 4px 8px rgba(39,174,96,0.3), -2px -2px 4px rgba(255,255,255,0.5);
}
```

### 6.5 待办输入框

> **凹陷设计，输入时产生轻微色彩反馈。**

```
┌─────────────────────────────────────────┐
│  添加今天的任务…                    [➕]  │
│  ↑ 凹陷内凹背景                         │
│  ↑ 输入时：凹陷变浅 + 边框 tomato 微光   │
└─────────────────────────────────────────┘
```

```css
.todo-input {
  background: #F0F4F9;
  border-radius: 12px;
  box-shadow: var(--shadow-recessed);     /* 凹陷 */
  border: none;
  padding: 10px 16px;
  transition: box-shadow 0.3s, background 0.3s;
}
.todo-input:focus-within {
  box-shadow: inset 4px 4px 8px #D6DBE3, inset -2px -2px 4px #FFFFFF,  /* 弱化凹陷 */
              0 0 0 2px rgba(242,87,87,0.15);                          /* tomato 光环 */
  background: #FFFFFF;  /* 微提亮 */
}
```

添加按钮 `➕` 用 `bg-tomato text-white rounded-full`，凸起阴影。

### 6.6 待办条目

```
未选中 ─ 扁平，与背景同色
┌──────────────────────────────────────────┐
│  ○ 复习高数第三章         🍅 3   ▶   🗑   │
└──────────────────────────────────────────┘

选中 ─ 微凸起
┌──────────────────────────────────────────┐
│  ● 复习高数第三章         🍅 3   ▶   🗑   │
│  ↑ shadow-subtle + tomato 左边框微光      │
└──────────────────────────────────────────┘

完成 ─ 凹陷
┌──────────────────────────────────────────┐
│  ✓ 做完英语真题                           │
│  ↑ shadow-recessed + opacity-60           │
└──────────────────────────────────────────┘
```

**规则：**

| 状态 | 阴影 | 背景 |
|------|------|------|
| 默认 | `none` | `transparent` |
| hover | `var(--shadow-subtle)`（微弱）| `#F5F7FB` |
| 选中 | `var(--shadow-subtle)` | `#FDE8E8`，左边框 `#F25757/20` |
| 完成 | `var(--shadow-recessed)` | `#F0F4F9`，`opacity-60` |

### 6.7 设置 & 白噪音弹窗

```
┌──────────────┐
│  专注时长   ✕ │  ← 凸起卡片
│              │     shadow-raised
│  [15][25][30]│     bg: #FFFFFF（凸起面用白）
│  [45][60][90]│
│              │
│  [1~120分钟] │  ← 凹陷输入
│  [   确定   ]│  ← 填充按钮
└──────────────┘
```

弹窗卡片：`bg-white`, `rounded-2xl`, `shadow-raised`（比普通卡片更强，因浮在卡片之上）。

### 6.8 统计卡片

```
┌──────┐ ┌──────┐
│ 8    │ │2h 5m │  ← 凸起卡片阴影
│今日🍅│ │今日专注│
└──────┘ └──────┘
```

每张统计卡片：`bg-white`, `rounded-2xl`, `shadow-raised`。

### 6.9 成就徽章卡片

```
已解锁 ─ 凸起
┌──────────┐
│    🌱     │  shadow-raised + tier 背景色
│  初次专注  │
│    🥉     │
└──────────┘

未解锁 ─ 扁平灰色
┌──────────┐
│    🌳     │  shadow: none
│  专注达人  │  bg: #F0F4F9
│  100个🍅  │  grayscale + opacity-50
└──────────┘
```

### 6.10 顶部导航栏

```css
.header {
  background: rgba(240,244,249,0.85);  /* 半透明底色 */
  backdrop-filter: blur(12px);
  box-shadow: var(--shadow-subtle);    /* 微凸与内容区分 */
}
```

安装按钮：`bg-tomato text-white rounded-full` + 番茄红投影。

### 6.11 底部导航栏

与 Header 一致：半透明毛玻璃 + `shadow-subtle`。

选中标签 `text-tomato`，无背景变化——靠颜色区分。

---

## 7. 暗色模式适配

新拟态在暗色模式下需要**反向阴影逻辑**：

- 凸起元素比背景**亮**（光源感从上方偏右）
- 凹陷元素比背景**暗**

暗色模式底色 `#1E2A38`，阴影基准：

```
凸起：8px 8px 16px #16212E, -8px -8px 16px #2C4053
凹陷：inset 6px 6px 12px #16212E, inset -6px -6px 12px #2C4053
```

其余颜色对应调整为暗色色板（见 §2.1）。

---

## 8. 动效

| 动效 | 触发条件 | 实现 | 时长 |
|------|---------|------|------|
| 按钮按压 | 点击任意按钮 | `scale(0.96)` + 阴影切换为 pressed | 0.1s |
| 进度环推进 | 倒计时变化 | `stroke-dashoffset` transition | 300ms |
| 条目悬浮显现 | hover 任务条目 | 按钮 `opacity: 0→1` | 200ms |
| 输入框对焦 | 点击输入框 | `box-shadow` 切换 + bg 微亮 | 300ms |
| 错误抖动 | 非法输入 | `shake` keyframe | 300ms |
| Toast 滑入 | 删除任务 | `slide-up` | 300ms |
| 弹窗出现 | 打开设置/白噪音 | `opacity 0→1` + `translateY(-4px)→0` | 200ms |

**规则**：所有阴影变化加 `transition: box-shadow 0.3s`，圆角按钮加 `transition: all 0.3s`。

---

## 9. 布局

桌面端双列（左番茄钟卡片 + 右待办面板），移动端单列。底部导航固定在移动端可见。

整体页面背景：`#F0F4F9`，无纹理无渐变，纯色底让新拟态阴影最突出。

---

## 10. 实现指引

### 10.1 CSS 变量集中定义

将 §3.2 的阴影 Token 和 §2.1 的色板写入 `index.css` 的 `:root` 和 `.dark`，供全项目 Tailwind arbitrary values 调用。

### 10.2 修改清单（按优先级）

| 优先级 | 组件 | 改动内容 |
|--------|------|---------|
| P0 | `index.css` | 新色板 + 新阴影 Token + 深色模式 |
| P0 | `TimerDisplay.tsx` | 凸起卡片包裹 + 凹陷轨道 SVG |
| P0 | `TimerControls.tsx` | 按钮改为新拟态三态 |
| P1 | `TimerModeTabs.tsx` | 胶囊选中凸起 |
| P1 | `TodoInput.tsx` | 凹陷输入框 + 对焦光环 |
| P1 | `TodoItem.tsx` | 三态阴影（默认/选中/完成） |
| P2 | `Stats/index.tsx` | 卡片 shadow-raised |
| P2 | `BadgeWall.tsx` / `Badge.tsx` | 已解锁凸起 / 未解锁扁平 |
| P2 | `Header.tsx` / `BottomNav.tsx` | 毛玻璃 + shadow-subtle |
| P2 | `TimerSettings.tsx` / `WhiteNoiseControl.tsx` | 弹窗凸起卡片 |

---

> 📅 版本：v2.0 · 2026-06-26
> 👤 产品部 · 新拟态设计系统 · 研发待评审
