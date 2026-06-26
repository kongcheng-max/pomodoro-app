---
id: BUG-009
severity: major
status: verified
reported_by: 产品部 · 手动验收
reported_date: 2026-06-26
module: 番茄钟
---

# 自定义时长下限应为 1 分钟

## 复现步骤

1. 打开设置弹窗
2. 在自定义输入框输入 `1`
3. 按 Enter

## 预期行为

可以设置 1 分钟作为有效时长。

## 实际行为

`TimerSettings.tsx:32` `val >= 5` 校验拒绝任何小于 5 的值。输入 1 后按 Enter 无响应，仅红框抖动提示无效，用户无法设置 1-4 分钟的短时长用于测试或快速专注。

## 规格变更

`feature-spec.md` §1.2：专注时长可自定义范围从 `5 ~ 120` 改为 **`1 ~ 120` 分钟**。

## 建议修复

- `TimerSettings.tsx`: `min={1}`, `val >= 1`
- `TimerSettings.tsx:98`: placeholder `"1~120 分钟"`
- `utils/storage.ts`: 默认值不变（25 / 5 / 15）
- `feature-spec.md`: §1.2 更新

## 环境信息

- 浏览器：不限
