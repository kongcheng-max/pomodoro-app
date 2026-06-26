---
id: BUG-016
severity: minor
status: resolved
reported_by: 产品部
reported_date: 2026-06-26
module: 待办
---

# 待办条目 hover / 选中态不符合新拟态规范

## 问题 1：Hover 用了背景色而非阴影

`TodoItem.tsx:56-58`：hover 时使用 `hover:bg-[var(--color-hover)]`（背景色变化），而规范要求使用 `hover:boxShadow: var(--shadow-subtle)`（微弱凸起阴影）。

## 问题 2：选中态缺少左边框番茄红微光

`TodoItem.tsx:50`：选中态有 `bg-[#FDE8E8]` + `shadow-subtle`，但规范要求额外有左边框 `#F25757/20` 的微光指示。

## 建议修复

1. hover：改为 `hover:shadow-[var(--shadow-subtle)]` + `bg-[#F5F7FB]`
2. 选中：添加 `border-l-[3px] border-l-tomato/20` 或 `boxShadow` 左边红色投影

## 环境信息

- 浏览器：不限
