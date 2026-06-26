import { useState, useRef } from 'react'
import { useTodoStore } from '../../stores/todoStore'
import { Plus } from 'lucide-react'

export function TodoInput() {
  const [title, setTitle] = useState('')
  const [shaking, setShaking] = useState(false)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const addTodo = useTodoStore((s) => s.addTodo)
  const todos = useTodoStore((s) => s.todos)

  const focusStyle: React.CSSProperties = focused
    ? {
        boxShadow: 'inset 4px 4px 8px #D6DBE3, inset -2px -2px 4px #FFFFFF, 0 0 0 2px rgba(242,87,87,0.15)',
        background: '#FFFFFF',
      }
    : { boxShadow: 'var(--shadow-recessed)', background: 'var(--color-bg)' }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const trimmed = title.trim()
        if (!trimmed) { setShaking(true); setTimeout(() => setShaking(false), 300); return }
        if (todos.length >= 50) return
        addTodo(trimmed)
        setTitle('')
        inputRef.current?.focus()
      }}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${shaking ? 'shake' : ''}`}
      style={focusStyle}
    >
      <input
        ref={inputRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="添加今天的任务…"
        maxLength={200}
        className="flex-1 bg-transparent outline-none text-sm text-[var(--color-text)]
                   placeholder:text-[var(--color-text-muted)]"
      />
      <button
        type="submit"
        disabled={todos.length >= 50}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-tomato text-white
                   hover:bg-tomato-dark active:scale-90 transition-all disabled:opacity-40
                   disabled:cursor-not-allowed"
        style={{ boxShadow: '2px 2px 4px rgba(242,87,87,0.25), -1px -1px 2px rgba(255,255,255,0.3)' }}
      >
        <Plus size={18} />
      </button>
    </form>
  )
}
