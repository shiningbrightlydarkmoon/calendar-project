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
          @click="calendarStore.switchView('month')"
        >
          月
        </button>
        <button 
          class="view-btn" 
          :class="{ active: calendarStore.currentView === 'week' }"
          @click="calendarStore.switchView('week')"
        >
          周
        </button>
        <button 
          class="view-btn" 
          :class="{ active: calendarStore.currentView === 'day' }"
          @click="calendarStore.switchView('day')"
        >
          日
        </button>
      </view>
      
      <view class="date-navigation">
        <button class="nav-btn" @click="calendarStore.previousPeriod">
          ‹
        </button>
        <text class="current-date">{{ calendarStore.displayDate }}</text>
        <button class="nav-btn" @click="calendarStore.nextPeriod">
          ›
        </button>
        <button class="today-btn" @click="calendarStore.goToToday">
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
            @click="calendarStore.selectDate(day.date)"
          >
            <text class="day-number">{{ day.day }}</text>
			<text class="lunar-day">{{ day.lunarDay }}</text>
            <view class="event-dots">
                <view 
                  v-for="event in calendarStore.getTimeEventsForDay(day.date).slice(0, 3)"
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
              @click="calendarStore.selectDate(day.fullDate)"
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
                  <text class="event-time">{{ event.startTime }} - {{ event.endTime }}</text>
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
import { ref, reactive, onMounted, watch, nextTick } from 'vue'
import moment from 'moment'
import { useCalendarStore } from '@/stores/calendar.js'
import type { CalendarEvent, EventForm } from '@/types'

const calendarStore = useCalendarStore()

const showEventModal = ref(false)
const isEditing = ref(false)
const editingEventId = ref<string | null>(null)
const autoFocusTitle = ref(false)

// 添加滚动同步相关的ref
const timeColumnRef = ref<HTMLElement | null>(null)
const daysContentRef = ref<HTMLElement | null>(null)

const eventForm = reactive<EventForm>({
  title: '',
  startDate: moment().format('YYYY-MM-DD'),
  startTime: '09:00',
  endDate: moment().format('YYYY-MM-DD'),
  endTime: '10:00',
  color: '#2979ff',
  notes: '',
  isAllDay: false
})

const weekdays = ['日', '一', '二', '三', '四', '五', '六']
const timeSlots = Array.from({ length: 24 }, (_, i) => 
  `${i.toString().padStart(2, '0')}:00`
)

// 滚动同步方法
const syncScroll = () => {
  const timeColumn = timeColumnRef.value
  const daysContent = daysContentRef.value
  
  if (timeColumn && daysContent) {
    // 监听daysContent的滚动，同步到timeColumn
    daysContent.addEventListener('scroll', () => {
      timeColumn.scrollTop = daysContent.scrollTop
    })
    
    // 监听timeColumn的滚动，同步到daysContent（理论上不应该滚动，但为了保险）
    timeColumn.addEventListener('scroll', () => {
      daysContent.scrollTop = timeColumn.scrollTop
    })
  }
}

// 周视图方法
const getLimitedEventsForTimeSlot = (date: any, time: string) => {
  const events = calendarStore.getEventsForDayAndTime(date, time)
  return events.slice(0, 2)
}

const hasMoreEvents = (date: any, time: string) => {
  const events = calendarStore.getEventsForDayAndTime(date, time)
  return events.length > 2
}

const getShortTitle = (title: string) => {
  if (title.length <= 6) {
    return title
  }
  return title.substring(0, 6) + '...'
}

const handleViewMoreEvents = (date: any, time: string) => {
  const events = calendarStore.getEventsForDayAndTime(date, time)
  uni.showActionSheet({
    title: `${moment(date).format('MM月DD日')} ${time} 的事件`,
    itemList: events.map(event => event.title),
    success: (res) => {
      const selectedEvent = events[res.tapIndex]
      handleViewEvent(selectedEvent)
    }
  })
}

// 日视图方法 - 简化版本
const getEventsForTimeSlot = (date: any, time: string) => {
  return calendarStore.getEventsForDayAndTime(date, time)
}

// 通用方法
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

watch([() => calendarStore.currentView, () => calendarStore.selectedDate], () => {
  calendarStore.loadEvents()
  // 视图切换时重新设置滚动同步
  if (calendarStore.currentView === 'week') {
    nextTick(() => {
      setTimeout(syncScroll, 100)
    })
  }
})

onMounted(() => {
  console.log('🚀 日历应用启动')
    
    // 运行系统调试
    setTimeout(() => {
      calendarStore.debugSystem().then(() => {
        console.log('🎯 系统调试完成，开始加载日程数据')
        // 调试完成后加载日程
        calendarStore.loadEvents()
      }).catch(error => {
        console.error('❌ 系统调试失败:', error)
        // 即使调试失败也尝试加载日程
        calendarStore.loadEvents()
      })
    }, 1000)
  calendarStore.loadEvents()
  // 初始化时设置滚动同步
  nextTick(() => {
    setTimeout(syncScroll, 100)
  })
})
</script>

<style scoped>
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

/* 修改 .calendar-day 让它支持纵向排列数字和农历 */
.calendar-day {
  height: 100rpx;
  display: flex;
  flex-direction: column; /* 纵向排列 */
  align-items: center;
  justify-content: center;
  position: relative;
  border-bottom: 1rpx solid #f2f2f2;
}

.day-number {
  font-size: 28rpx;
  font-weight: bold;
}

/* [新增] 农历样式 */
.lunar-day {
  font-size: 20rpx;
  color: #999;
  margin-top: 4rpx;
}

/* 选中状态下，农历文字也要变白 */
.selected .lunar-day {
  color: rgba(255, 255, 255, 0.8);
}

/* 今天状态下的颜色 */
.today .lunar-day {
  color: #2979ff;
}

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

.month-day {
  border-right: 1rpx solid #e4e7ed;
  border-bottom: 1rpx solid #e4e7ed;
  padding: 10rpx;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.month-day.other-month {
  color: #c0c4cc;
  background-color: #f8f9fa;
}

.day-number {
  font-size: 28rpx;
  margin-bottom: 5rpx;
}

.events-preview {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.event-preview {
  height: 8rpx;
  border-radius: 4rpx;
}

/* 周视图样式 - 优化对齐和滚动同步 */
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
  /* 隐藏滚动条 */
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
  /* 确保可以滚动 */
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
  width: 100%;
  text-align: center;
}

/* 日视图样式 */
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

.day-event .event-time {
  font-size: 20rpx;
  opacity: 0.9;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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