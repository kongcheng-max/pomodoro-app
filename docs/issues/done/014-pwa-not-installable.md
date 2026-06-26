---
id: BUG-014
severity: major
status: verified
reported_by: 产品部 · 手动验收 · 部署到 HTTPS 后正常
reported_date: 2026-06-26
module: PWA
---

# PWA 不可安装：beforeinstallprompt 不触发

## 复现步骤

1. `npm run build && npm run preview`
2. 用 Chrome **无痕窗口**打开 `http://localhost:4173`
3. 在页面上操作（添加任务、计时等，增加交互）
4. 点击 Header 红色"安装"按钮
5. 观察浏览器三点菜单 → 没有"安装极简番茄…"选项

## 预期行为

`beforeinstallprompt` 触发 → 安装按钮调用 `prompt()` → 弹出系统安装对话框。

## 实际行为

- `beforeinstallprompt` 从未触发（无痕窗口也确认）
- 安装按钮无法走 `deferredPrompt.prompt()` 路径，只能降级到引导文字
- 浏览器菜单中没有安装选项

## 已确认正确

| 检查项 | 状态 |
|--------|:---:|
| `manifest.webmanifest` 字段完整（name/short_name/icons/display） | ✅ |
| `sw.js` precache + navigation fallback | ✅ |
| 图标 pwa-192x192.png / pwa-512x512.png | ✅ |
| `<link rel="manifest">` 在 HTML head 中 | ✅ |
| `registerSW.js` 正确注册 | ✅ |
| 非浏览器记忆问题（无痕窗口也无效） | ✅ |

## 建议排查（需研发操作）

1. **F12 → Application → Manifest**：检查是否有红色报错（最常见原因）
2. **F12 → Application → Service Workers**：确认 SW 状态为"activated and is running"
3. **F12 → Console**：是否有 `sw.js` 注册失败的错误
4. **Chrome Lighthouse** → PWA 审计：逐项检查哪些条件未满足
5. **尝试部署到 HTTPS**：localhost 的 `beforeinstallprompt` 触发有已知不稳定问题，部署到 GitHub Pages（真实 HTTPS）后通常自动正常

## 环境信息

- 浏览器：Chrome/Edge（无痕窗口已验证）
- 运行方式：`npm run preview`（localhost:4173）
