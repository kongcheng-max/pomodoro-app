---
id: BUG-010
severity: cosmetic
status: verified
reported_by: 产品部 · 手动验收
reported_date: 2026-06-26
module: 统计
---

# 柱状图 x 轴"昨天"应改为周 X

## 复现步骤

1. 打开统计页面
2. 查看 7 日柱状图 x 轴标签

## 预期行为

x 轴标签全部统一为"今天"或"周X"格式，不出现"昨天"。

## 实际行为

`stats.ts:35`：`if (index === 1) return '昨天'`

柱状图倒数第二个标签显示"昨天"而非"周X"，与其他标签格式不一致。

## 建议修复

移除"昨天"特殊处理，统一用 `getDayLabel` 返回周几：

```ts
// stats.ts
function getDayLabel(dateStr: string, index: number): string {
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const d = new Date(dateStr)
  if (index === 0) return '今天'
  return days[d.getDay()] // 移除 index === 1 → '昨天' 的特判
}
```

## 环境信息

- 浏览器：不限
