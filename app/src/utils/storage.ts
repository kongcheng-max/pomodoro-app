import type { AppData } from '../types'

const STORAGE_KEY = 'pomodoro_app_data'
const CURRENT_VERSION = 1

export function getDefaultData(): AppData {
  return {
    version: CURRENT_VERSION,
    todos: [],
    records: [],
    settings: {
      focusDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      longBreakInterval: 3,
      soundEnabled: true,
      theme: 'light',
      whiteNoiseEnabled: false,
      whiteNoiseType: 'white',
      whiteNoiseVolume: 0.3,
    },
    streak: 0,
    lastActiveDate: null,
    sessionCount: 0,
  }
}

function migrate(data: AppData): AppData {
  // Version migration hook for future data format changes
  // v1: initial version, no migration needed
  if (data.version < 1) {
    return getDefaultData()
  }
  return data
}

export function load(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return getDefaultData()
    const data = JSON.parse(raw) as AppData
    return migrate(data)
  } catch {
    return getDefaultData()
  }
}

export function save(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // localStorage full — silently fail, data stays in memory
  }
}
