import type { PomodoroRecord } from '../types'

/** Daily stats snapshot */
export interface DailyStats {
  date: string
  label: string
  count: number
  totalMinutes: number
}

/** Time distribution */
export interface TimeDistribution {
  morning: number   // 6-12
  afternoon: number // 12-18
  evening: number   // 18-24
  night: number     // 0-6
}

/** Complete stats summary */
export interface StatsSummary {
  todayPomodoros: number
  todayMinutes: number
  totalPomodoros: number
  totalMinutes: number
  streak: number
  dailyStats: DailyStats[]
  timeDistribution: TimeDistribution
  completionRate: number // 0-1
}

function getDayLabel(dateStr: string, index: number): string {
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const d = new Date(dateStr)
  if (index === 0) return '今天'
  return days[d.getDay()]
}

/** Compute all stats from records */
export function computeStats(records: PomodoroRecord[], streak: number): StatsSummary {
  const now = new Date()
  const todayKey = now.toISOString().slice(0, 10)

  // Filter to completed records only
  const completed = records.filter((r) => r.completed)

  // Today's stats
  const todayRecords = completed.filter((r) => {
    const d = new Date(r.startTime).toISOString().slice(0, 10)
    return d === todayKey
  })
  const todayPomodoros = todayRecords.length
  const todayMinutes = todayRecords.reduce((sum, r) => sum + r.duration, 0)

  // Total stats
  const totalPomodoros = completed.length
  const totalMinutes = completed.reduce((sum, r) => sum + r.duration, 0)

  // Completion rate (completed vs all)
  const completionRate =
    records.length > 0 ? completed.length / records.length : 0

  // Daily stats for last 7 days
  const dailyMap = new Map<string, number>()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    dailyMap.set(key, 0)
  }

  for (const r of completed) {
    const key = new Date(r.startTime).toISOString().slice(0, 10)
    if (dailyMap.has(key)) {
      dailyMap.set(key, (dailyMap.get(key) ?? 0) + 1)
    }
  }

  const dailyStats: DailyStats[] = Array.from(dailyMap.entries())
    .map(([date, count], index) => {
      const dayTotal = completed
        .filter((r) => new Date(r.startTime).toISOString().slice(0, 10) === date)
        .reduce((s, r) => s + r.duration, 0)
      return {
        date,
        label: getDayLabel(date, 6 - index),
        count,
        totalMinutes: dayTotal,
      }
    })
    .sort((a, b) => a.date.localeCompare(b.date))

  // Time distribution
  const timeDistribution: TimeDistribution = { morning: 0, afternoon: 0, evening: 0, night: 0 }
  for (const r of completed) {
    const hour = new Date(r.startTime).getHours()
    if (hour >= 6 && hour < 12) timeDistribution.morning += r.duration
    else if (hour >= 12 && hour < 18) timeDistribution.afternoon += r.duration
    else if (hour >= 18 && hour < 24) timeDistribution.evening += r.duration
    else timeDistribution.night += r.duration
  }

  return {
    todayPomodoros,
    todayMinutes,
    totalPomodoros,
    totalMinutes,
    streak,
    dailyStats,
    timeDistribution,
    completionRate,
  }
}

/** Format minutes to hours+minutes display */
export function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h > 0 && m > 0) return `${h}h ${m}m`
  if (h > 0) return `${h}h`
  return `${m}m`
}
