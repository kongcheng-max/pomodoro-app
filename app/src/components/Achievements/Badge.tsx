import type { Badge as BadgeType } from '../../utils/achievements'

interface Props { badge: BadgeType }

export function BadgeComponent({ badge }: Props) {
  const tierLabel = badge.tier === 'bronze' ? '🥉' : badge.tier === 'silver' ? '🥈' : '🥇'

  return (
    <div
      className="relative rounded-2xl p-4 flex flex-col items-center text-center gap-2 transition-all"
      style={
        badge.unlocked
          ? { background: '#FFFFFF', boxShadow: 'var(--shadow-raised)' }
          : { background: 'var(--color-bg)', boxShadow: 'none', opacity: 0.5, filter: 'grayscale(1)' }
      }
    >
      {badge.unlocked && (
        <span className="absolute -top-1.5 -right-1.5 text-[10px]">{tierLabel}</span>
      )}
      <span className="text-3xl">{badge.icon}</span>
      <div>
        <div className="text-sm font-semibold text-[var(--color-text)]">{badge.name}</div>
        <div className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{badge.condition}</div>
      </div>
    </div>
  )
}
