import { useEffect, useRef, useState, useCallback } from 'react'
import { useTimerStore } from '../stores/timerStore'
import { load } from '../utils/storage'
import { playNotificationSound } from '../utils/sound'
import { sendNotification } from './useNotification'

export function useTimer() {
  const store = useTimerStore()
  const [display, setDisplay] = useState('25:00')
  const [remainingMs, setRemainingMs] = useState(0)
  const intervalRef = useRef<number | null>(null)
  const transitionRef = useRef<number | null>(null)
  const notifiedRef = useRef(false)

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const clearTransition = useCallback(() => {
    if (transitionRef.current !== null) {
      clearTimeout(transitionRef.current)
      transitionRef.current = null
    }
  }, [])

  // Main timer loop
  useEffect(() => {
    if (store.status !== 'running' || !store.endTimestamp) {
      clearTimer()

      if (store.status === 'idle') {
        const totalMs = store.duration * 60 * 1000
        setRemainingMs(totalMs)
        setDisplay(formatDisplay(totalMs))
        notifiedRef.current = false
        clearTransition()
      }

      if (store.status === 'paused' && store.endTimestamp) {
        const remaining = Math.max(0, store.endTimestamp - Date.now())
        setRemainingMs(remaining)
        setDisplay(formatDisplay(remaining))
      }

      if (store.status === 'finished') {
        setRemainingMs(0)
        setDisplay('00:00')
        // transitionRef is NOT cleared here — it's pending auto-switch
      }

      return
    }

    notifiedRef.current = false
    clearTransition()

    const tick = () => {
      const remaining = Math.max(0, store.endTimestamp! - Date.now())
      setRemainingMs(remaining)
      setDisplay(formatDisplay(remaining))

      if (remaining <= 0) {
        clearTimer()
        if (!notifiedRef.current) {
          notifiedRef.current = true
          // Play sound and notify
          if (load().settings.soundEnabled) {
            playNotificationSound()
          }
          // Mode-aware notification
          if (store.mode === 'focus') {
            sendNotification('🍅 专注完成！', '休息一下吧')
          } else {
            sendNotification('☕ 休息时间到！', '开始吧！')
          }
          store.finish()

          // Schedule auto-transition after 1.5s
          transitionRef.current = window.setTimeout(() => {
            store.autoTransition()
          }, 1500)
        }
      }
    }

    tick() // Immediate first tick
    intervalRef.current = window.setInterval(tick, 200)

    return () => {
      clearTimer()
      // Do NOT clear transitionRef here — the effect re-runs when
      // store.finish() changes status, and cleanup would kill the
      // autoTransition timeout scheduled inside tick(). Transition is
      // only cleared explicitly in the idle branch and running entry.
    }
  }, [store.status, store.endTimestamp, store.duration, clearTimer, clearTransition])

  // Update document title — mode-aware
  useEffect(() => {
    if (store.status === 'running') {
      const icon = store.mode === 'focus' ? '🍅' : '☕'
      document.title = `${icon} ${display} - 极简番茄`
    } else if (store.status === 'finished') {
      const msg = store.mode === 'focus' ? '🎉 专注完成！' : '☕ 休息结束'
      document.title = `${msg} - 极简番茄`
    } else {
      document.title = '极简番茄'
    }
  }, [display, store.status, store.mode])

  return {
    display,
    remainingMs,
    totalMs: store.duration * 60 * 1000,
    progress: store.duration > 0 ? remainingMs / (store.duration * 60 * 1000) : 1,
  }
}

function formatDisplay(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
