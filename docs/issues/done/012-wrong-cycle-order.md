---
id: BUG-012
severity: major
status: verified
reported_by: 产品部 · 手动验收
reported_date: 2026-06-26
module: 番茄钟
---

# 自动切换循环不符合预期（F-S-F-S-F-L）

## 复现步骤

1. 开始专注 → 等待自动切换 → 观察循环规律
2. 数一下几次短休息后出现长休息

## 预期行为

按照 **专注→短休息→专注→短休息→专注→长休息** 循环：
- 每 3 轮专注触发 1 次长休息
- 即 `longBreakInterval = 3`

## 实际行为

默认 `longBreakInterval = 4`（`utils/storage.ts:15`），实际循环为：
```
专注 → 短休息 → 专注 → 短休息 → 专注 → 短休息 → 专注 → 长休息
```
即 4 轮专注后才长休息，多了 1 轮短休息循环。

## 根因分析

| 位置 | 当前值 | 应为 |
|------|--------|------|
| `utils/storage.ts:15` | `longBreakInterval: 4` | `3` |
| `types/index.ts:31` 注释 | `默认 4` | `默认 3` |

另外 `longBreakInterval` 无 UI 暴露，用户无法自行修改。

## 建议修复

1. `storage.ts:15`：`longBreakInterval: 4` → `3`
2. `types/index.ts:31`：注释更新
3. （可选）TimerSettings 中增加长休息间隔设置

## 环境信息

- 浏览器：不限
