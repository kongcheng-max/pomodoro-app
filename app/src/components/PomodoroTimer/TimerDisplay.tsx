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
      {/* Mode label pill */}
      <span
        className={`text-xs font-medium px-3 py-1 rounded-full ${
          mode === 'focus'
            ? 'bg-tomato-light text-tomato'
            : 'bg-green-100 text-green dark:bg-green-900/30 dark:text-green'
        }`}
      >
        {modeLabel}
      </span>

      {/* Timer ring — recessed circular track */}
      <div
        className={`relative flex items-center justify-center ${
          status === 'running' ? 'timer-running' : ''
        }`}
      >
        {/* Recessed track container */}
        <div
          className="w-64 h-64 sm:w-72 sm:h-72 rounded-full"
          style={{ boxShadow: 'var(--shadow-deep)' }}
        >
          <svg className="w-full h-full -rotate-90">
            {/* Track */}
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="#E8ECF1"
              strokeWidth="8"
              className="dark:stroke-[#293847]"
            />
            {/* Progress arc */}
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              className={`transition-all duration-300 ${
                status === 'finished'
                  ? 'text-green'
                  : mode === 'focus'
                    ? 'text-tomato'
                    : 'text-green'
              }`}
              style={{
                strokeDasharray: `${2 * Math.PI * 45}%`,
                strokeDashoffset: `${2 * Math.PI * 45 * (1 - progress)}%`,
              }}
            />
          </svg>
        </div>

        {/* Time text */}
        <span
          className={`absolute font-mono font-bold tracking-tight tabular-nums ${
            status === 'finished'
              ? 'text-green text-5xl sm:text-6xl'
              : 'text-6xl sm:text-7xl text-[var(--color-text)]'
          } ${status === 'running' ? 'scale-105' : ''} transition-transform duration-300`}
        >
          {display}
        </span>
      </div>
    </div>
  )
}
