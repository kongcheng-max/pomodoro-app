---
id: BUG-011
severity: major
status: verified
reported_by: 产品部 · 手动验收再次确认 · 按钮不可见
reported_date: 2026-06-26
module: PWA
---

# 缺少 PWA 安装提示 UI

## 复现步骤

1. 用 Chrome/Edge 打开应用
2. 寻找安装入口

## 预期行为

用户在页面上看到安装提示按钮（如"添加到主屏幕"），点击后触发 PWA 安装流程。或至少应该能在三点菜单 / 地址栏看到安装图标。

## 实际行为

代码修复已存在（`usePwaInstall.ts` + `Header.tsx:69` 安装按钮），但按钮通过 `{installable && ...}` 条件渲染。`installable` 依赖 `beforeinstallprompt` 事件，该事件仅在浏览器判定 PWA 可安装时触发（需 HTTPS/localhost + 有效 service worker + 足够用户参与度）。

用户运行环境可能不满足触发条件，导致按钮永远不可见。

## 建议修复

按钮不应完全依赖 `beforeinstallprompt`。改为始终显示，点击后：

- 如果 `deferredPrompt` 存在 → 调用 `prompt()` 触发系统安装流程
- 如果不存在 → 弹出引导说明（"请在浏览器菜单中选择'添加到主屏幕'"）

## 环境信息

- 浏览器：Chrome / Edge（支持 PWA）
