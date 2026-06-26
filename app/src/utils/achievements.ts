import type { PomodoroRecord, Todo } from '../types'

export type BadgeTier = 'bronze' | 'silver' | 'gold'

export interface Badge {
  id: string
  name: string
  icon: string
  tier: BadgeTier
  unlocked: boolean
  condition: string
}

const BADGE_DEFS = [
  {
    id: 'first-focus',
    name: '初次专注',
    icon: '🌱',
    tier: 'bronze' as BadgeTier,
    condition: '完成第 1 个番茄',
  },
  {
    id: 'persistent',
    name: '坚持者',
    icon: '🌿',
    tier: 'bronze' as BadgeTier,
    condition: '累计完成 10 个番茄',
  },
  {
    id: 'focused',
    name: '专注达人',
    icon: '🌳',
    tier: 'silver' as BadgeTier,
    condition: '累计完成 100 个番茄',
  },
  {
    id: 'master',
    name: '番茄大师',
    icon: '🏅',
    tier: 'gold' as BadgeTier,
    condition: '累计完成 1000 个番茄',
  },
  {
    id: 'streak-7',
    name: '连续打卡',
    icon: '🔥',
    tier: 'bronze' as BadgeTier,
    condition: '连续 7 天专注',
  },
  {
    id: 'streak-30',
    name: '自律王者',
    icon: '💎',
    tier: 'gold' as BadgeTier,
    condition: '连续 30 天专注',
  },
  {
    id: 'efficient-day',
    name: '高效一天',
    icon: '⚡',
    tier: 'silver' as BadgeTier,
    condition: '单日完成 8 个番茄',
  },
  {
    id: 'early-bird',
    name: '早起的鸟',
    icon: '🐦',
    tier: 'bronze' as BadgeTier,
    condition: '早上 6-8 点完成 2 个番茄',
  },
  {
    id: 'night-owl',
    name: '夜猫子',
    icon: '🦉',
    tier: 'bronze' as BadgeTier,
    condition: '晚上 10 点后完成 3 个番茄',
  },
  {
    id: 'task-cleaner',
    name: '任务清道夫',
    icon: '🧹',
    tier: 'silver' as BadgeTier,
    condition: '单日完成全部待办',
  },
]

export function checkAchievements(records: PomodoroRecord[], todos: Todo[], streak: number): Badge[] {
  const completed = records.filter((r) => r.completed)
  const total = completed.length

  // Group records by date
  const byDate = new Map<string, PomodoroRecord[]>()
  for (const r of completed) {
    const key = new Date(r.startTime).toISOString().slice(0, 10)
    if (!byDate.has(key)) byDate.set(key, [])
    byDate.get(key)!.push(r)
  }

  // Max pomodoros in a single day
  let maxPerDay = 0
  for (const [, recs] of byDate) {
    if (recs.length > maxPerDay) maxPerDay = recs.length
  }

  // Early bird: 2+ between 6-8am
  let earlyBird = false
  for (const [, recs] of byDate) {
    const morningCount = recs.filter((r) => {
      const h = new Date(r.startTime).getHours()
      return h >= 6 && h < 8
    }).length
    if (morningCount >= 2) {
      earlyBird = true
      break
    }
  }

  // Night owl: 3+ after 10pm
  let nightOwl = false
  for (const [, recs] of byDate) {
    const nightCount = recs.filter((r) => {
      const h = new Date(r.startTime).getHours()
      return h >= 22
    }).length
    if (nightCount >= 3) {
      nightOwl = true
      break
    }
  }

  // Task cleaner: all todos in one day completed
  let taskCleaner = false
  const todosByDate = new Map<string, Todo[]>()
  for (const t of todos) {
    if (!todosByDate.has(t.dateKey)) todosByDate.set(t.dateKey, [])
    todosByDate.get(t.dateKey)!.push(t)
  }
  for (const [, dayTodos] of todosByDate) {
    if (dayTodos.length > 0 && dayTodos.every((t) => t.completed)) {
      taskCleaner = true
      break
    }
  }

  return BADGE_DEFS.map((def) => {
    let unlocked = false
    switch (def.id) {
      case 'first-focus':
        unlocked = total >= 1
        break
      case 'persistent':
        unlocked = total >= 10
        break
      case 'focused':
        unlocked = total >= 100
        break
      case 'master':
        unlocked = total >= 1000
        break
      case 'streak-7':
        unlocked = streak >= 7
        break
      case 'streak-30':
        unlocked = streak >= 30
        break
      case 'efficient-day':
        unlocked = maxPerDay >= 8
        break
      case 'early-bird':
        unlocked = earlyBird
        break
      case 'night-owl':
        unlocked = nightOwl
        break
      case 'task-cleaner':
        unlocked = taskCleaner
        break
    }
    return { ...def, unlocked }
  })
}
