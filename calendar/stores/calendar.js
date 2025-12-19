import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import moment from 'moment'
import { Solar } from 'lunar-javascript'

export const useCalendarStore = defineStore('calendar', () => {
  // 状态
  const pageTitle = ref('我的日历')
  const currentView = ref('month')
  const selectedDate = ref(moment())
  const events = ref([])
  const loading = ref(false)
  const debugInfo = ref('') // 添加调试信息
  
  // 颜色选项
  const colorOptions = ref([
    '#2979ff', '#f56c6c', '#67c23a', '#e6a23c', 
    '#909399', '#ff85c0', '#5cdbd3', '#b37feb'
  ])

  // 环境配置
  const getBaseURL = () => {
    // #ifdef H5
    if (process.env.NODE_ENV === 'development') {
      return 'http://localhost:3000' // H5开发环境使用localhost
    } else {
      return window.location.origin // H5生产环境使用当前域名
    }
    // #endif
    // #ifdef MP-WEIXIN || APP-PLUS
    return 'https://oozy-moaningly-macy.ngrok-free.dev' // 小程序使用ngrok
	 // https://oozy-moaningly-macy.ngrok-free.dev
    // #endif
    return 'https://oozy-moaningly-macy.ngrok-free.dev' // 默认使用ngrok
  }

  // 检测是否为 ngrok 环境
  const isNgrokEnvironment = () => {
    const baseURL = getBaseURL()
    return baseURL.includes('ngrok-free.dev') || baseURL.includes('ngrok.io')
  }

  // 获取动态请求头
  const getRequestHeaders = () => {
    const headers = {
      'Content-Type': 'application/json'
    }
    
    // 只有在 ngrok 环境才添加跳过验证头部
    if (isNgrokEnvironment()) {
      headers['ngrok-skip-browser-warning'] = 'true'
      headers['X-Requested-With'] = 'XMLHttpRequest'
    }
    
    return headers
  }

  // 计算属性（保持不变）
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

const monthDays = computed(() => {
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
        lunarDay: festival || lunarText, // 农历或节日
        isCurrentMonth: day.isSame(selectedDate.value, 'month'),
        isToday: day.isSame(moment(), 'day'),
        isSelected: day.isSame(selectedDate.value, 'day')
      })
      day.add(1, 'day')
    }
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
        date: day.date()
      })
    }
    
    return days
  })

  // 方法（保持不变）
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
    loadEvents()
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
    loadEvents()
  }

  const goToToday = () => {
    selectedDate.value = moment()
    loadEvents()
  }

  const selectDate = (date) => {
    selectedDate.value = date.clone()
    // if (currentView.value === 'month') {
    //   currentView.value = 'day'
    // }
    loadEvents()
  }

  // 事件相关方法（保持不变）
  const getTimeEventsForDay = (date) => {
    const dateStr = date.format('YYYY-MM-DD')
    return events.value.filter(event => 
      event.startDate === dateStr || 
      event.endDate === dateStr ||
      (event.startDate <= dateStr && event.endDate >= dateStr)
    )
  }

  const getEventsForDayAndTime = (date, time) => {
    const dateStr = date.format('YYYY-MM-DD')
    return events.value.filter(event => {
      const dateMatch = event.startDate === dateStr || 
                       event.endDate === dateStr ||
                       (event.startDate <= dateStr && event.endDate >= dateStr)
      
      if (!dateMatch) return false
      
      if (event.startTime && event.endTime) {
        return time >= event.startTime && time < event.endTime
      }
      
      return false
    })
  }
  
  /**
   * 获取某天的“长日程”（全天或跨多天）
   */
  const getLongEventsForDay = (date) => {
    const dateStr = date.format('YYYY-MM-DD')
    return events.value.filter(event => {
      const isMultiDay = event.startDate !== event.endDate// 跨天
      const isAllDay = event.isAllDay === true // 全天标记
      // 判断该日程是否覆盖了这一天
      const isWithinRange = dateStr >= event.startDate && dateStr <= event.endDate
      
      return (isMultiDay || isAllDay) && isWithinRange
    })
  }
  
  /**
   * 获取某天的“短日程”（非全天且不跨天，按小时排列）
   * 修改你原有的 getEventsForTimeSlot，排除掉跨天日程
   */
  const getEventsForTimeSlot = (date, time) => {
    const dateStr = date.format('YYYY-MM-DD')
    return events.value.filter(event => {
      const isSingleDay = event.startDate === event.endDate
      const isNotAllDay = !event.isAllDay
      const timeMatch = time >= event.startTime && time < event.endTime
      
      return isSingleDay && isNotAllDay && event.startDate === dateStr && timeMatch
    })
  }
  
  

  // 统一处理 uni.request 响应
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

  // ==================== 调试方法 ====================
  
  // 完整的系统调试
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
      
      // 4. 测试数据格式
      debugLog.push('\n🔍 测试4: 数据格式分析')
      if (eventsResult.responseData) {
        debugLog.push(`📊 响应数据Keys: ${Object.keys(eventsResult.responseData).join(', ')}`)
        if (Array.isArray(eventsResult.responseData)) {
          debugLog.push('✅ 数据格式: 直接数组')
        } else if (eventsResult.responseData.data) {
          debugLog.push('✅ 数据格式: 包含data字段的对象')
        } else if (eventsResult.responseData.events) {
          debugLog.push('✅ 数据格式: 包含events字段的对象')
        } else {
          debugLog.push('❓ 数据格式: 未知格式')
        }
      }
      
      debugLog.push('\n🎯 ===== 调试完成 =====')
      
    } catch (error) {
      debugLog.push(`❌ 调试过程中出错: ${error.message}`)
    }
    
    // 打印到控制台
    console.log(debugLog.join('\n'))
    debugInfo.value = debugLog.join('\n')
    
    return debugLog
  }

  // 健康检查测试
  const testHealth = async () => {
    try {
      const baseURL = getBaseURL()
      const url = baseURL + '/health'
      
      const response = await new Promise((resolve, reject) => {
        uni.request({
          url,
          method: 'GET',
          timeout: 10000,
          header: getRequestHeaders(), // 使用动态头部
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

  // 网络连接测试
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

  // 事件API测试
  const testEventsAPI = async () => {
    try {
      const baseURL = getBaseURL()
      const url = baseURL + '/api/events?userId=default-user'
      
      const response = await new Promise((resolve, reject) => {
        uni.request({
          url,
          method: 'GET',
          timeout: 15000,
          header: getRequestHeaders(), // 使用动态头部
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

  // ==================== 主要API方法 ====================

  const loadEvents = async () => {
    try {
      loading.value = true
      
      const baseURL = getBaseURL()
      const url = baseURL + '/api/events?userId=default-user'
      
      console.log('🌐 请求日程数据:', url)
      console.log('📋 请求头:', getRequestHeaders())
      console.log('🌍 当前环境:', isNgrokEnvironment() ? 'Ngrok' : '本地')
      
      const response = await new Promise((resolve, reject) => {
        uni.request({
          url,
          method: 'GET',
          timeout: 30000,
          header: getRequestHeaders(), // 使用动态头部
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
      
      console.log('📡 响应状态:', statusCode)
      console.log('📦 响应数据:', responseData)
      
      if (statusCode === 200) {
        // 简化的数据解析
        if (Array.isArray(responseData)) {
          events.value = responseData
        } else if (responseData && Array.isArray(responseData.data)) {
          events.value = responseData.data
        } else if (responseData && Array.isArray(responseData.events)) {
          events.value = responseData.events
        } else {
          console.warn('⚠️ 无法识别的数据格式')
          events.value = []
        }
        
        console.log(`✅ 成功加载 ${events.value.length} 个日程`)
      } else {
        throw new Error(`HTTP错误: ${statusCode}`)
      }
    } catch (error) {
      console.error('❌ 加载事件失败:', error)
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
          header: getRequestHeaders(), // 使用动态头部
          timeout: 10000,
          success: (res) => resolve(res),
          fail: (err) => reject(err)
        })
      })
      
      const { statusCode, responseData } = handleUniResponse(response)
      
      if (statusCode === 200 || statusCode === 201) {
        if (responseData) {
          await loadEvents()
          return responseData.data || responseData
        } else {
          throw new Error('创建日程失败: 响应数据为空')
        }
      } else {
        throw new Error(`HTTP错误: ${statusCode}`)
      }
    } catch (error) {
      console.error('❌ 创建事件失败:', error)
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
          header: getRequestHeaders(), // 使用动态头部
          timeout: 10000,
          success: (res) => resolve(res),
          fail: (err) => reject(err)
        })
      })
      
      const { statusCode, responseData } = handleUniResponse(response)
      
      if (statusCode === 200) {
        if (responseData) {
          await loadEvents()
          return responseData.data || responseData
        } else {
          throw new Error('更新日程失败: 响应数据为空')
        }
      } else {
        throw new Error(`HTTP错误: ${statusCode}`)
      }
    } catch (error) {
      console.error('❌ 更新事件失败:', error)
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
          header: getRequestHeaders(), // 使用动态头部
          timeout: 10000,
          success: (res) => resolve(res),
          fail: (err) => reject(err)
        })
      })
      
      const { statusCode, responseData } = handleUniResponse(response)
      
      if (statusCode === 200) {
        if (responseData) {
          await loadEvents()
        } else {
          throw new Error('删除日程失败: 响应数据为空')
        }
      } else {
        throw new Error(`HTTP错误: ${statusCode}`)
      }
    } catch (error) {
      console.error('❌ 删除事件失败:', error)
      throw error
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
    getEventsForDayAndTime,
	getLongEventsForDay,
	getEventsForTimeSlot,
    loadEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    
    // 调试方法
    debugSystem,
    testHealth,
    testNetwork,
    testEventsAPI,
    
    // 工具方法
    isNgrokEnvironment,
    getRequestHeaders
  }
})