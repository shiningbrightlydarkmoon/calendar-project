export interface CalendarEvent {
  _id?: string
  title: string
  startDate: string
  endDate: string
  startTime?: string
  endTime?: string
  color?: string
  notes?: string
  isAllDay?: boolean
  userId: string
  createdAt?: string
  updatedAt?: string
  reminders?: number[]
  // hasReminders?: boolean
}

export interface EventForm {
  title: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  color: string
  notes: string
  isAllDay: boolean
  reminders: number[]
}

// 提醒选项配置
export interface ReminderOption {
  label: string
  value: number // 提前分钟数
}



export interface MonthDay {
  date: any
  day: number
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
}

export interface WeekDay {
  fullDate: any
  weekday: string
  date: number
}