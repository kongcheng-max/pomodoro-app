---
id: BUG-006
severity: major
status: verified
reported_by: 产品部 · 手动验收
reported_date: 2026-06-26
module: 布局
---

# 底部导航栏遮挡 TimerSettings 设置弹窗

## 复现步骤

1. 打开应用，滚动至番茄钟区域
2. 点击齿轮图标 ⚙️，展开设置弹窗
3. 观察弹窗底部

## 预期行为

设置弹窗完整可见，不被任何元素遮挡。

## 实际行为

底部导航栏覆盖在设置弹窗上方，遮挡弹窗底部内容（自定义时长输入框 + 确定按钮），用户无法操作被遮挡部分。

## 根因分析

`BottomNav.tsx:12`：`z-50 sticky bottom-0`
`TimerSettings.tsx:55`：`absolute ... z-20`

底部导航 z-index 为 50，弹窗 z-index 为 20。弹窗在导航下方渲染，被遮挡。

## 建议修复

两种方案：

**方案 A**：弹窗 z-index 提升至 `z-50` 以上（如 `z-[60]`），确保在导航上方。

**方案 B**：弹窗改用 `fixed` 定位 + 居中显示（Modal 模式），脱离文档流不受 sticky 影响。

推荐方案 A + 同时检查其他弹窗。

## 环境信息

- 浏览器：不限
- 屏幕尺寸：移动端（底部导航可见）
