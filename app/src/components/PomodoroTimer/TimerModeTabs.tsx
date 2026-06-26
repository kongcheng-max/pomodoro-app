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
    <div className="w-full max-w-xs mx-auto mb-3">
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
        {TABS.map((tab) => {
          const active = mode === tab.mode
          const duration = getDuration(tab.mode, settings)

          return (
            <button
              key={tab.mode}
              onClick={() => !isLocked && setMode(tab.mode)}
              disabled={isLocked}
              className={`flex-1 py-1.5 px-1 text-xs sm:text-sm rounded-lg font-medium transition-all duration-200 ${
                active
                  ? 'bg-white dark:bg-gray-700 text-tomato shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              } ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              title={isLocked ? '计时中无法切换模式' : `${tab.label} ${duration} 分钟`}
            >
              <span className="block">{tab.label}</span>
              <span className={`block text-[10px] sm:text-xs ${active ? 'opacity-70' : 'opacity-50'}`}>
                {duration}min
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
