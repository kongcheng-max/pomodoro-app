import { useMemo } from 'react'
import { BadgeComponent } from './Badge'
import { checkAchievements, type Badge } from '../../utils/achievements'
import { load } from '../../utils/storage'

export function BadgeWall() {
  const badges = useMemo((): Badge[] => {
    const data = load()
    return checkAchievements(data.records, data.todos, data.streak)
  }, [])

  const unlocked = badges.filter((b) => b.unlocked).length

  return (
    <div className="space-y-4">
      <div
        className="p-4 rounded-2xl"
        style={{ background: '#FFFFFF', boxShadow: 'var(--shadow-raised)' }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[var(--color-text-secondary)]">徽章进度</span>
          <span className="text-sm font-bold text-tomato">{unlocked}/{badges.length}</span>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-bg-secondary)' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${(unlocked / badges.length) * 100}%`, background: 'linear-gradient(to right, #F25757, #F39C12)' }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {badges.filter((b) => b.unlocked).map((b) => (<BadgeComponent key={b.id} badge={b} />))}
      </div>

      {unlocked < badges.length && (
        <>
          <h4 className="text-sm font-medium text-[var(--color-text-muted)] pt-2">待解锁</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {badges.filter((b) => !b.unlocked).map((b) => (<BadgeComponent key={b.id} badge={b} />))}
          </div>
        </>
      )}
    </div>
  )
}
