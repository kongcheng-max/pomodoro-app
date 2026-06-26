import { useState, useRef, useEffect } from 'react'
import { useTodoStore } from '../../stores/todoStore'
import { useTimerStore } from '../../stores/timerStore'
import { Circle, CheckCircle2, Trash2, Clock } from 'lucide-react'
import type { Todo } from '../../types'

interface TodoItemProps {
  todo: Todo
}

export function TodoItem({ todo }: TodoItemProps) {
  const toggleTodo = useTodoStore((s) => s.toggleTodo)
  const deleteTodo = useTodoStore((s) => s.deleteTodo)
  const editTodo = useTodoStore((s) => s.editTodo)
  const selectTodo = useTodoStore((s) => s.selectTodo)
  const selectedTodoId = useTodoStore((s) => s.selectedTodoId)
  const start = useTimerStore((s) => s.start)
  const status = useTimerStore((s) => s.status)

  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const editRef = useRef<HTMLInputElement>(null)

  const isSelected = selectedTodoId === todo.id
  const isIdle = status === 'idle' || status === 'finished'

  useEffect(() => {
    if (editing) {
      editRef.current?.focus()
      editRef.current?.select()
    }
  }, [editing])

  const handleDoubleClick = () => {
    if (todo.completed) return
    setEditTitle(todo.title)
    setEditing(true)
  }

  const handleEditConfirm = () => {
    const trimmed = editTitle.trim()
    if (trimmed && trimmed !== todo.title) {
      editTodo(todo.id, trimmed)
    }
    setEditing(false)
  }

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleEditConfirm()
    if (e.key === 'Escape') setEditing(false)
  }

  const handleSelect = () => {
    if (isIdle && !todo.completed) {
      selectTodo(isSelected ? null : todo.id)
    }
  }

  const handleStartPomodoro = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isIdle) {
      selectTodo(todo.id)
      start(todo.id)
    }
  }

  return (
    <div
      onClick={handleSelect}
      className={`group flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer
                  transition-all duration-200 border border-transparent
                  ${isSelected ? 'bg-tomato/5 border-tomato/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}
                  ${todo.completed ? 'opacity-60' : ''}`}
    >
      {/* Checkbox */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          toggleTodo(todo.id)
        }}
        className="flex-shrink-0 text-gray-300 dark:text-gray-600 hover:text-tomato
                   transition-colors"
      >
        {todo.completed ? (
          <CheckCircle2 size={22} className="text-tomato" />
        ) : (
          <Circle size={22} />
        )}
      </button>

      {/* Title / Edit input */}
      {editing ? (
        <input
          ref={editRef}
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={handleEditConfirm}
          onKeyDown={handleEditKeyDown}
          maxLength={200}
          className="flex-1 bg-white dark:bg-gray-700 border border-tomato/40 rounded-lg
                     px-2 py-0.5 text-sm outline-none"
        />
      ) : (
        <span
          onDoubleClick={handleDoubleClick}
          className={`flex-1 text-sm select-none ${
            todo.completed
              ? 'line-through text-gray-400 dark:text-gray-500'
              : 'text-[var(--color-text)]'
          }`}
        >
          {todo.title}
        </span>
      )}

      {/* Pomodoro count */}
      {todo.pomodoroCount > 0 && (
        <span className="flex items-center gap-0.5 text-xs text-tomato font-medium">
          <Clock size={12} />
          {todo.pomodoroCount}
        </span>
      )}

      {/* Quick start pomodoro */}
      {!todo.completed && isIdle && (
        <button
          onClick={handleStartPomodoro}
          className="flex-shrink-0 w-6 h-6 rounded-full bg-tomato/10 text-tomato
                     flex items-center justify-center opacity-0 group-hover:opacity-100
                     hover:bg-tomato hover:text-white transition-all active:scale-90"
          title="开始此任务"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      )}

      {/* Delete */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          deleteTodo(todo.id)
        }}
        className="flex-shrink-0 text-gray-300 dark:text-gray-600
                   opacity-0 group-hover:opacity-100 hover:text-tomato
                   transition-all active:scale-90"
        title="删除任务"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}
