import { create } from 'zustand'
import { nanoid } from 'nanoid'
import type { TimerStatus, TimerMode } from '../types'
import { load, save } from '../utils/storage'

interface TimerState {
  status: TimerStatus
  mode: TimerMode
  duration: number // minutes
  endTimestamp: number | null
  currentTodoId: string | null
  sessionCount: number // completed focus sessions in current cycle [P1]

  // Actions
  setDuration: (minutes: number) => void
  start: (todoId?: string | null) => void
  pause: () => void
  resume: () => void
  giveUp: () => void
  finish: () => void
  reset: () => void
  setMode: (mode: TimerMode) => void
  autoTransition: () => void // [P1] auto-switch to next mode
}

export const useTimerStore = create<TimerState>((set, get) => ({
  status: 'idle',
  mode: 'focus',
  duration: load().settings.focusDuration,
  endTimestamp: null,
  currentTodoId: null,
  sessionCount: load().sessionCount ?? 0,

  setDuration: (minutes) => {
    set({ duration: minutes })
    // Persist to settings
    const data = load()
    if (get().mode === 'focus') {
      data.settings.focusDuration = minutes
    } else if (get().mode === 'shortBreak') {
      data.settings.shortBreakDuration = minutes
    } else if (get().mode === 'longBreak') {
      data.settings.longBreakDuration = minutes
    }
    save(data)
  },

  start: (todoId) => {
    const { duration } = get()
    const endTimestamp = Date.now() + duration * 60 * 1000
    set({
      status: 'running',
      endTimestamp,
      currentTodoId: todoId ?? null,
    })
  },

  pause: () => {
    set({ status: 'paused' })
  },

  resume: () => {
    const state = get()
    if (state.status !== 'paused') return
    // Recalculate end timestamp from remaining time
    const remaining = state.endTimestamp ? state.endTimestamp - Date.now() : 0
    set({
      status: 'running',
      endTimestamp: Date.now() + remaining,
    })
  },

  giveUp: () => {
    const state = get()
    const data = load()

    // Record the abandoned pomodoro
    if (state.endTimestamp) {
      data.records.push({
        id: nanoid(),
        todoId: state.currentTodoId,
        startTime:
          state.endTimestamp - state.duration * 60 * 1000,
        endTime: Date.now(),
        duration: state.duration,
        completed: false,
      })
      save(data)
    }

    set({
      status: 'idle',
      endTimestamp: null,
      currentTodoId: null,
    })
  },

  finish: () => {
    const state = get()
    const data = load()

    // Only record completed pomodoros for focus sessions
    if (state.mode === 'focus') {
      const startTime = state.endTimestamp
        ? state.endTimestamp - state.duration * 60 * 1000
        : Date.now() - state.duration * 60 * 1000

      data.records.push({
        id: nanoid(),
        todoId: state.currentTodoId,
        startTime,
        endTime: Date.now(),
        duration: state.duration,
        completed: true,
      })

      // Increment pomodoro count on associated todo
      if (state.currentTodoId) {
        const todo = data.todos.find((t) => t.id === state.currentTodoId)
        if (todo) {
          todo.pomodoroCount += 1
        }
      }
    }

    // Update streak (any mode counts as activity)
    const today = new Date().toISOString().slice(0, 10)
    if (data.lastActiveDate === today) {
      // Already active today
    } else if (data.lastActiveDate === getYesterday(data.lastActiveDate || '')) {
      data.streak += 1
    } else {
      data.streak = 1
    }
    data.lastActiveDate = today

    save(data)

    set({
      status: 'finished',
      endTimestamp: null,
    })
  },

  reset: () => {
    set({
      status: 'idle',
      endTimestamp: null,
      currentTodoId: null,
    })
  },

  setMode: (mode) => {
    const data = load()
    set({
      mode,
      duration:
        mode === 'focus'
          ? data.settings.focusDuration
          : mode === 'shortBreak'
            ? data.settings.shortBreakDuration
            : data.settings.longBreakDuration,
    })
  },

  autoTransition: () => {
    const state = get()
    const data = load()
    let nextMode: TimerMode
    let newSessionCount = state.sessionCount

    if (state.mode === 'focus') {
      // Completed a focus session — increment counter
      newSessionCount = state.sessionCount + 1

      // Long break every N focus sessions
      if (newSessionCount % data.settings.longBreakInterval === 0) {
        nextMode = 'longBreak'
      } else {
        nextMode = 'shortBreak'
      }
    } else {
      // Completed a break — go back to focus
      nextMode = 'focus'
    }

    // Persist updated session count
    data.sessionCount = newSessionCount
    save(data)

    // Load correct duration for next mode
    const nextDuration =
      nextMode === 'focus'
        ? data.settings.focusDuration
        : nextMode === 'shortBreak'
          ? data.settings.shortBreakDuration
          : data.settings.longBreakDuration

    const endTimestamp = Date.now() + nextDuration * 60 * 1000

    set({
      mode: nextMode,
      duration: nextDuration,
      sessionCount: newSessionCount,
      status: 'running',
      endTimestamp,
      currentTodoId: null, // clear todo association for breaks
    })
  },
}))

function getYesterday(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}
