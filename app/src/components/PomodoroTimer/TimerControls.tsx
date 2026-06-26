import { useTimerStore } from '../../stores/timerStore'
import { useTodoStore } from '../../stores/todoStore'
import { requestPermission } from '../../hooks/useNotification'
import { Play, Pause, RotateCcw, X, CheckCircle } from 'lucide-react'

export function TimerControls() {
  const status = useTimerStore((s) => s.status)
  const start = useTimerStore((s) => s.start)
  const pause = useTimerStore((s) => s.pause)
  const resume = useTimerStore((s) => s.resume)
  const giveUp = useTimerStore((s) => s.giveUp)
  const reset = useTimerStore((s) => s.reset)
  const selectedTodoId = useTodoStore((s) => s.selectedTodoId)

  return (
    <div className="flex items-center justify-center gap-3 mt-6">
      {status === 'idle' && (
        <button
          onClick={async () => {
            await requestPermission()
            start(selectedTodoId)
          }}
          className="flex items-center gap-2 px-7 py-3 bg-tomato text-white rounded-full font-medium
                     hover:bg-tomato-dark active:scale-95 transition-all"
          style={{
            boxShadow: '4px 4px 8px rgba(242,87,87,0.3), -2px -2px 4px rgba(255,255,255,0.5)',
          }}
        >
          <Play size={20} fill="currentColor" />
          开始
        </button>
      )}

      {status === 'running' && (
        <>
          <button
            onClick={pause}
            className="flex items-center gap-2 px-5 py-3 bg-[var(--color-bg)] text-amber rounded-full
                       font-medium hover:opacity-90 active:scale-95 transition-all"
            style={{ boxShadow: 'var(--shadow-recessed)' }}
          >
            <Pause size={20} />
            暂停
          </button>
          <button
            onClick={giveUp}
            className="flex items-center gap-2 px-5 py-3 rounded-full font-medium
                       active:scale-95 transition-all text-white bg-[#BDC3C7] hover:bg-[#95A5A6]"
          >
            <X size={20} />
            放弃
          </button>
        </>
      )}

      {status === 'paused' && (
        <>
          <button
            onClick={resume}
            className="flex items-center gap-2 px-7 py-3 bg-tomato text-white rounded-full font-medium
                       hover:bg-tomato-dark active:scale-95 transition-all"
            style={{
              boxShadow: '4px 4px 8px rgba(242,87,87,0.3), -2px -2px 4px rgba(255,255,255,0.5)',
            }}
          >
            <Play size={20} fill="currentColor" />
            继续
          </button>
          <button
            onClick={giveUp}
            className="flex items-center gap-2 px-5 py-3 rounded-full font-medium
                       active:scale-95 transition-all text-white bg-[#BDC3C7] hover:bg-[#95A5A6]"
          >
            <RotateCcw size={20} />
            放弃
          </button>
        </>
      )}

      {status === 'finished' && (
        <button
          onClick={reset}
          className="flex items-center gap-2 px-7 py-3 bg-green text-white rounded-full font-medium
                     hover:bg-[#219A52] active:scale-95 transition-all"
          style={{
            boxShadow: '4px 4px 8px rgba(39,174,96,0.3), -2px -2px 4px rgba(255,255,255,0.5)',
          }}
        >
          <CheckCircle size={20} />
          完成！再来一轮
        </button>
      )}
    </div>
  )
}
