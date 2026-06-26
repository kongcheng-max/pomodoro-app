import { create } from 'zustand'
import { nanoid } from 'nanoid'
import type { Todo } from '../types'
import { load, save } from '../utils/storage'
import { getTodayKey, getNow } from '../utils/time'

interface TodoState {
  todos: Todo[]
  selectedTodoId: string | null
  undoStack: { action: string; todo: Todo }[]

  // Actions
  addTodo: (title: string) => void
  toggleTodo: (id: string) => void
  deleteTodo: (id: string) => void
  editTodo: (id: string, title: string) => void
  selectTodo: (id: string | null) => void
  undoDelete: () => void
  clearUndo: () => void
  initFromStorage: () => void
  persist: () => void
}

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  selectedTodoId: null,
  undoStack: [],

  initFromStorage: () => {
    const data = load()
    const todayKey = getTodayKey()
    // Filter to today's todos
    const todayTodos = data.todos.filter((t) => t.dateKey === todayKey)
    set({
      todos: todayTodos.sort((a, b) => {
        // Incomplete first, then by order
        if (a.completed !== b.completed) return a.completed ? 1 : -1
        return a.order - b.order
      }),
    })
  },

  persist: () => {
    const { todos } = get()
    const data = load()
    const todayKey = getTodayKey()
    // Merge: keep non-today todos, replace today's todos
    const otherTodos = data.todos.filter((t) => t.dateKey !== todayKey)
    data.todos = [...otherTodos, ...todos]
    save(data)
  },

  addTodo: (title) => {
    const { todos } = get()
    const todayKey = getTodayKey()

    // 50-item daily limit
    const todayCount = todos.length
    if (todayCount >= 50) return

    const newTodo: Todo = {
      id: nanoid(),
      title: title.trim(),
      completed: false,
      pomodoroCount: 0,
      createdAt: getNow(),
      completedAt: null,
      order: todayCount,
      dateKey: todayKey,
    }

    set({ todos: [newTodo, ...todos] })
    get().persist()
  },

  toggleTodo: (id) => {
    const { todos } = get()
    const updated = todos.map((t) => {
      if (t.id !== id) return t
      return {
        ...t,
        completed: !t.completed,
        completedAt: !t.completed ? getNow() : null,
      }
    })
    // Sort: incompleted first, then by order
    updated.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1
      return a.order - b.order
    })
    set({ todos: updated })
    get().persist()
  },

  deleteTodo: (id) => {
    const { todos } = get()
    const todo = todos.find((t) => t.id === id)
    if (!todo) return

    set({
      todos: todos.filter((t) => t.id !== id),
      undoStack: [{ action: 'delete', todo }],
    })
    get().persist()
  },

  editTodo: (id, title) => {
    const { todos } = get()
    set({
      todos: todos.map((t) =>
        t.id === id ? { ...t, title: title.trim() } : t
      ),
    })
    get().persist()
  },

  selectTodo: (id) => {
    set({ selectedTodoId: id })
  },

  undoDelete: () => {
    const { undoStack, todos } = get()
    if (undoStack.length === 0) return
    const last = undoStack[undoStack.length - 1]
    if (last.action === 'delete') {
      set({
        todos: [last.todo, ...todos],
        undoStack: [],
      })
    }
    get().persist()
  },

  clearUndo: () => {
    set({ undoStack: [] })
  },
}))
