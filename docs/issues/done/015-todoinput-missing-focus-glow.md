---
id: BUG-015
severity: major
status: resolved
reported_by: 产品部
reported_date: 2026-06-26
module: 待办
---

# 待办输入框缺失对焦番茄红光环

## 复现步骤

1. 点击待办输入框
2. 观察样式变化

## 预期行为（ui-design-spec §6.5）

输入框对焦时：
- 凹陷阴影弱化（浅凹）
- 外围出现 `0 0 0 2px rgba(242,87,87,0.15)` 番茄红光环
- 背景提亮至 `#FFFFFF`

## 实际行为

`TodoInput.tsx:23-25`：`focus-within` 或 `focus` 状态无任何样式变化。凹陷阴影保持不变，无光环，无背景变化。

## 建议修复

给容器 div 添加 `focus-within` 样式，切换 `boxShadow` 和 `background`。

## 环境信息

- 浏览器：不限
