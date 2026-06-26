import { Flame } from 'lucide-react'

interface Props { streak: number }

export function StreakCounter({ streak }: Props) {
  return (
    <div
      className="flex items-center gap-4 p-4 dark:bg-[var(--color-white)]"
      style={{ background: '#FFFFFF', borderRadius: 16, boxShadow: 'var(--shadow-raised)' }}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full" style={{ background: '#FEF3C7' }}>
        <Flame size={24} className="text-amber" />
      </div>
      <div>
        <div className="text-2xl font-bold text-[var(--color-text)]">{streak} 天</div>
        <div className="text-xs text-[var(--color-text-secondary)]">连续专注</div>
      </div>
    </div>
  )
}
