<template>
  <view class="calendar-container">
    <!-- 自定义导航栏 -->
    <view class="custom-navbar">
      <view class="navbar-left">
        <text class="navbar-title">{{ calendarStore.pageTitle }}</text>
      </view>
      <view class="navbar-right">
        <button class="add-btn" @click="handleAddEvent">
          <text class="btn-text">+ 添加</text>
        </button>
      </view>
    </view>

    <!-- 视图切换和日期导航 -->
    <view class="calendar-header">
      <view class="view-switcher">
        <button 
          class="view-btn" 
          :class="{ active: calendarStore.currentView === 'month' }"
          @click="handleSwitchView('month')"
        >
          月
        </button>
        <button 
          class="view-btn" 
          :class="{ active: calendarStore.currentView === 'week' }"
          @click="handleSwitchView('week')"
        >
          周
        </button>
        <button 
          class="view-btn" 
          :class="{ active: calendarStore.currentView === 'day' }"
          @click="handleSwitchView('day')"
        >
          日
        </button>
      </view>
      
      <view class="date-navigation">
        <button class="nav-btn" @click="handlePreviousPeriod">
          ‹
        </button>
        <text class="current-date">{{ calendarStore.displayDate }}</text>
        <button class="nav-btn" @click="handleNextPeriod">
          ›
        </button>
        <button class="today-btn" @click="handleGoToToday">
          今天
        </button>
      </view>
    </view>

    <!-- 日历主体 -->
    <view class="calendar-body">
      <!-- 月视图 -->
      <view v-if="calendarStore.currentView === 'month'" class="month-view">
        <view class="weekdays-header">
          <view class="weekday" v-for="day in weekdays" :key="day">
            {{ day }}
          </view>
        </view>
        
        <view class="month-grid">
          <view 
            v-for="(day, index) in calendarStore.monthDays" 
            :key="index"
            class="calendar-day"
            :class="{
              'not-current-month': !day.isCurrentMonth,
              'today': day.isToday,
              'selected': day.isSelected
            }"
            @click="handleSelectDate(day.date)"
          >
            <view class="day-content-wrapper">
              <text class="day-number">{{ day.day }}</text>
            </view>
            
            <text class="lunar-day">{{ day.lunarDay }}</text>
            
            <!-- 优化：使用预计算的事件数据 -->
            <view class="event-dots">
              <view 
                v-for="event in monthDayEvents[day.dateStr]"
                :key="event._id"
                class="event-dot"
                :style="{ backgroundColor: event.color }"
              ></view>
            </view>
          </view>
        </view>
      </view>

      <!-- 周视图 -->
      <view v-if="calendarStore.currentView === 'week'" class="week-view">
        <view class="week-grid-container">
          <view class="week-header">
            <view class="time-header-cell"></view>
            <view 
              v-for="day in calendarStore.weekDays" 
              :key="day.fullDate.toString()"
              class="day-header-cell"
              @click="handleSelectDate(day.fullDate)"
            >
              <text class="weekday">{{ day.weekday }}</text>
              <text class="date">{{ day.date }}</text>
            </view>
          </view>
          
          <view class="week-content">
            <view class="time-column" ref="timeColumnRef">
              <view 
                v-for="time in timeSlots" 
                :key="time"
                class="time-slot"
              >
                <text class="time-label">{{ time }}</text>
              </view>
            </view>
            
            <view class="days-content" ref="daysContentRef">
              <view 
                v-for="day in calendarStore.weekDays" 
                :key="day.fullDate.toString()"
                class="day-column"
              >
                <view class="day-content-column">
                  <view 
                    v-for="time in timeSlots" 
                    :key="time"
                    class="time-content-slot"
                    @click="handleAddEventAtTime(day.fullDate, time)"
                  >
                    <view class="events-container">
                      <view 
                        v-for="(event, index) in getLimitedEventsForTimeSlot(day.fullDate, time)" 
                        :key="event._id"
                        class="week-event"
                        :style="{ backgroundColor: event.color }"
                        :class="{ 'more-events': index === 1 && hasMoreEvents(day.fullDate, time) }"
                        @click.stop="index === 1 && hasMoreEvents(day.fullDate, time) ? handleViewMoreEvents(day.fullDate, time) : handleViewEvent(event)"
                      >
                        <text class="event-title">
                          {{ index === 1 && hasMoreEvents(day.fullDate, time) ? '...' : getShortTitle(event.title) }}
                        </text>
                        <!-- 添加提醒图标 -->
                        <view v-if="event.reminders && event.reminders.length > 0" class="reminder-icon">
                          🔔
                        </view>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 日视图 -->
      <view v-if="calendarStore.currentView === 'day'" class="day-view">
        <view class="day-header">
          <text class="date">{{ calendarStore.selectedDate.format('YYYY年MM月DD日') }}</text>
          <text class="weekday">{{ calendarStore.selectedDate.format('dddd') }}</text>
        </view>
        
        <view class="day-time-grid">
          <view class="all-day-header" v-if="calendarStore.getLongEventsForDay(calendarStore.selectedDate).length > 0">
            <view class="all-day-label">全天/跨天</view>
            <view class="all-day-list">
              <view 
                v-for="event in calendarStore.getLongEventsForDay(calendarStore.selectedDate)" 
                :key="event._id"
                class="long-event-item"
                :style="{ backgroundColor: event.color + '20', borderLeft: '8rpx solid ' + event.color }"
                @click.stop="handleViewEvent(event)" 
              >
                <text class="long-event-title">{{ event.title }}</text>
                <text class="long-event-time">{{ event.startDate }} 至 {{ event.endDate }}</text>
              </view>
            </view>
          </view>
          <view 
            v-for="time in timeSlots" 
            :key="time"
            class="time-row"
          >
            <view class="time-label">{{ time }}</view>
            <view 
              class="time-slot-content"
              @click="handleAddEventAtTime(calendarStore.selectedDate, time)"
            >
              <view class="day-events-container">
                <view 
                  v-for="event in getEventsForTimeSlot(calendarStore.selectedDate, time)" 
                  :key="event._id"
                  class="day-event"
                  :style="{ backgroundColor: event.color }"
                  @click.stop="handleViewEvent(event)"
                >
                  <text class="event-title">{{ event.title }}</text>
                  <view class="event-time-and-reminder">
                    <text class="event-time">{{ event.startTime }} - {{ event.endTime }}</text>
                    <!-- 添加提醒图标 -->
                    <view v-if="event.reminders && event.reminders.length > 0" class="day-reminder-icon">
                      🔔
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 添加/编辑日程模态框 -->
    <view v-if="showEventModal" class="modal-mask">
      <view class="modal-content">
        <view class="modal-header">
          <text class="modal-title">{{ isEditing ? '编辑日程' : '添加日程' }}</text>
          <button class="close-btn" @click="closeEventModal">×</button>
        </view>
        
        <view class="event-form">
          <view class="form-item">
            <text class="form-label">标题</text>
            <input 
              v-model="eventForm.title" 
              class="form-input" 
              placeholder="请输入日程标题"
              :focus="autoFocusTitle"
            />
          </view>
          
          <view class="time-picker-group">
            <view class="form-item">
              <text class="form-label">开始时间</text>
              <view class="datetime-row">
                <picker 
                  mode="date" 
                  :value="eventForm.startDate" 
                  @change="(e) => handleDateChange('startDate', e.detail.value)"
                  class="date-picker"
                >
                  <view class="form-input picker-display">{{ eventForm.startDate || '选择日期' }}</view>
                </picker>
                <picker 
                  mode="time" 
                  :value="eventForm.startTime" 
                  @change="(e) => handleTimeChange('startTime', e.detail.value)"
                  class="time-picker"
                >
                  <view class="form-input picker-display">{{ eventForm.startTime || '选择时间' }}</view>
                </picker>
              </view>
            </view>
            
            <view class="form-item">
              <text class="form-label">结束时间</text>
              <view class="datetime-row">
                <picker 
                  mode="date" 
                  :value="eventForm.endDate" 
                  @change="(e) => handleDateChange('endDate', e.detail.value)"
                  class="date-picker"
                >
                  <view class="form-input picker-display">{{ eventForm.endDate || '选择日期' }}</view>
                </picker>
                <picker 
                  mode="time" 
                  :value="eventForm.endTime" 
                  @change="(e) => handleTimeChange('endTime', e.detail.value)"
                  class="time-picker"
                >
                  <view class="form-input picker-display">{{ eventForm.endTime || '选择时间' }}</view>
                </picker>
              </view>
            </view>
          </view>
          
          <view class="form-item">
            <text class="form-label">颜色</text>
            <view class="color-picker">
              <view 
                v-for="color in calendarStore.colorOptions" 
                :key="color"
                class="color-option"
                :style="{ backgroundColor: color }"
                :class="{ selected: eventForm.color === color }"
                @click="eventForm.color = color"
              ></view>
            </view>
          </view>
          
          <!-- 提醒选项 -->
          <view class="form-item">
            <text class="form-label">提醒时间</text>
            <view class="reminder-picker">
              <view 
                v-for="option in calendarStore.reminderOptions" 
                :key="option.value"
                class="reminder-option"
                :class="{ selected: eventForm.reminders.includes(option.value) }"
                @click="toggleReminder(option.value)"
              >
                <view class="reminder-checkbox">
                  <text v-if="eventForm.reminders.includes(option.value)" class="reminder-check">✓</text>
                </view>
                <text class="reminder-label">{{ option.label }}</text>
              </view>
              <!-- 无提醒选项 -->
              <view 
                class="reminder-option"
                :class="{ selected: eventForm.reminders.length === 0 }"
                @click="clearReminders"
              >
                <view class="reminder-checkbox">
                  <text v-if="eventForm.reminders.length === 0" class="reminder-check">✓</text>
                </view>
                <text class="reminder-label">无提醒</text>
              </view>
            </view>
          </view>
          
          <!-- 显示已设置的提醒 -->
          <view v-if="eventForm.reminders.length > 0" class="form-item reminders-display">
            <text class="form-label">已设置提醒:</text>
            <view class="reminders-list">
              <view 
                v-for="(reminder, index) in sortedReminders" 
                :key="index"
                class="reminder-badge"
              >
                <text class="reminder-text">{{ getReminderLabel(reminder) }}</text>
              </view>
            </view>
          </view>
          
          <view class="form-item">
            <text class="form-label">备注</text>
            <textarea 
              v-model="eventForm.notes" 
              class="form-textarea" 
              placeholder="请输入备注信息" 
            />
          </view>
        </view>
        
        <view class="modal-actions">
          <button class="btn btn-cancel" @click="closeEventModal">取消</button>
          <button class="btn btn-delete" v-if="isEditing" @click="handleDeleteEvent">删除</button>
          <button class="btn btn-confirm" @click="handleSaveEvent">确认</button>
        </view>
      </view>
    </view>

    <!-- 加载提示 -->
    <view v-if="calendarStore.loading" class="loading-mask">
      <view class="loading-content">
        <text class="loading-text">加载中...</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, nextTick, computed } from 'vue'
