import { useState, useRef, type FormEvent } from 'react'
import { useTodoStore } from '../../stores/todoStore'
import { Plus } from 'lucide-react'

export function TodoInput() {
  const [title, setTitle] = useState('')
  const [shaking, setShaking] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const addTodo = useTodoStore((s) => s.addTodo)
  const todos = useTodoStore((s) => s.todos)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = title.trim()

    if (!trimmed) {
      setShaking(true)
      setTimeout(() => setShaking(false), 300)
      return
    }

    if (todos.length >= 50) {
      return
    }

    addTodo(trimmed)
    setTitle('')
    inputRef.current?.focus()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800
                  rounded-xl border-2 border-transparent focus-within:border-tomato/30
                  transition-colors ${shaking ? 'shake' : ''}`}
    >
      <input
        ref={inputRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="添加今天的任务…"
        maxLength={200}
        className="flex-1 bg-transparent outline-none text-sm text-[var(--color-text)]
                   placeholder:text-gray-400 dark:placeholder:text-gray-500"
      />
      <button
        type="submit"
        disabled={todos.length >= 50}
        className="flex items-center justify-center w-8 h-8 rounded-lg bg-tomato text-white
                   hover:bg-tomato-dark active:scale-90 transition-all disabled:opacity-40
                   disabled:cursor-not-allowed"
      >
        <Plus size={18} />
      </button>
    </form>
  )
}
