/** 番茄记录 */
export interface PomodoroRecord {
  id: string
  todoId: string | null // 关联的待办ID（null=通用番茄）
  startTime: number // 开始时间戳
  endTime: number // 结束时间戳
  duration: number // 设定时长（分钟）
  completed: boolean // true=自然完成, false=被放弃
}

/** 待办事项 */
export interface Todo {
  id: string
  title: string
  completed: boolean
  pomodoroCount: number // 已投入番茄数
  createdAt: number // 创建时间戳
  completedAt: number | null
  order: number // 排序序号
  dateKey: string // 所属日期 "2026-06-26"
}

/** 白噪音类型 */
export type NoiseType = 'white' | 'pink' | 'brown'

/** 应用设置 */
export interface AppSettings {
  focusDuration: number // 专注时长（分钟）, 默认 25
  shortBreakDuration: number // 短休息时长, 默认 5
  longBreakDuration: number // 长休息时长, 默认 15 [P1]
  longBreakInterval: number // 几轮后长休息, 默认 3 [P1]
  soundEnabled: boolean // 提示音开关
  theme: 'light' | 'dark' // 主题
  whiteNoiseEnabled: boolean // 白噪音开关 [P1]
  whiteNoiseType: NoiseType // 白噪音类型 [P1]
  whiteNoiseVolume: number // 白噪音音量 0-1 [P1]
}

/** localStorage 顶层结构 */
export interface AppData {
  version: number // 数据版本号 (初始 1)
  todos: Todo[]
  records: PomodoroRecord[]
  settings: AppSettings
  streak: number // 连续打卡天数 [P1]
  lastActiveDate: string | null // 最后活跃日期
  sessionCount: number // 当前周期内完成的专注次数 [P1]
}

/** 番茄钟状态 */
export type TimerStatus = 'idle' | 'running' | 'paused' | 'finished'

/** 番茄钟类型 */
export type TimerMode = 'focus' | 'shortBreak' | 'longBreak'