import moment from 'moment'
import { useCalendarStore } from '@/stores/calendar.js'
import type { CalendarEvent, EventForm } from '@/types'
import reminderService from '@/utils/reminder.js'

const calendarStore = useCalendarStore()

const showEventModal = ref(false)
const isEditing = ref(false)
const editingEventId = ref<string | null>(null)
const autoFocusTitle = ref(false)

// 添加滚动同步相关的ref
const timeColumnRef = ref<HTMLElement | null>(null)
const daysContentRef = ref<HTMLElement | null>(null)

// 事件表单数据
const eventForm = reactive<EventForm>({
  title: '',
  startDate: moment().format('YYYY-MM-DD'),
  startTime: '09:00',
  endDate: moment().format('YYYY-MM-DD'),
  endTime: '10:00',
  color: '#2979ff',
  notes: '',
  isAllDay: false,
  reminders: []
})

const weekdays = ['日', '一', '二', '三', '四', '五', '六']
const timeSlots = Array.from({ length: 24 }, (_, i) => 
  `${i.toString().padStart(2, '0')}:00`
)

// ==================== 计算属性 ====================

// 预计算月视图每天的事件
const monthDayEvents = computed(() => {
  if (calendarStore.currentView !== 'month') return {}
  
  const eventsMap: Record<string, CalendarEvent[]> = {}
  
  calendarStore.monthDays.forEach(day => {
    const dateStr = day.dateStr
    if (dateStr) {
      const dayEvents = calendarStore.getTimeEventsForDay(day.date).slice(0, 3)
      eventsMap[dateStr] = dayEvents
    }
  })
  
  return eventsMap
})

