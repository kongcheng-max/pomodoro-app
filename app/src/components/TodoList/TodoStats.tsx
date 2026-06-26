import { useTodoStore } from '../../stores/todoStore'
import { load } from '../../utils/storage'
import { getTodayKey } from '../../utils/time'
import { CheckCircle2, Clock } from 'lucide-react'

export function TodoStats() {
  const todos = useTodoStore((s) => s.todos)
  const completedCount = todos.filter((t) => t.completed).length
  const totalCount = todos.length

  // Today's completed pomodoros from records
  const data = load()
  const todayKey = getTodayKey()
  const todayPomodoros = data.records.filter((r) => {
    if (!r.completed) return false
    const recordDate = new Date(r.startTime).toISOString().slice(0, 10)
    return recordDate === todayKey
  }).length

  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex items-center gap-1.5 text-tomato font-medium">
        <Clock size={16} />
        <span>{todayPomodoros} 番茄</span>
      </div>
      <div className="w-px h-4" style={{ background: 'var(--color-border)' }} />
      <div className="flex items-center gap-1.5 text-green font-medium">
        <CheckCircle2 size={16} />
        <span>{completedCount}/{totalCount}</span>
      </div>
    </div>
  )
}
