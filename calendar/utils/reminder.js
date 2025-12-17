// utils/reminder.js
class ReminderService {
  constructor() {
    this.initialized = false
  }

  // 初始化提醒服务
  async init() {
    if (this.initialized) return
    
    try {
      // #ifdef APP-PLUS
      // 申请通知权限
      const result = await plus.push.requestPermission()
      if (result) {
        console.log('✅ 通知权限申请成功')
      } else {
        console.warn('⚠️ 通知权限申请失败')
      }
      // #endif
      
      this.initialized = true
    } catch (error) {
      console.error('❌ 提醒服务初始化失败:', error)
    }
  }

  // 创建本地通知
  createLocalNotification(event) {
    return new Promise((resolve, reject) => {
      // #ifdef APP-PLUS
      if (!plus.push) {
        reject(new Error('推送功能不可用'))
        return
      }

      const options = {
        title: '日程提醒',
        content: `${event.title} 即将开始`,
        cover: false,
        sound: 'system',
        icon: '/static/logo.png'
      }

      // 计算提醒时间
      const reminderTime = this.calculateReminderTime(event)
      if (reminderTime > Date.now()) {
        options.when = reminderTime
      }

      plus.push.createMessage(options.content, options.payload, options)
      console.log('📅 创建本地通知:', event.title, new Date(reminderTime))
      resolve()
      // #endif
      
      // #ifdef H5
      this.createH5Notification(event)
        .then(resolve)
        .catch(reject)
      // #endif
    })
  }

  // H5环境下的通知
  async createH5Notification(event) {
    if (!('Notification' in window)) {
      throw new Error('浏览器不支持通知功能')
    }

    if (Notification.permission === 'default') {
      await Notification.requestPermission()
    }

    if (Notification.permission === 'granted') {
      const reminderTime = this.calculateReminderTime(event) - Date.now()
      
      if (reminderTime > 0) {
        setTimeout(() => {
          const notification = new Notification('日程提醒', {
            body: `${event.title} 即将开始`,
            icon: '/static/logo.png',
            tag: event._id
          })
          
          notification.onclick = function() {
            window.focus()
            notification.close()
          }
        }, reminderTime)
      }
    }
  }

  // 计算提醒时间
  calculateReminderTime(event) {
    const startDateTime = new Date(`${event.startDate} ${event.startTime || '00:00'}`)
    
    // 使用第一个提醒设置，如果没有设置则默认提前15分钟
    const reminderMinutes = event.reminders && event.reminders.length > 0 
      ? event.reminders[0] 
      : 15
    
    return startDateTime.getTime() - (reminderMinutes * 60 * 1000)
  }

  // 取消通知
  cancelNotification(eventId) {
    // #ifdef APP-PLUS
    // 清除所有通知
    plus.push.clear()
    console.log('🗑️ 清除通知:', eventId)
    // #endif
    
    // #ifdef H5
    // H5环境下无法直接取消特定通知
    // #endif
  }

  // 检查并设置提醒
  async scheduleEventReminders(events) {
    await this.init()
    
    const now = Date.now()
    const futureEvents = events.filter(event => {
      const eventTime = new Date(`${event.startDate} ${event.startTime || '00:00'}`).getTime()
      return eventTime > now && !event.hasReminded
    })

    for (const event of futureEvents) {
      try {
        await this.createLocalNotification(event)
      } catch (error) {
        console.error('❌ 设置提醒失败:', event.title, error)
      }
    }
  }
}

export default new ReminderService()