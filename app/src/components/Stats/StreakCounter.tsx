import { Flame } from 'lucide-react'

interface Props {
  streak: number
}

export function StreakCounter({ streak }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex items-center gap-4">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30">
        <Flame size={24} className="text-amber-500" />
      </div>
      <div>
        <div className="text-2xl font-bold text-[var(--color-text)]">{streak} 天</div>
        <div className="text-xs text-gray-500">连续专注</div>
      </div>
    </div>
  )
}
