import PomodoroTimer from '../components/PomodoroTimer'
import TodoList from '../components/TodoList'

export default function HomePage() {
  return (
    <div className="flex flex-col lg:flex-row lg:divide-x lg:divide-[var(--color-border)] min-h-[calc(100vh-8rem)]">
      {/* Left: Pomodoro Timer */}
      <section className="flex-1 flex items-center justify-center lg:min-w-[400px]">
        <PomodoroTimer />
      </section>

      {/* Right: Todo List */}
      <section className="flex-1 flex flex-col lg:min-w-[360px] border-t lg:border-t-0 border-[var(--color-border)]">
        <TodoList />
      </section>
    </div>
  )
}
