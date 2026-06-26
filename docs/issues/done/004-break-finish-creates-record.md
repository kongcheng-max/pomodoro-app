---
id: BUG-004
severity: major
status: verified
reported_by: 产品部 · P1 验收仍未修复
reported_date: 2026-06-26
module: 番茄钟
---

# 休息模式计时结束错误创建 PomodoroRecord

## 复现步骤

1. 切换模式到短休息或长休息
2. 开始计时，等待归零
3. 查看 localStorage `pomodoro_app_data.records`

## 预期行为

休息模式结束时不应创建番茄完成记录。`PomodoroRecord` 应仅在专注（focus）模式下产生。

## 实际行为

`useTimer.ts:79` 在任何模式下计时归零都会调用 `store.finish()`，而 `finish()` 无条件创建 `PomodoroRecord`（含 `completed: true` + `todoId: null`）。

这导致：
- records 数组被无意义的休息记录污染
- 今日番茄统计被高估（休息计时被计入）
- streak 计数器在休息完成时也更新，语义错误

## 根因分析

`src/hooks/useTimer.ts:79`：
```ts
store.finish()  // 不区分 focus / break，一律调用
```

`src/stores/timerStore.ts:101-108`：
```ts
data.records.push({
  id: crypto.randomUUID(),
  todoId: state.currentTodoId,
  startTime: ...,
  endTime: Date.now(),
  duration: state.duration,
  completed: true,
})
```

## 建议修复

`finish()` 仅在 `mode === 'focus'` 时创建 record：

```ts
finish: () => {
  const state = get()
  if (state.mode === 'focus') {
    // 仅专注模式记录 PomodoroRecord
    data.records.push({ ... })
  }
  // 休息/专注都更新 streak 和 lastActiveDate
  ...
}
```

## 环境信息

- 浏览器：不限
