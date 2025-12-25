import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import moment from 'moment'
import { Solar } from 'lunar-javascript'
import reminderService from '@/utils/reminder.js'

export const useCalendarStore = defineStore('calendar', () => {
  // 状态
  const pageTitle = ref('我的日历')
  const currentView = ref('month')
  const selectedDate = ref(moment())
  const events = ref([])
  const loading = ref(false)
  const debugInfo = ref('')
  
  // 优化：添加缓存和状态管理
  const isFetching = ref(false)
  const lastMonthKey = ref('')
  const cachedMonthData = ref(null)
  const eventsCache = ref({}) // 按日期缓存事件
  const lastFetchTime = ref(0)
  
  // 颜色选项
  const colorOptions = ref([
    '#2979ff', '#f56c6c', '#67c23a', '#e6a23c', 
    '#909399', '#ff85c0', '#5cdbd3', '#b37feb'
  ])
  
  // 提醒选项配置（简化版）
  const reminderOptions = ref([
    { label: '准时', value: 0 },
    { label: '5分钟前', value: 5 },
    { label: '10分钟前', value: 10 },
    { label: '15分钟前', value: 15 },
    { label: '30分钟前', value: 30 },
    { label: '1小时前', value: 60 },
    { label: '2小时前', value: 120 },
    { label: '1天前', value: 1440 },
    { label: '2天前', value: 2880 },
    { label: '1周前', value: 10080 }
  ])

  // ==================== 环境配置 ====================
  const getBaseURL = () => {
    // #ifdef H5
    if (process.env.NODE_ENV === 'development') {
      return 'http://localhost:3000'
    } else {
      return window.location.origin
    }
    // #endif
    // #ifdef MP-WEIXIN || APP-PLUS
    return 'https://oozy-moaningly-macy.ngrok-free.dev'
    // #endif
    return 'https://oozy-moaningly-macy.ngrok-free.dev'
  }

  const isNgrokEnvironment = () => {
    const baseURL = getBaseURL()
    return baseURL.includes('ngrok-free.dev') || baseURL.includes('ngrok.io')
  }

  const getRequestHeaders = () => {
    const headers = {
      'Content-Type': 'application/json'
    }
    
    if (isNgrokEnvironment()) {
      headers['ngrok-skip-browser-warning'] = 'true'
      headers['X-Requested-With'] = 'XMLHttpRequest'
    }
    
    return headers
  }

  // ==================== 计算属性优化 ====================
  const displayDate = computed(() => {
    switch (currentView.value) {
      case 'month':
        return selectedDate.value.format('YYYY年MM月')
      case 'week':
        const startOfWeek = selectedDate.value.clone().startOf('week')
        const endOfWeek = selectedDate.value.clone().endOf('week')
        return `${startOfWeek.format('MM月DD日')} - ${endOfWeek.format('MM月DD日')}`
      case 'day':
        return selectedDate.value.format('YYYY年MM月DD日')
      default:
        return selectedDate.value.format('YYYY年MM月')
    }
  })

  // 优化：如果 selectedDate 的月份没变，就不需要重新计算 monthDays
  const monthDays = computed(() => {
    const currentMonthKey = selectedDate.value.format('YYYY-MM')
    
    // 如果月份没变，返回缓存的月份数据
    if (currentMonthKey === lastMonthKey.value && cachedMonthData.value) {
      return cachedMonthData.value
    }
    
    // 重新计算月份数据
    const startDay = selectedDate.value.clone().startOf('month').startOf('week')
    const endDay = selectedDate.value.clone().endOf('month').endOf('week')
    const days = []
    let day = startDay.clone()
    
    while (day.isBefore(endDay, 'day') || day.isSame(endDay, 'day')) {
      // 农历计算逻辑
      const solar = Solar.fromYmd(day.year(), day.month() + 1, day.date())
      const lunar = solar.getLunar()
      let lunarText = lunar.getDayInChinese()
      if (lunar.getDay() === 1) lunarText = lunar.getMonthInChinese() + '月'
      const festival = lunar.getFestivals()[0] || lunar.getOtherFestivals()[0]

      days.push({
        date: day.clone(),
        day: day.date(),
        lunarDay: festival || lunarText,
        isCurrentMonth: day.isSame(selectedDate.value, 'month'),
        isToday: day.isSame(moment(), 'day'),
        isSelected: day.isSame(selectedDate.value, 'day'),
        dateStr: day.format('YYYY-MM-DD')
      })
      day.add(1, 'day')
    }
    
    // 缓存计算结果
    lastMonthKey.value = currentMonthKey
    cachedMonthData.value = days
    
    return days
  })

  const weekDays = computed(() => {
    const startOfWeek = selectedDate.value.clone().startOf('week')
    const days = []
    
    for (let i = 0; i < 7; i++) {
      const day = startOfWeek.clone().add(i, 'days')
      days.push({
        fullDate: day,
        weekday: ['日', '一', '二', '三', '四', '五', '六'][i],
        date: day.date(),
        dateStr: day.format('YYYY-MM-DD')
      })
    }
    
    return days
  })

  // ==================== 事件数据缓存优化 ====================
  // 构建事件缓存
  const buildEventsCache = () => {
    eventsCache.value = {}
    
    events.value.forEach(event => {
      const startMoment = moment(event.startDate)
      const endMoment = moment(event.endDate)
      let current = startMoment.clone()
      
      while (current.isSameOrBefore(endMoment, 'day')) {
        const dateStr = current.format('YYYY-MM-DD')
        if (!eventsCache.value[dateStr]) {
          eventsCache.value[dateStr] = []
        }
        eventsCache.value[dateStr].push(event)
        current.add(1, 'day')
      }
    })
  }

  // 获取某天的事件（带缓存）
  const getTimeEventsForDay = (date) => {
    const dateStr = moment(date).format('YYYY-MM-DD')
    return eventsCache.value[dateStr] || []
  }

  // 按时间槽获取事件
  const getEventsForTimeSlot = (date, time) => {
    const dateStr = moment(date).format('YYYY-MM-DD')
    const eventsForDate = eventsCache.value[dateStr] || []
    
    return eventsForDate.filter(event => {
      const isSingleDay = event.startDate === event.endDate
      const isNotAllDay = !event.isAllDay
      const timeMatch = time >= event.startTime && time < event.endTime
      
      return isSingleDay && isNotAllDay && event.startDate === dateStr && timeMatch
    })
  }

  // 长事件获取
  const getLongEventsForDay = (date) => {
    const dateStr = moment(date).format('YYYY-MM-DD')
    const eventsForDate = eventsCache.value[dateStr] || []
    
    return eventsForDate.filter(event => {
      const isMultiDay = event.startDate !== event.endDate
      const isAllDay = event.isAllDay === true
      const isWithinRange = dateStr >= event.startDate && dateStr <= event.endDate
      
      return (isMultiDay || isAllDay) && isWithinRange
    })
  }

  // ==================== 视图切换方法 ====================
  const switchView = (view) => {
    currentView.value = view
  }

  const previousPeriod = () => {
    switch (currentView.value) {
      case 'month':
        selectedDate.value = selectedDate.value.clone().subtract(1, 'month') 
        break
      case 'week':
        selectedDate.value = selectedDate.value.clone().subtract(1, 'week')
        break
      case 'day':
        selectedDate.value = selectedDate.value.clone().subtract(1, 'day')
        break
    }
  }

  const nextPeriod = () => {
    switch (currentView.value) {
      case 'month':
        selectedDate.value = selectedDate.value.clone().add(1, 'month')
        break
      case 'week':
        selectedDate.value = selectedDate.value.clone().add(1, 'week')
        break
      case 'day':
        selectedDate.value = selectedDate.value.clone().add(1, 'day')
        break
    }
  }

  const goToToday = () => {
    selectedDate.value = moment()
  }

  const selectDate = (date) => {
    selectedDate.value = date.clone()
  }

  // ==================== 静默数据加载 ====================
  // 静默加载（不显示loading状态）
  const loadEventsSilently = async () => {
    if (isFetching.value) return
    
    // 防抖：避免频繁调用
    const now = Date.now()
    if (now - lastFetchTime.value < 2000) {
      return
    }
    
    try {
      isFetching.value = true
      lastFetchTime.value = now
      
      const baseURL = getBaseURL()
      const url = baseURL + '/api/events?userId=default-user'
      
      const response = await new Promise((resolve, reject) => {
        uni.request({
          url,
          method: 'GET',
          timeout: 10000,
          header: getRequestHeaders(),
          success: (res) => resolve(res),
          fail: (err) => reject(err)
        })
      })
      
      const { statusCode, responseData } = handleUniResponse(response)
      
      if (statusCode === 200) {
        let newEvents = []
        
        // 解析事件数据
        if (Array.isArray(responseData)) {
          newEvents = responseData
        } else if (responseData && Array.isArray(responseData.data)) {
          newEvents = responseData.data
        } else if (responseData && Array.isArray(responseData.events)) {
          newEvents = responseData.events
        }
        
        // 只有在数据变化时才更新
        if (JSON.stringify(events.value) !== JSON.stringify(newEvents)) {
          events.value = newEvents
          buildEventsCache() // 更新缓存
          console.log(`✅ 静默更新 ${newEvents.length} 个日程`)
        }
      }
    } catch (error) {
      console.error('静默加载失败:', error)
    } finally {
      isFetching.value = false
    }
  }

  // 主加载方法 - 显示加载状态
  const loadEvents = async () => {
    try {
      loading.value = true
      
      const baseURL = getBaseURL()
      const url = baseURL + '/api/events?userId=default-user'
      
      console.log('请求日程数据:', url)
      console.log('请求头:', getRequestHeaders())
      console.log('当前环境:', isNgrokEnvironment() ? 'Ngrok' : '本地')
      
      const response = await new Promise((resolve, reject) => {
        uni.request({
          url,
          method: 'GET',
          timeout: 30000,
          header: getRequestHeaders(),
          success: (res) => resolve(res),
          fail: (err) => reject(err)
        })
      })
      
      // 检查响应内容类型
      const contentType = response.header && response.header['Content-Type'];
      if (contentType && contentType.includes('text/html')) {
        throw new Error('服务器返回了HTML页面而不是JSON数据，请检查ngrok配置');
      }
      
      const { statusCode, responseData } = handleUniResponse(response)
      
      console.log('响应状态:', statusCode)
      console.log('响应数据:', responseData)
      
      if (statusCode === 200) {
        // 简化的数据解析
        let newEvents = []
        if (Array.isArray(responseData)) {
          newEvents = responseData
        } else if (responseData && Array.isArray(responseData.data)) {
          newEvents = responseData.data
        } else if (responseData && Array.isArray(responseData.events)) {
          newEvents = responseData.events
        } else {
          console.warn('无法识别的数据格式')
          newEvents = []
        }
        
        events.value = newEvents
        buildEventsCache() // 构建缓存
        console.log(`成功加载 ${events.value.length} 个日程`)
      } else {
        throw new Error(`HTTP错误: ${statusCode}`)
      }
    } catch (error) {
      console.error('加载事件失败:', error)
      uni.showToast({
        title: '加载失败: ' + error.message,
        icon: 'none',
        duration: 4000
      })
      events.value = []
    } finally {
      loading.value = false
    }
  }

  // 启动静默刷新
  const startSilentRefresh = () => {
    console.log('⏰ 启动静默刷新')
    
    // 每5分钟静默刷新一次
    setInterval(() => {
      if (!loading.value) {
        loadEventsSilently()
      }
    }, 5 * 60 * 1000)
    
    // 监听应用状态变化
    // #ifdef H5
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        console.log('📱 应用回到前台，静默刷新数据')
        setTimeout(() => {
          loadEventsSilently()
        }, 1000)
      }
    })
    // #endif
  }

  // ==================== 事件增删改（支持提醒） ====================
  const createEvent = async (eventData) => {
    try {
      const baseURL = getBaseURL()
      const url = baseURL + '/api/events'
      
      const response = await new Promise((resolve, reject) => {
        uni.request({
          url,
          method: 'POST',
          data: {
            ...eventData,
            userId: 'default-user'
          },
          header: getRequestHeaders(),
          timeout: 10000,
          success: (res) => resolve(res),
          fail: (err) => reject(err)
        })
      })
      
      const { statusCode, responseData } = handleUniResponse(response)
      
      if (statusCode === 200 || statusCode === 201) {
        if (!responseData) {
          throw new Error('创建日程失败: 响应数据为空')
        }

        const result = responseData.data || responseData
        
        // 1. 静默加载最新数据
        setTimeout(() => {
          loadEventsSilently()
        }, 500)
        
        // 2. 设置多个提醒
        if (eventData.reminders && eventData.reminders.length > 0) {
          console.log(`📅 为日程 "${result.title}" 设置 ${eventData.reminders.length} 个提醒`)
          
          // 为每个提醒时间设置通知
          for (const reminderMinutes of eventData.reminders) {
            const reminderResult = {
              ...result,
              reminderMinutes: reminderMinutes
            }
            
            await reminderService.createLocalNotification(reminderResult)
          }
        } else {
          console.log('⏰ 未设置提醒')
        }
        
        return result
      } else {
        throw new Error(`HTTP错误: ${statusCode}`)
      }
    } catch (error) {
      console.error('创建事件失败:', error)
      throw error
    }
  }

  const updateEvent = async (eventId, eventData) => {
    try {
      const baseURL = getBaseURL()
      const url = baseURL + `/api/events/${eventId}`
      
      const response = await new Promise((resolve, reject) => {
        uni.request({
          url,
          method: 'PUT',
          data: eventData,
          header: getRequestHeaders(),
          timeout: 10000,
          success: (res) => resolve(res),
          fail: (err) => reject(err)
        })
      })
      
      const { statusCode, responseData } = handleUniResponse(response)
      
      // 先取消所有旧的提醒
      reminderService.cancelNotification(eventId)
      
      // 设置新的提醒
      if (eventData.reminders && eventData.reminders.length > 0) {
        console.log(`📅 更新日程提醒，设置 ${eventData.reminders.length} 个提醒`)
        
        const updatedEvent = { ...eventData, _id: eventId }
        
        // 为每个提醒时间设置通知
        for (const reminderMinutes of eventData.reminders) {
          const reminderEvent = {
            ...updatedEvent,
            reminderMinutes: reminderMinutes
          }
          
          await reminderService.createLocalNotification(reminderEvent)
        }
      }
      
      // 静默刷新数据
      setTimeout(() => {
        loadEventsSilently()
      }, 500)
      
      if (statusCode === 200) {
        if (responseData) {
          return responseData.data || responseData
        } else {
          throw new Error('更新日程失败: 响应数据为空')
        }
      } else {
        throw new Error(`HTTP错误: ${statusCode}`)
      }
    } catch (error) {
      console.error('更新事件失败:', error)
      throw error
    }
  }

  const deleteEvent = async (eventId) => {
    try {
      const baseURL = getBaseURL()
      const url = baseURL + `/api/events/${eventId}`
      
      const response = await new Promise((resolve, reject) => {
        uni.request({
          url,
          method: 'DELETE',
          header: getRequestHeaders(),
          timeout: 10000,
          success: (res) => resolve(res),
          fail: (err) => reject(err)
        })
      })
      
      const { statusCode, responseData } = handleUniResponse(response)
      
      // 取消该事件的所有提醒
      reminderService.cancelNotification(eventId)
      
      // 静默刷新数据
      setTimeout(() => {
        loadEventsSilently()
      }, 500)
      
      if (statusCode === 200) {
        if (responseData) {
          return responseData.data || responseData
        } else {
          throw new Error('删除日程失败: 响应数据为空')
        }
      } else {
        throw new Error(`HTTP错误: ${statusCode}`)
      }
    } catch (error) {
      console.error('删除事件失败:', error)
      throw error
    }
  }

  // ==================== 工具方法 ====================
  const handleUniResponse = (response) => {
    let statusCode, responseData
    
    // H5 环境
    // #ifdef H5
    statusCode = response.status
    responseData = response.data
    // #endif
    
    // 微信小程序和App环境
    // #ifdef MP-WEIXIN || APP-PLUS
    statusCode = response.statusCode
    responseData = response.data
    // #endif
    
    // 兼容性处理
    if (statusCode === undefined) {
      statusCode = response.statusCode || response.status
      responseData = response.data || response
    }
    
    return { statusCode, responseData }
  }

  // 调试方法
  const debugSystem = async () => {
    const debugLog = []
    const baseURL = getBaseURL()
    
    debugLog.push('🚀 ===== 开始系统调试 =====')
    debugLog.push(`📍 基础URL: ${baseURL}`)
    debugLog.push(`🕐 调试时间: ${new Date().toLocaleString()}`)
    debugLog.push(`🌐 当前环境: ${isNgrokEnvironment() ? 'Ngrok环境' : '本地环境'}`)
    
    // #ifdef MP-WEIXIN
    debugLog.push('📱 运行环境: 微信小程序')
    // #endif
    // #ifdef H5
    debugLog.push('🌐 运行环境: H5网页')
    // #endif
    
    try {
      // 1. 测试健康检查
      debugLog.push('\n🔗 测试1: 健康检查接口')
      const healthResult = await testHealth()
      debugLog.push(`✅ 健康检查: ${healthResult.success ? '成功' : '失败'}`)
      debugLog.push(`📊 响应数据: ${JSON.stringify(healthResult.data)}`)
      
      // 2. 测试网络连接
      debugLog.push('\n🌐 测试2: 网络连接测试')
      const networkResult = await testNetwork()
      debugLog.push(`📶 网络类型: ${networkResult.networkType}`)
      
      // 3. 测试事件API
      debugLog.push('\n📅 测试3: 事件API测试')
      const eventsResult = await testEventsAPI()
      debugLog.push(`📡 API状态码: ${eventsResult.statusCode}`)
      debugLog.push(`📦 原始数据格式: ${typeof eventsResult.responseData}`)
      debugLog.push(`🔢 解析后事件数量: ${eventsResult.parsedData.length}`)
      
      // 4. 提醒服务状态
      debugLog.push('\n🔔 测试4: 提醒服务状态')
      const reminders = reminderService.getAllScheduledNotifications()
      debugLog.push(`📊 提醒总数: ${reminders.total}`)
      debugLog.push(`⏳ 即将触发: ${reminders.upcoming.length}`)
      debugLog.push(`✅ 已触发: ${reminders.past.length}`)
      
      debugLog.push('\n🎯 ===== 调试完成 =====')
      
    } catch (error) {
      debugLog.push(`❌ 调试过程中出错: ${error.message}`)
    }
    
    // 打印到控制台
    console.log(debugLog.join('\n'))
    debugInfo.value = debugLog.join('\n')
    
    return debugLog
  }

  // 调试提醒
  const debugReminders = () => {
    console.log('🔔 当前所有提醒:')
    const reminders = reminderService.getAllScheduledNotifications()
    console.log(`总计: ${reminders.total} 个提醒`)
    
    if (reminders.upcoming.length > 0) {
      console.log('⏳ 即将触发的提醒:')
      reminders.upcoming.forEach(reminder => {
        console.log(`  📅 ${reminder.title} - ${reminder.reminderText} (${reminder.minutesLeft}分钟后)`)
      })
    }
    
    if (reminders.past.length > 0) {
      console.log('✅ 已触发的提醒:')
      reminders.past.forEach(reminder => {
        console.log(`  📅 ${reminder.title} - ${reminder.reminderText}`)
      })
    }
  }

  const testHealth = async () => {
    try {
      const baseURL = getBaseURL()
      const url = baseURL + '/health'
      
      const response = await new Promise((resolve, reject) => {
        uni.request({
          url,
          method: 'GET',
          timeout: 10000,
          header: getRequestHeaders(),
          success: (res) => resolve(res),
          fail: (err) => reject(err)
        })
      })
      
      const { statusCode, responseData } = handleUniResponse(response)
      
      return {
        success: statusCode === 200,
        statusCode,
        data: responseData
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  const testNetwork = async () => {
    return new Promise((resolve) => {
      uni.getNetworkType({
        success: (res) => {
          resolve({
            success: true,
            networkType: res.networkType
          })
        },
        fail: (err) => {
          resolve({
            success: false,
            error: err.errMsg
          })
        }
      })
    })
  }

  const testEventsAPI = async () => {
    try {
      const baseURL = getBaseURL()
      const url = baseURL + '/api/events?userId=default-user'
      
      const response = await new Promise((resolve, reject) => {
        uni.request({
          url,
          method: 'GET',
          timeout: 15000,
          header: getRequestHeaders(),
          success: (res) => resolve(res),
          fail: (err) => reject(err)
        })
      })
      
      const { statusCode, responseData } = handleUniResponse(response)
      
      // 解析事件数据
      let parsedData = []
      if (Array.isArray(responseData)) {
        parsedData = responseData
      } else if (responseData && Array.isArray(responseData.data)) {
        parsedData = responseData.data
      } else if (responseData && Array.isArray(responseData.events)) {
        parsedData = responseData.events
      }
      
      return {
        statusCode,
        responseData,
        parsedData,
        parsedCount: parsedData.length
      }
    } catch (error) {
      return {
        error: error.message
      }
    }
  }

  return {
    // 状态
    pageTitle,
    currentView,
    selectedDate,
    events,
    loading,
    colorOptions,
    reminderOptions,
    debugInfo,
    
    // 计算属性
    displayDate,
    monthDays,
    weekDays,
    
    // 方法
    switchView,
    previousPeriod,
    nextPeriod,
    goToToday,
    selectDate,
    getTimeEventsForDay,
    getEventsForTimeSlot,
    getLongEventsForDay,
    loadEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    
    // 新增的优化方法
    loadEventsSilently,
    startSilentRefresh,
    
    // 调试方法
    debugSystem,
    debugReminders,
    testHealth,
    testNetwork,
    testEventsAPI,
    
    // 工具方法
    isNgrokEnvironment,
    getRequestHeaders
  }
})