---
id: BUG-007
severity: major
status: verified
reported_by: 产品部 · 手动验收
reported_date: 2026-06-26
module: 布局
---

# 底部导航栏遮挡白噪音面板

## 复现步骤

1. 打开应用，滚动至番茄钟区域
2. 点击音量图标，展开白噪音面板
3. 观察面板底部

## 预期行为

白噪音面板完整可见，不被任何元素遮挡。

## 实际行为

底部导航栏覆盖在白噪音面板上方，遮挡面板底部内容（音量滑块区域），用户无法操作被遮挡的滑块。

## 根因分析

`BottomNav.tsx:12`：`z-50 sticky bottom-0`
`WhiteNoiseControl.tsx:91`：`absolute ... z-20`

与 BUG-006 同根因。底部导航 z-50，面板 z-20。

## 建议修复

白噪音面板 z-index 提升至 `z-[60]`，与 BUG-006 同步修复。

## 环境信息

- 浏览器：不限
- 屏幕尺寸：移动端
