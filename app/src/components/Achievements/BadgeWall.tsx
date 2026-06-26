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
      {/* Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-500">徽章进度</span>
          <span className="text-sm font-bold text-tomato">{unlocked}/{badges.length}</span>
        </div>
        <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-tomato to-amber-500 rounded-full transition-all"
            style={{ width: `${(unlocked / badges.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Unlocked badges first */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {badges
          .filter((b) => b.unlocked)
          .map((badge) => (
            <BadgeComponent key={badge.id} badge={badge} />
          ))}
      </div>

      {/* Locked badges */}
      {unlocked < badges.length && (
        <>
          <h4 className="text-sm font-medium text-gray-400 pt-2">待解锁</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {badges
              .filter((b) => !b.unlocked)
              .map((badge) => (
                <BadgeComponent key={badge.id} badge={badge} />
              ))}
          </div>
        </>
      )}
    </div>
  )
}
