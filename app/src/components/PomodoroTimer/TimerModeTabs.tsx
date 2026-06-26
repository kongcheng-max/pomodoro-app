import { useTimerStore } from '../../stores/timerStore'
import { load } from '../../utils/storage'
import type { TimerMode } from '../../types'

const TABS: { mode: TimerMode; label: string }[] = [
  { mode: 'focus', label: '专注' },
  { mode: 'shortBreak', label: '短休息' },
  { mode: 'longBreak', label: '长休息' },
]

function getDuration(mode: TimerMode, settings: ReturnType<typeof load>['settings']): number {
  if (mode === 'focus') return settings.focusDuration
  if (mode === 'shortBreak') return settings.shortBreakDuration
  return settings.longBreakDuration
}

export function TimerModeTabs() {
  const mode = useTimerStore((s) => s.mode)
  const status = useTimerStore((s) => s.status)
  const setMode = useTimerStore((s) => s.setMode)

  const isLocked = status === 'running' || status === 'paused'
  const settings = load().settings

  return (
    <div className="w-full max-w-xs mx-auto mb-4">
      <div className="flex gap-1 bg-[var(--color-bg)] rounded-full p-1">
        {TABS.map((tab) => {
          const active = mode === tab.mode
          const duration = getDuration(tab.mode, settings)

          return (
            <button
              key={tab.mode}
              onClick={() => !isLocked && setMode(tab.mode)}
              disabled={isLocked}
              className={`flex-1 py-1.5 px-1 text-xs sm:text-sm rounded-full font-medium
                         transition-all duration-300 ${
                           active
                             ? 'text-tomato'
                             : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                         } ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              style={active ? { background: '#FFFFFF', boxShadow: 'var(--shadow-subtle)' } : {}}
              title={isLocked ? '计时中无法切换模式' : `${tab.label} ${duration} 分钟`}
            >
              <span className="block">{tab.label}</span>
              <span className={`block text-[10px] sm:text-xs opacity-50`}>
                {duration}min
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