// 排序后的提醒列表
const sortedReminders = computed(() => {
  return [...eventForm.reminders].sort((a, b) => a - b)
})

// ==================== 提醒相关方法 ====================

// 切换提醒选项
const toggleReminder = (value: number) => {
  const index = eventForm.reminders.indexOf(value)
  if (index === -1) {
    // 添加提醒
    eventForm.reminders.push(value)
    // 按时间顺序排序
    eventForm.reminders.sort((a, b) => a - b)
  } else {
    // 移除提醒
    eventForm.reminders.splice(index, 1)
  }
}

// 清除所有提醒
const clearReminders = () => {
  eventForm.reminders = []
}

// 获取提醒标签
const getReminderLabel = (minutes: number): string => {
  const option = calendarStore.reminderOptions.find(opt => opt.value === minutes)
  return option ? option.label : `${minutes}分钟前`
}

// ==================== 视图切换方法 ====================

const handleSwitchView = (view: string) => {
  const oldView = calendarStore.currentView
  calendarStore.switchView(view)
  
  if (oldView !== view) {
    setTimeout(() => {
      calendarStore.loadEventsSilently()
    }, 300)
  }
}

const handlePreviousPeriod = () => {
  calendarStore.previousPeriod()
  
  setTimeout(() => {
    calendarStore.loadEventsSilently()
  }, 200)
}

