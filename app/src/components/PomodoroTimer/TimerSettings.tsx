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

  const handleSelect = (min: number) => {
    setDuration(min)
    setCustom('')
    setError(false)
  }

  const handleCustom = () => {
    const val = parseInt(custom, 10)
    if (val >= 1 && val <= 120) {
      setDuration(val)
      setOpen(false)
      setError(false)
    } else {
      setError(true)
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={!isIdle}
        className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600
                   dark:hover:text-gray-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Settings size={16} />
        {duration} 分钟
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div
            className="absolute top-full mt-2 right-0 z-[60] bg-white dark:bg-gray-800
                          border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-4 w-56"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500">{LABELS[mode]}</span>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              {PRESETS.map((min) => (
                <button
                  key={min}
                  onClick={() => handleSelect(min)}
                  className={`px-2 py-1.5 text-sm rounded-lg transition-colors ${
                    duration === min
                      ? 'bg-tomato text-white'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {min} 分钟
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="number"
                min={1}
                max={120}
                value={custom}
                onChange={(e) => { setCustom(e.target.value); if (error) setError(false) }}
                onKeyDown={(e) => e.key === 'Enter' && handleCustom()}
                placeholder="1~120 分钟"
                className={`flex-1 px-3 py-1.5 text-sm rounded-lg bg-gray-50 dark:bg-gray-700
                           focus:outline-none focus:ring-2 dark:text-white transition-colors ${
                             error
                               ? 'border-red-400 border-2 shake focus:ring-red-400/50'
                               : 'border border-gray-200 dark:border-gray-600 focus:ring-tomato/50'
                           }`}
              />
              <button
                onClick={handleCustom}
                className="px-3 py-1.5 text-sm bg-tomato text-white rounded-lg
                           hover:bg-tomato-dark transition-colors"
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
