import { useTimerStore } from '../../stores/timerStore'
import { useTodoStore } from '../../stores/todoStore'
import { TimerDisplay } from './TimerDisplay'
import { TimerControls } from './TimerControls'
import { TimerSettings } from './TimerSettings'
import { TimerModeTabs } from './TimerModeTabs'
import { WhiteNoiseControl } from './WhiteNoiseControl'

export default function PomodoroTimer() {
  const status = useTimerStore((s) => s.status)
  const currentTodoId = useTimerStore((s) => s.currentTodoId)
  const todos = useTodoStore((s) => s.todos)
  const selectedTodoId = useTodoStore((s) => s.selectedTodoId)

  const currentTodo = currentTodoId
    ? todos.find((t) => t.id === currentTodoId)
    : null
  const selectedTodo = selectedTodoId
    ? todos.find((t) => t.id === selectedTodoId)
    : null

  return (
    <div className="flex flex-col items-center py-8 px-4">
      <TimerModeTabs />
      <TimerDisplay />

      {/* Current / selected task indicator */}
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center min-h-[24px]">
        {status === 'running' && currentTodo && (
          <span>
            当前专注：
            <span className="text-tomato font-medium">{currentTodo.title}</span>
          </span>
        )}
        {status === 'idle' && selectedTodo && (
          <span>
            已选择：
            <span className="font-medium">{selectedTodo.title}</span>
          </span>
        )}
        {status === 'idle' && !selectedTodo && (
          <span className="text-gray-400">选择任务开始，或直接开始通用番茄</span>
        )}
      </div>

      <TimerControls />

      <div className="mt-4 flex items-center gap-3">
        <TimerSettings />
        <div className="w-px h-4 bg-gray-200 dark:bg-gray-600" />
        <WhiteNoiseControl />
      </div>
    </div>
  )
}