const handleNextPeriod = () => {
  calendarStore.nextPeriod()
  
  setTimeout(() => {
    calendarStore.loadEventsSilently()
  }, 200)
}

const handleGoToToday = () => {
  calendarStore.goToToday()
  
  setTimeout(() => {
    calendarStore.loadEventsSilently()
  }, 200)
}

const handleSelectDate = (date: any) => {
  calendarStore.selectDate(date)
  
  setTimeout(() => {
    calendarStore.loadEventsSilently()
  }, 200)
}

// ==================== 事件处理方法 ====================

// 滚动同步方法
const syncScroll = () => {
  const timeColumn = timeColumnRef.value
  const daysContent = daysContentRef.value
  
  if (timeColumn && daysContent) {
    daysContent.addEventListener('scroll', () => {
      timeColumn.scrollTop = daysContent.scrollTop
    })
    
    timeColumn.addEventListener('scroll', () => {
      daysContent.scrollTop = timeColumn.scrollTop
    })
  }
}

// 周视图方法
const getLimitedEventsForTimeSlot = (date: any, time: string) => {
  const events = calendarStore.getEventsForTimeSlot(date, time)
  return events.slice(0, 2)
}

const hasMoreEvents = (date: any, time: string) => {
  const events = calendarStore.getEventsForTimeSlot(date, time)
  return events.length > 2
}

const getShortTitle = (title: string) => {
  if (title.length <= 6) {
    return title
  }
  return title.substring(0, 6) + '...'
}

const handleViewMoreEvents = (date: any, time: string) => {
  const events = calendarStore.getEventsForTimeSlot(date, time)
  uni.showActionSheet({
    title: `${moment(date).format('MM月DD日')} ${time} 的事件`,
    itemList: events.map(event => event.title),
    success: (res) => {
      const selectedEvent = events[res.tapIndex]
      handleViewEvent(selectedEvent)
    }
  })
}

// 日视图方法
const getEventsForTimeSlot = (date: any, time: string) => {
  return calendarStore.getEventsForTimeSlot(date, time)
}

// ==================== 事件表单处理 ====================

const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
  eventForm[field] = value
  if (field === 'startDate' && eventForm.startDate > eventForm.endDate) {
    eventForm.endDate = value
  }
}

