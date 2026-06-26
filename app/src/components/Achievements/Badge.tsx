import type { Badge as BadgeType } from '../../utils/achievements'

const TIER_COLORS = {
  bronze: 'from-amber-700 to-amber-500',
  silver: 'from-gray-400 to-gray-300',
  gold: 'from-yellow-500 to-yellow-300',
}

const TIER_BG = {
  bronze: 'bg-amber-50 dark:bg-amber-900/20',
  silver: 'bg-gray-50 dark:bg-gray-800',
  gold: 'bg-yellow-50 dark:bg-yellow-900/20',
}

interface Props {
  badge: BadgeType
}

export function BadgeComponent({ badge }: Props) {
  return (
    <div
      className={`relative rounded-xl border p-4 flex flex-col items-center text-center gap-2 transition-all ${
        badge.unlocked
          ? `${TIER_BG[badge.tier]} border-gray-200 dark:border-gray-700`
          : 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 opacity-50 grayscale'
      }`}
    >
      {/* Tier badge */}
      {badge.unlocked && (
        <span
          className={`absolute -top-1.5 -right-1.5 text-[10px] px-1.5 py-0.5 rounded-full text-white bg-gradient-to-r ${TIER_COLORS[badge.tier]}`}
        >
          {badge.tier === 'bronze' ? '🥉' : badge.tier === 'silver' ? '🥈' : '🥇'}
        </span>
      )}
      <span className="text-3xl">{badge.icon}</span>
      <div>
        <div className="text-sm font-semibold text-[var(--color-text)]">{badge.name}</div>
        <div className="text-[10px] text-gray-400 mt-0.5">{badge.condition}</div>
      </div>
    </div>
  )
}
