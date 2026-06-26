import { useTodos } from '../../hooks/useTodos'
import { TodoInput } from './TodoInput'
import { TodoItem } from './TodoItem'
import { Undo, ClipboardList } from 'lucide-react'

export default function TodoList() {
  const { todos, undoStack, undoDelete } = useTodos()

  const incompleted = todos.filter((t) => !t.completed)
  const completed = todos.filter((t) => t.completed)
  const undoItem = undoStack[undoStack.length - 1]

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-6 pb-3">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-[var(--color-text)]">
          <ClipboardList size={20} className="text-tomato" />
          今日待办
        </h2>
      </div>

      <div className="px-4 pb-3">
        <TodoInput />
      </div>

      {undoItem && (
        <div className="mx-4 mb-2 px-4 py-2 rounded-xl text-sm flex items-center justify-between slide-up"
          style={{ background: '#2C3E50', color: '#FFFFFF' }}>
          <span>已删除「{undoItem.todo.title}」</span>
          <button onClick={undoDelete} className="flex items-center gap-1 text-tomato font-medium hover:underline">
            <Undo size={14} />撤销
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {todos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-[var(--color-text-muted)]">
            <ClipboardList size={48} strokeWidth={1} />
            <p className="mt-3 text-sm">今天还没有任务</p>
            <p className="text-xs mt-1">添加你的第一个任务开始吧 ✨</p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {incompleted.map((todo) => (<TodoItem key={todo.id} todo={todo} />))}
            {completed.length > 0 && incompleted.length > 0 && (
              <div className="py-2 px-4">
                <div className="border-t" style={{ borderColor: 'var(--color-border)' }} />
              </div>
            )}
            {completed.map((todo) => (<TodoItem key={todo.id} todo={todo} />))}
          </div>
        )}
      </div>
    </div>
  )
}