const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
  eventForm[field] = value
  if (field === 'startTime' && 
      eventForm.startDate === eventForm.endDate && 
      eventForm.startTime >= eventForm.endTime) {
    const [hours, minutes] = value.split(':').map(Number)
    const endMoment = new Date()
    endMoment.setHours(hours + 1, minutes)
    eventForm.endTime = `${endMoment.getHours().toString().padStart(2, '0')}:${endMoment.getMinutes().toString().padStart(2, '0')}`
  }
}

const handleAddEvent = () => {
  resetEventForm()
  showEventModal.value = true
  isEditing.value = false
  editingEventId.value = null
  nextTick(() => {
    autoFocusTitle.value = true
  })
}

const handleAddEventAtTime = (date: any, time: string) => {
  resetEventForm()
  const dateStr = moment(date).format('YYYY-MM-DD')
  eventForm.startDate = dateStr
  eventForm.endDate = dateStr
  eventForm.startTime = time
  const endTime = moment(time, 'HH:mm').add(1, 'hour').format('HH:mm')
  eventForm.endTime = endTime
  showEventModal.value = true
  isEditing.value = false
  nextTick(() => {
    autoFocusTitle.value = true
  })
}

const handleViewEvent = (event: CalendarEvent) => {
  isEditing.value = true
  editingEventId.value = event._id!
  eventForm.title = event.title
  eventForm.startDate = event.startDate
  eventForm.endDate = event.endDate
  eventForm.startTime = event.startTime || '09:00'
  eventForm.endTime = event.endTime || '10:00'
  eventForm.color = event.color || '#2979ff'
  eventForm.notes = event.notes || ''
  eventForm.reminders = event.reminders || []
  
  showEventModal.value = true
  nextTick(() => {
    autoFocusTitle.value = true
  })
}

const resetEventForm = () => {
  eventForm.title = ''
  eventForm.startDate = moment(calendarStore.selectedDate).format('YYYY-MM-DD')
  eventForm.startTime = '09:00'
  eventForm.endDate = moment(calendarStore.selectedDate).format('YYYY-MM-DD')
  eventForm.endTime = '10:00'
  eventForm.color = '#2979ff'
  eventForm.notes = ''
  eventForm.reminders = []
  
  autoFocusTitle.value = false
}

const handleSaveEvent = async () => {
  if (!eventForm.title.trim()) {
    uni.showToast({
      title: '请输入日程标题',
      icon: 'none'
    })
    return
  }
  
  if (eventForm.startDate > eventForm.endDate) {
    uni.showToast({
      title: '开始日期不能晚于结束日期',
      icon: 'none'
    })
    return
  }
  
  if (eventForm.startDate === eventForm.endDate && eventForm.startTime >= eventForm.endTime) {
    uni.showToast({
      title: '开始时间不能晚于或等于结束时间',
      icon: 'none'
    })
    return
  }
  
  try {
    if (isEditing.value && editingEventId.value) {
      await calendarStore.updateEvent(editingEventId.value, eventForm)
      uni.showToast({
        title: '日程已更新',
        icon: 'success'
      })
    } else {
      await calendarStore.createEvent(eventForm)
      uni.showToast({
        title: '日程已添加',
        icon: 'success'
      })
    }
    closeEventModal()
  } catch (error: any) {
    console.error('保存日程失败:', error)
    uni.showToast({
      title: error.message || '保存失败，请重试',
      icon: 'none'
    })
  }
}

const handleDeleteEvent = async () => {
  if (!editingEventId.value) return
  
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这个日程吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await calendarStore.deleteEvent(editingEventId.value!)
          uni.showToast({
            title: '日程已删除',
            icon: 'success'
          })
          closeEventModal()
        } catch (error: any) {
          console.error('删除日程失败:', error)
          uni.showToast({
            title: error.message || '删除失败，请重试',
            icon: 'none'
          })
        }
      }
    }
  })
}

const closeEventModal = () => {
  showEventModal.value = false
  resetEventForm()
  isEditing.value = false
  editingEventId.value = null
}

// ==================== 生命周期 ====================

