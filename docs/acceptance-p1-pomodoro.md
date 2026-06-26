# P1 番茄钟增强验收报告

> 验收对象：P1 番茄钟增强（自动切换、模式切换 UI、白噪声）
> 验收依据：`docs/prd.md` P1 番茄钟增强清单
> 验收日期：2026-06-26

---

## 一、总体结论

**⚠️ 部分通过。** 三项子功能中两项通过、一项不通过（阻断性 Bug）。

| 子功能 | 产品验收 | 手动验收 | 最终 |
|--------|---------|---------|------|
| 模式切换 UI | ✅ 通过 | ✅ 通过 | ✅ |
| 白噪声背景音 | ✅ 通过 | ✅ 通过 | ✅ |
| 自动切换 | ❌ 不通过 | ❌ 确认 BUG-003 | ❌ |

---

## 二、逐项验收

### 2.1 模式切换 UI ✅

| 检查项 | 状态 | 证据 |
|--------|------|------|
| 新建 `TimerModeTabs.tsx` | ✅ | 三标签分段控件，专注/短休息/长休息 |
| 显示各模式对应分钟数 | ✅ | `getDuration()` 从 settings 读取 |
| 运行中锁定切换 | ✅ | `isLocked = status === 'running' \|\| 'paused'`，disabled+cursor-not-allowed |
| 活跃标签视觉区分 | ✅ | `bg-white shadow-sm text-tomato` |
| 切换后 duration 更新 | ✅ | `setMode()` 从 settings 取对应时长 |
| 集成到 PomodoroTimer | ✅ | `index.tsx:24` 渲染 |

**待改进**：TimerControls 按钮文案未跟随模式变化（见 BUG-005）。

### 2.2 白噪声 ✅

| 检查项 | 状态 | 证据 |
|--------|------|------|
| 新建 `whiteNoise.ts` | ✅ | Web Audio API，白/粉/棕噪声，精确定制 DSP |
| 新建 `WhiteNoiseControl.tsx` | ✅ | 播放/停止、类型切换、音量滑块 |
| 无外部依赖 | ✅ | 纯 Web Audio API，零 npm 包 |
| 设置持久化 | ✅ | `whiteNoiseEnabled/Type/Volume` 写入 settings |
| 自动播放策略处理 | ✅ | `AudioContext` 挂起恢复逻辑 |
| 集成到 PomodoroTimer | ✅ | `index.tsx:51` 与 TimerSettings 并列 |

### 2.3 自动切换 ❌

| 检查项 | 状态 |
|--------|------|
| `autoTransition()` store 方法 | ✅ 逻辑正确 |
| 专注→完成→休息切换 | ❌ 不执行 |
| 长休息 N 轮触发 | ❌ 不执行（因为切换本身不工作） |
| `sessionCount` 计数 | ✅ 数据模型就绪 |
| 过渡动画/缓冲 | ❌ 无缓冲期，直接跳到 running |

**阻断原因**：`useTimer.ts:79-95`
```
finish() → status='finished' → effect cleanup → clearTimeout(autoTransition)
```
`setTimeout` 排程的 `autoTransition` 被同一帧的 React cleanup 杀死。详见 **BUG-003**。

---

## 三、发现 Bug 汇总

| Bug | 严重程度 | 描述 |
|-----|---------|------|
| BUG-003 | **critical** | 自动切换不生效 — effect cleanup 杀死 transition timeout |
| BUG-004 | major | 休息模式计时结束错误创建 PomodoroRecord |
| BUG-005 | cosmetic | TimerControls 按钮始终显示"开始专注" |
| BUG-002 | minor | crypto.randomUUID() 未改为 nanoid（P1 前遗留） |

---

## 四、新增文件清单

| 文件 | 行数 | 质量评价 |
|------|------|---------|
| `components/PomodoroTimer/TimerModeTabs.tsx` | 55 | 简洁，状态管理正确 |
| `components/PomodoroTimer/WhiteNoiseControl.tsx` | 153 | 完整的 popover + slider + type selector |
| `utils/whiteNoise.ts` | ~171 | DSP 实现专业，三种噪声算法 |

---

> 📅 验收日期：2026-06-26 · 手动验收：2026-06-26
> 👤 产品部 · P1 番茄钟增强 · 自动切换打回，其余通过 ✅
