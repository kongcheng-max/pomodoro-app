---
id: BUG-001
severity: cosmetic
status: verified
reported_by: 产品部
reported_date: 2026-06-26
module: 番茄钟
---

# TimerSettings 弹窗标题写死"专注时长"

## 复现步骤

1. 打开番茄钟设置弹窗（点击齿轮图标）
2. 观察标题 → 显示"专注时长"
3. 切换到休息模式（短休息 / 长休息）
4. 再次打开设置弹窗
5. 观察标题 → 仍然显示"专注时长"

## 预期行为

标题应根据当前模式动态显示：
- 专注模式 → "专注时长"
- 短休息模式 → "短休息时长"
- 长休息模式 → "长休息时长"

## 实际行为

无论当前是哪种模式，弹窗标题始终显示"专注时长"。切换休息模式后打开设置，看到的是休息时长的数值，标题却仍然是"专注时长"，给用户造成困惑。

## 根因分析

`TimerSettings.tsx:52` 标题文字写死：

```tsx
<span className="text-sm font-medium text-gray-500">专注时长</span>
```

组件已从 store 读取 `duration`，但未读取 `mode` 字段。需要根据 `mode`（`'focus'` / `'shortBreak'` / `'longBreak'`）动态渲染对应文字。

## 环境信息

- 浏览器：不限
- 操作系统：不限
- 屏幕尺寸：不限