onMounted(() => {
  console.log('🚀 日历应用启动')
  
  // 测试提醒服务
  console.log('🔔 提醒服务状态:', reminderService.initialized ? '已初始化' : '未初始化')
  
  // 初始加载数据
  calendarStore.loadEvents()
  
  // 延迟启动静默刷新
  setTimeout(() => {
    calendarStore.startSilentRefresh()
  }, 3000)
  
  // 设置滚动同步
  nextTick(() => {
    setTimeout(syncScroll, 100)
  })
  
  // 监听应用状态变化
  // #ifdef H5
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      console.log('📱 页面可见，静默刷新数据')
      setTimeout(() => {
        calendarStore.loadEventsSilently()
      }, 1000)
    }
  })
  // #endif
  
  // 检查通知点击记录
  setTimeout(() => {
    try {
      const notification = uni.getStorageSync('lastClickedNotification')
      if (notification) {
        console.log('发现通知点击记录:', notification)
        uni.removeStorageSync('lastClickedNotification')
      }
    } catch (error) {
      console.error('检查通知记录失败:', error)
    }
  }, 1000)
})
</script>

<style scoped>
/* 日历容器样式 */
.calendar-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.custom-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #e4e7ed;
}

.navbar-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #303133;
}

.add-btn {
  background-color: #2979ff;
  color: white;
  border: none;
  border-radius: 10rpx;
  padding: 15rpx 25rpx;
  font-size: 28rpx;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #e4e7ed;
  flex-wrap: wrap;
  gap: 15rpx;
}

/* 视图切换器 */
.view-switcher {
  display: flex;
  gap: 10rpx;
}

.view-btn {
  padding: 15rpx 25rpx;
  border: 1rpx solid #dcdfe6;
  border-radius: 8rpx;
  background-color: #fff;
  font-size: 28rpx;
}

.view-btn.active {
  background-color: #2979ff;
  color: white;
  border-color: #2979ff;
}

/* 日期导航 */
.date-navigation {
  display: flex;
  align-items: center;
  gap: 15rpx;
}

