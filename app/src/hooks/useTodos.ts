import { useEffect } from 'react'
import { useTodoStore } from '../stores/todoStore'

export function useTodos() {
  const store = useTodoStore()

  // Initialize from storage on mount
  useEffect(() => {
    store.initFromStorage()
  }, [])

  // Auto-clear undo after 3 seconds
  useEffect(() => {
    if (store.undoStack.length === 0) return
    const timer = setTimeout(() => {
      store.clearUndo()
    }, 3000)
    return () => clearTimeout(timer)
  }, [store.undoStack.length])

  return store
}
