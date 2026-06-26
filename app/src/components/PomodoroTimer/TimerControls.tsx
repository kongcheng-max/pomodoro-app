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

  const handleStart = async () => {
    await requestPermission()
    start(selectedTodoId)
  }

  return (
    <div className="flex items-center justify-center gap-3 mt-6">
      {status === 'idle' && (
        <button
          onClick={handleStart}
          className="flex items-center gap-2 px-6 py-3 bg-tomato text-white rounded-full font-medium
                     hover:bg-tomato-dark active:scale-95 transition-all shadow-lg shadow-tomato/25"
        >
          <Play size={20} fill="currentColor" />
          开始
        </button>
      )}

      {status === 'running' && (
        <>
          <button
            onClick={pause}
            className="flex items-center gap-2 px-5 py-3 bg-amber-500 text-white rounded-full font-medium
                       hover:bg-amber-600 active:scale-95 transition-all shadow-lg shadow-amber-500/25"
          >
            <Pause size={20} />
            暂停
          </button>
          <button
            onClick={giveUp}
            className="flex items-center gap-2 px-5 py-3 bg-gray-200 dark:bg-gray-700 text-gray-600
                       dark:text-gray-300 rounded-full font-medium hover:bg-gray-300 dark:hover:bg-gray-600
                       active:scale-95 transition-all"
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
            className="flex items-center gap-2 px-6 py-3 bg-tomato text-white rounded-full font-medium
                       hover:bg-tomato-dark active:scale-95 transition-all shadow-lg shadow-tomato/25"
          >
            <Play size={20} fill="currentColor" />
            继续
          </button>
          <button
            onClick={giveUp}
            className="flex items-center gap-2 px-5 py-3 bg-gray-200 dark:bg-gray-700 text-gray-600
                       dark:text-gray-300 rounded-full font-medium hover:bg-gray-300 dark:hover:bg-gray-600
                       active:scale-95 transition-all"
          >
            <RotateCcw size={20} />
            放弃
          </button>
        </>
      )}

      {status === 'finished' && (
        <button
          onClick={reset}
          className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full font-medium
                     hover:bg-green-600 active:scale-95 transition-all shadow-lg shadow-green-500/25"
        >
          <CheckCircle size={20} />
          完成！再来一轮
        </button>
      )}
    </div>
  )
}
