import { NavLink } from 'react-router-dom'
import { Timer, BarChart3, Trophy } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', icon: Timer, label: '番茄钟' },
  { to: '/stats', icon: BarChart3, label: '统计' },
  { to: '/achievements', icon: Trophy, label: '成就' },
]

export function BottomNav() {
  return (
    <nav
      className="sticky bottom-0 z-50 backdrop-blur-md border-t"
      style={{
        background: 'rgba(240,244,249,0.85)',
        borderColor: 'var(--color-border)',
        boxShadow: 'var(--shadow-subtle)',
      }}
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to} to={item.to} end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 text-xs font-medium transition-colors ${
                isActive ? 'text-tomato' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