.nav-btn {
  width: 60rpx;
  height: 60rpx;
  border: 1rpx solid #dcdfe6;
  border-radius: 50%;
  background-color: #fff;
  font-size: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.today-btn {
  padding: 15rpx 25rpx;
  border: 1rpx solid #2979ff;
  border-radius: 8rpx;
  background-color: #fff;
  color: #2979ff;
  font-size: 28rpx;
}

.current-date {
  font-size: 32rpx;
  font-weight: bold;
  min-width: 280rpx;
  text-align: center;
  padding: 0 10rpx;
}

.calendar-body {
  flex: 1;
  overflow: hidden;
}

/* 月视图 */
.month-view {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.weekdays-header {
  display: flex;
  background-color: #f8f9fa;
  border-bottom: 1rpx solid #e4e7ed;
}

.weekday {
  flex: 1;
  text-align: center;
  padding: 20rpx 0;
  font-size: 28rpx;
  color: #606266;
}

.month-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 1fr;
}

.calendar-day {
  height: 120rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  border-bottom: 1rpx solid #f2f2f2;
}

.day-content-wrapper {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.today .day-content-wrapper {
  background-color: #2979ff; 
}

.today .day-number {
  color: #ffffff;
  font-weight: bold;
}

.selected:not(.today) .day-content-wrapper {
  border: 2rpx solid #2979ff;
}

.day-number {
  font-size: 28rpx;
  font-weight: bold;
}

.lunar-day {
  font-size: 20rpx;
  color: #999;
  margin-top: 4rpx;
}

.today .lunar-day {
  color: #2979ff;
}

.event-dots {
  display: flex;
  justify-content: center;
  gap: 4rpx;
  margin-top: 6rpx;
}

.event-dot {
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
}

/* 周视图 */
.week-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.week-grid-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.week-header {
  display: flex;
  background-color: #f8f9fa;
  border-bottom: 1rpx solid #e4e7ed;
  height: 120rpx;
  flex-shrink: 0;
}

.time-header-cell {
  width: 120rpx;
  border-right: 1rpx solid #e4e7ed;
  flex-shrink: 0;
}

.day-header-cell {
  flex: 1;
  text-align: center;
  padding: 20rpx 0;
  border-right: 1rpx solid #e4e7ed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 0;
}

.day-header-cell:last-child {
  border-right: none;
}

.day-header-cell .weekday {
  font-size: 24rpx;
  color: #909399;
  margin-bottom: 8rpx;
}

.day-header-cell .date {
  font-size: 32rpx;
  font-weight: bold;
  color: #303133;
}

.week-content {
  flex: 1;
  display: flex;
  overflow: hidden;
  min-height: 0;
  position: relative;
}

.time-column {
  width: 120rpx;
  background-color: #f8f9fa;
  border-right: 1rpx solid #e4e7ed;
  overflow-y: auto;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.time-column::-webkit-scrollbar {
  display: none;
}

.time-slot {
  height: 80rpx;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 10rpx;
  border-bottom: 1rpx solid #e4e7ed;
  box-sizing: border-box;
  flex-shrink: 0;
}

.time-label {
  font-size: 24rpx;
  color: #909399;
  line-height: 1;
}

.days-content {
  flex: 1;
  display: flex;
  overflow: auto;
  min-width: 0;
  overflow-x: auto;
  overflow-y: auto;
}

.day-column {
  flex: 1;
  border-right: 1rpx solid #e4e7ed;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: calc(80rpx * 24);
}

.day-column:last-child {
  border-right: none;
}

.day-content-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.time-content-slot {
  height: 80rpx;
  border-bottom: 1rpx solid #e4e7ed;
  position: relative;
  padding: 2rpx;
  box-sizing: border-box;
  flex-shrink: 0;
}

.time-content-slot:last-child {
  border-bottom: none;
}

.events-container {
  position: absolute;
  left: 2rpx;
  right: 2rpx;
  top: 2rpx;
  bottom: 2rpx;
  display: flex;
  flex-direction: column;
  gap: 2rpx;
  padding: 1rpx;
  box-sizing: border-box;
  overflow: hidden;
}

.week-event {
  flex: 1;
  padding: 4rpx 6rpx;
  border-radius: 3rpx;
  color: #fff;
  font-size: 18rpx;
  overflow: hidden;
  box-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 0;
  max-height: 50%;
}

.week-event.more-events {
  background-color: #909399 !important;
  justify-content: center;
}

.week-event .event-title {
  font-weight: bold;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.reminder-icon {
  font-size: 18rpx;
  opacity: 0.9;
  margin-left: 4rpx;
}

/* 日视图 */
.day-view {
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}

.day-header {
  padding: 30rpx;
  text-align: center;
  border-bottom: 1rpx solid #e4e7ed;
  background-color: #f8f9fa;
  flex-shrink: 0;
}

.day-header .date {
  display: block;
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
  color: #303133;
}

.day-header .weekday {
  display: block;
  font-size: 28rpx;
  color: #606266;
}

.all-day-header {
  background-color: #f8f9fa;
  border-bottom: 1rpx solid #e4e7ed;
  display: flex;
  padding: 0;
  min-height: 80rpx;
}

.all-day-label {
  font-size: 22rpx;
  color: #909399;
  width: 120rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0; 
  border-right: 1rpx solid #e4e7ed;
  background-color: #f8f9fa;
}

.all-day-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  padding: 10rpx 15rpx;
  background-color: #fff;
}

.long-event-item {
  padding: 10rpx 16rpx;
  border-radius: 4rpx;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
}

.long-event-title {
  font-size: 26rpx;
  font-weight: bold;
  color: #303133;
  line-height: 1.4;
}

.long-event-time {
  font-size: 20rpx;
  color: #606266;
  margin-top: 4rpx;
}

.day-time-grid {
  flex: 1;
  overflow-y: auto;
}

.time-row {
  display: flex;
  border-bottom: 1rpx solid #e4e7ed;
  min-height: 120rpx;
  padding: 8rpx 0;
}

.time-label {
  width: 120rpx;
  padding: 10rpx;
  text-align: center;
  font-size: 24rpx;
  color: #909399;
  background-color: #f8f9fa;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-shrink: 0;
}

.time-slot-content {
  flex: 1;
  padding: 0 10rpx;
  background-color: #fff;
  min-height: 100rpx;
}

.day-events-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
  align-items: flex-start;
}

.day-event {
  flex-shrink: 0;
  width: 180rpx;
  padding: 12rpx 16rpx;
  border-radius: 8rpx;
  color: #fff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 60rpx;
  border-left: 4rpx solid rgba(255, 255, 255, 0.3);
}

.day-event .event-title {
  font-size: 24rpx;
  font-weight: bold;
  margin-bottom: 4rpx;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.event-time-and-reminder {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4rpx;
}

.day-event .event-time {
  font-size: 20rpx;
  opacity: 0.9;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.day-reminder-icon {
  font-size: 20rpx;
  opacity: 0.9;
}

/* 模态框样式 */
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-content {
  background-color: #fff;
  border-radius: 20rpx;
  width: 90%;
  max-height: 80%;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #e4e7ed;
}

.modal-title {
  font-size: 32rpx;
  font-weight: bold;
}

.close-btn {
  background: none;
  border: none;
  font-size: 40rpx;
  color: #909399;
}

.event-form {
  padding: 30rpx;
}

.form-item {
  margin-bottom: 30rpx;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #606266;
  margin-bottom: 15rpx;
}

.form-input {
  border: 1rpx solid #dcdfe6;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 28rpx;
  width: 100%;
  box-sizing: border-box;
  background-color: #fff;
  min-height: 80rpx;
  display: flex;
  align-items: center;
}

input.form-input:focus {
  border-color: #2979ff;
  outline: none;
}

.picker-display {
  display: flex;
  align-items: center;
  color: #303133;
  background-color: #fff;
}

.form-textarea {
  border: 1rpx solid #dcdfe6;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 28rpx;
  width: 100%;
  height: 200rpx;
  box-sizing: border-box;
  background-color: #fff;
}

.datetime-row {
  display: flex;
  gap: 20rpx;
}

.date-picker {
  flex: 2;
}

.time-picker {
  flex: 1;
}

/* 颜色选择器 */
.color-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.color-option {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  border: 4rpx solid transparent;
}

.color-option.selected {
  border-color: #2979ff;
}

/* 提醒选择器样式 */
.reminder-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.reminder-option {
  display: flex;
  align-items: center;
  padding: 12rpx 20rpx;
  border: 1rpx solid #dcdfe6;
  border-radius: 8rpx;
  background-color: #fff;
  min-width: 140rpx;
  transition: all 0.2s;
}

.reminder-option:hover {
  border-color: #2979ff;
  transform: translateY(-2rpx);
}

.reminder-option.selected {
  border-color: #2979ff;
  background-color: rgba(41, 121, 255, 0.1);
}

.reminder-checkbox {
  width: 32rpx;
  height: 32rpx;
  border: 1rpx solid #dcdfe6;
  border-radius: 4rpx;
  margin-right: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reminder-option.selected .reminder-checkbox {
  border-color: #2979ff;
  background-color: #2979ff;
}

.reminder-check {
  color: #fff;
  font-size: 24rpx;
  font-weight: bold;
}

.reminder-label {
  font-size: 24rpx;
  color: #303133;
}

/* 已设置提醒显示 */
.reminders-display {
  background-color: #f8f9fa;
  padding: 16rpx;
  border-radius: 8rpx;
  border: 1rpx solid #e4e7ed;
}

.reminders-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  margin-top: 10rpx;
}

.reminder-badge {
  background-color: #2979ff;
  color: white;
  padding: 6rpx 12rpx;
  border-radius: 20rpx;
  font-size: 20rpx;
}

.reminder-text {
  font-weight: bold;
}

/* 按钮样式 */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
  padding: 30rpx;
  border-top: 1rpx solid #e4e7ed;
}

.btn {
  padding: 20rpx 40rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
  border: none;
}

.btn-cancel {
  background-color: #f4f4f5;
  color: #606266;
}

.btn-delete {
  background-color: #f56c6c;
  color: white;
}

.btn-confirm {
  background-color: #2979ff;
  color: white;
}

/* 加载提示 */
.loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-content {
  background-color: white;
  padding: 40rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.loading-text {
  font-size: 28rpx;
  color: #606266;
}
</style>