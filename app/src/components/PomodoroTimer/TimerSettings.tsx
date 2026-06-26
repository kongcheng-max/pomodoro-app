import { useState } from 'react'
import { useTimerStore } from '../../stores/timerStore'
import { Settings, X } from 'lucide-react'

const PRESETS = [15, 25, 30, 45, 60, 90]

const LABELS: Record<string, string> = {
  focus: '专注时长',
  shortBreak: '短休息时长',
  longBreak: '长休息时长',
}

export function TimerSettings() {
  const duration = useTimerStore((s) => s.duration)
  const setDuration = useTimerStore((s) => s.setDuration)
  const status = useTimerStore((s) => s.status)
  const mode = useTimerStore((s) => s.mode)
  const [open, setOpen] = useState(false)
  const [custom, setCustom] = useState('')
  const [error, setError] = useState(false)

  const isIdle = status === 'idle' || status === 'finished'

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={!isIdle}
        className="flex items-center gap-1 text-sm text-[var(--color-text-muted)]
                   hover:text-[var(--color-text-secondary)] transition-colors
                   disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Settings size={16} />
        {duration} 分钟
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute top-full mt-2 right-0 z-[60] rounded-2xl p-4 w-56 popover-in"
            style={{ background: '#FFFFFF', boxShadow: 'var(--shadow-raised)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-[var(--color-text-secondary)]">{LABELS[mode]}</span>
              <button onClick={() => setOpen(false)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]">
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              {PRESETS.map((min) => (
                <button
                  key={min}
                  onClick={() => { setDuration(min); setCustom(''); setError(false) }}
                  className={`px-2 py-1.5 text-sm rounded-xl transition-all ${
                    duration === min
                      ? 'bg-tomato text-white'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                  }`}
                  style={duration === min ? { boxShadow: '2px 2px 4px rgba(242,87,87,0.2)' } : {}}
                >
                  {min} 分钟
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="number" min={1} max={120}
                value={custom}
                onChange={(e) => { setCustom(e.target.value); if (error) setError(false) }}
                onKeyDown={(e) => { if (e.key === 'Enter') { const v = parseInt(custom, 10); if (v >= 1 && v <= 120) { setDuration(v); setOpen(false); setError(false) } else { setError(true); setTimeout(() => setError(false), 2000) } } }}
                placeholder="1~120 分钟"
                className={`flex-1 px-3 py-1.5 text-sm rounded-xl dark:text-white outline-none transition-colors ${
                  error ? 'border-red-400 border-2 shake' : ''
                }`}
                style={error ? {} : { boxShadow: 'var(--shadow-recessed)', background: 'var(--color-bg)', border: 'none' }}
              />
              <button
                onClick={() => { const v = parseInt(custom, 10); if (v >= 1 && v <= 120) { setDuration(v); setOpen(false); setError(false) } else { setError(true); setTimeout(() => setError(false), 2000) } }}
                className="px-3 py-1.5 text-sm bg-tomato text-white rounded-xl hover:bg-tomato-dark transition-colors"
                style={{ boxShadow: '2px 2px 4px rgba(242,87,87,0.2)' }}
              >
                确定
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
