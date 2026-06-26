---
id: BUG-005
severity: cosmetic
status: verified
reported_by: 产品部 · 手动验收
reported_date: 2026-06-26
module: 番茄钟
---

# 开始按钮文案不跟随模式

## 复现步骤

1. 切换到短休息或长休息模式
2. 观察开始按钮文案

## 预期行为

按钮统一显示"开始"，简洁通用，不受模式影响。

## 实际行为

`TimerControls.tsx:29` 按钮文案写死"开始专注"，切到休息模式后仍显示此文案，与当前上下文不符。

## 建议修复

不区分模式，统一改为"开始"。

涉及位置：
- `TimerControls.tsx:29` → `开始`
- `TodoItem.tsx:132` `title` → `开始此任务`
- `index.tsx:42` → `选择任务开始，或直接开始通用番茄`
- `useTimer.ts:77` → `开始专注吧！`

## 环境信息

- 浏览器：不限
