import { useTimerStore } from '../../stores/timerStore'
import { useTimer } from '../../hooks/useTimer'

export function TimerDisplay() {
  const status = useTimerStore((s) => s.status)
  const mode = useTimerStore((s) => s.mode)
  const { display, progress } = useTimer()

  const modeLabel =
    mode === 'focus' ? '专注' : mode === 'shortBreak' ? '短休息' : '长休息'

  return (
    <div className="flex flex-col items-center justify-center gap-4 select-none">
      {/* Mode label */}
      <span
        className={`text-sm font-medium px-3 py-1 rounded-full ${
          mode === 'focus'
            ? 'bg-tomato/10 text-tomato'
            : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
        }`}
      >
        {modeLabel}
      </span>

      {/* Timer display */}
      <div
        className={`relative flex items-center justify-center ${
          status === 'running' ? 'timer-running' : ''
        }`}
      >
        {/* Circular progress ring */}
        <svg className="w-64 h-64 sm:w-72 sm:h-72 -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-gray-200 dark:text-gray-700"
          />
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            className={`transition-all duration-300 ${
              status === 'finished'
                ? 'text-green-500'
                : mode === 'focus'
                  ? 'text-tomato'
                  : 'text-green-500'
            }`}
            style={{
              strokeDasharray: `${2 * Math.PI * 45}%`,
              strokeDashoffset: `${2 * Math.PI * 45 * (1 - progress)}%`,
            }}
          />
        </svg>

        {/* Time text */}
        <span
          className={`absolute font-mono font-bold tracking-tight tabular-nums ${
            status === 'finished'
              ? 'text-green-500 text-5xl sm:text-6xl'
              : 'text-6xl sm:text-7xl text-[var(--color-text)]'
          } ${status === 'running' ? 'scale-105' : ''} transition-transform duration-300`}
        >
          {display}
        </span>
      </div>
    </div>
  )
}
