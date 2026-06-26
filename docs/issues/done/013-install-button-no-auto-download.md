---
id: BUG-013
severity: major
status: verified
reported_by: 产品部 · 手动验收 · 修复不完整
reported_date: 2026-06-26
module: PWA
---

# 点击安装按钮后不应显示引导，应直接触发下载

## 复现步骤

1. 打开应用，点击 Header 右侧红色"安装"按钮
2. 观察行为

## 预期行为

点击安装按钮 → 浏览器自动下载/安装 PWA 应用到桌面。

## 实际行为（第二次验收）

`usePwaInstall.ts` 移除了引导降级，`install()` 仅 `deferredPrompt` 存在时才能调用。`Header.tsx` 按钮仍然被 `{installable && ...}` 条件控制显示。

当 `beforeinstallprompt` 未触发时（开发环境或浏览器条件不满足）→ `installable` 为 false → **按钮不可见**。即使按钮可见，`install()` 也无法触发安装。

与上次 BUG-011 的现象相同：用户看不到安装按钮。

## 建议修复

按钮**始终可见**，不依赖 `{installable &&}`。点击后：

- `deferredPrompt` 存在 → 调用 `prompt()` 安装
- 不存在 → 通过其他方式触发安装（如动态创建 manifest 链接、引导用户一键操作等）

参考：`Header.tsx:69` 移除 `{installable &&}` 包裹

## 环境信息

- 浏览器：Chrome / Edge
