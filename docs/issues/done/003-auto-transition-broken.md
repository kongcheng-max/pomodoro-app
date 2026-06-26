---
id: BUG-003
severity: critical
status: verified
reported_by: 产品部 · 手动验收再次确认 · 上次"修复"无效
reported_date: 2026-06-26
module: 番茄钟
---

# 自动切换不生效：effect cleanup 杀死 transition timeout

## 复现步骤

1. 开始一个专注番茄（25 分钟）
2. 等待计时归零（或调短时长加速测试）
3. 观察是否自动切换到休息模式

## 预期行为

计时结束 → 1.5 秒后自动切换到短休息 / 长休息，进入下一轮。

## 实际行为

计时结束后显示"完成"，停留在 finished 状态，不会自动切换到下一轮。

## 根因分析（第二次验收更正）

`useTimer.ts` 第 79-95 行的执行顺序：

```
tick() 内部：
1. clearTimer()                         ← 停止 interval
2. store.finish()                       ← status 'running' → 'finished'
3. setTimeout(autoTransition, 1500)     ← 排程 1.5 秒后自动切换

React 检测到 store.status 变了，重新执行 effect：
4. 先执行 cleanup（上一轮 RUNNING 分支的清理函数）:
   → clearTransition()                  ← 把步骤 3 的 timeout 杀掉了！
5. 再执行新的 FINISHED 分支:
   → 第 51 行注释"不清除"              ← 已于事无补
```

**上次"修复"为什么无效**：开发者在 finished 分支（第 51 行）加注释不调 `clearTransition()`，但这只影响新 effect body。问题在于 cleanup 发生在**新 body 之前**——它是上一轮 running effect 的残留，无条件执行 `clearTransition()`，并不知道接下来会切到 finished。

**关键代码**：`src/hooks/useTimer.ts:79-95`

## 建议修复

真正有效的修复：cleanup 中不允许杀死 transitionRef：

```ts
// useTimer.ts useEffect cleanup
return () => {
  clearTimer()
  // 移除 clearTransition() — 不在 cleanup 中清除
  // transitionRef 只在 idle 分支（第 39 行）和 running 入口（第 58 行）显式清除
}
```

或条件判断：
```ts
return () => {
  clearTimer()
  if (!transitionRef.current) clearTransition()  // 仅当没有待执行的 transition 时清除
}
```

## 环境信息

- 浏览器：不限
- 操作系统：不限
