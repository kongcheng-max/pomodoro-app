---
id: BUG-002
severity: minor
status: verified
reported_by: 产品部 · P1 验收仍未修复
reported_date: 2026-06-26
module: 其他
---

# ID 生成使用 crypto.randomUUID() 而非规格要求的 nanoid

## 复现步骤

1. 查看 `todoStore.ts:61`：`id: crypto.randomUUID()`
2. 查看 `timerStore.ts:74`：`id: crypto.randomUUID()`
3. 查看 `package.json`：`nanoid` 在 dependencies 中但从未 import

## 预期行为

按 `feature-spec.md` §2.1 和 `tech-overview.md` §3.1 要求，使用 `nanoid` 生成唯一 ID：

```ts
import { nanoid } from 'nanoid'
// ...
id: nanoid()
```

## 实际行为

使用了浏览器原生 `crypto.randomUUID()`，`nanoid` 包成为死依赖。

## 修复要点

- `src/stores/todoStore.ts` 第 61 行：`crypto.randomUUID()` → `nanoid()`
- `src/stores/timerStore.ts` 第 74 行：`crypto.randomUUID()` → `nanoid()`
- 两处均需添加 `import { nanoid } from 'nanoid'`

## 环境信息

- 浏览器：不限
- 操作系统：不限
