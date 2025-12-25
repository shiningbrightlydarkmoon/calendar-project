// utils/reminder.js - 完整版

class ReminderService {
  constructor() {
    this.initialized = false;
    this.notifications = new Map(); // 跟踪已设置的通知
  }

  /**
   * 初始化提醒服务
   */
  async init() {
    if (this.initialized) return;
    
    // #ifdef APP-PLUS
    try {
      plus.push.requestPermission((res) => {
        console.log('🔔 通知权限状态:', res);
        this.initialized = true;
        
        // 清理可能的过期通知记录
        this.cleanupOldNotifications();
      });
    } catch (error) {
      console.error('❌ 提醒服务权限初始化失败:', error);
    }
    // #endif
    
    // #ifndef APP-PLUS
    this.initialized = true;
    // #endif
  }

  /**
   * 清理过期通知记录
   */
  cleanupOldNotifications() {
    try {
      const now = Date.now();
      const oneDayAgo = now - 24 * 60 * 60 * 1000;
      
      // 清理内存中的过期记录
      for (const [id, notification] of this.notifications) {
        if (notification.timestamp < oneDayAgo) {
          this.notifications.delete(id);
        }
      }
      
      console.log('🧹 清理过期通知记录完成');
    } catch (error) {
      console.error('清理通知失败:', error);
    }
  }

  /**
   * 创建本地通知（支持多个提醒时间）
   */
  createLocalNotification(rawEvent) {
    return new Promise((resolve) => {
      // 提取日程数据
      const event = (rawEvent && rawEvent.data) ? rawEvent.data : rawEvent;

      // 基本校验
      if (!event || !event.title || !event.startDate) {
        console.warn('数据不完整，忽略提醒设置');
        return resolve();
      }

      // 解析开始时间
      const startTime = this.parseEventDateTime(event);
      if (!startTime) {
        console.warn('无法解析日程时间');
        return resolve();
      }

      const now = Date.now();
      
      // 检查是否是过去日程
      if (startTime <= now) {
        console.log('⏰ 过去日程，不设置提醒:', event.title);
        return resolve();
      }

      // 获取提醒时间（支持多个提醒）
      let reminderMinutes = 15; // 默认15分钟前
      
      // 如果事件中有指定的提醒时间，使用它
      if (event.reminderMinutes !== undefined) {
        reminderMinutes = event.reminderMinutes;
      }
      
      // 计算提醒时间
      let reminderTime = startTime - (reminderMinutes * 60 * 1000);
      const minReminderTime = now + 10000; // 至少10秒后
      
      // 调整提醒时间
      if (reminderTime <= now) {
        // 如果提醒时间在过去，立即提醒
        reminderTime = Math.max(minReminderTime, now + 5000);
        console.log(`⏱️ 提醒时间已过，调整为立即提醒: "${event.title}"`);
      }

      // #ifdef APP-PLUS
      if (!plus.push) {
        console.warn('plus.push 未初始化');
        return resolve();
      }

      const delay = reminderTime - now;
      const eventId = event._id || event.id || Date.now().toString();
      
      // 为每个提醒生成唯一ID
      const reminderId = `${eventId}_${reminderMinutes}`;

      // 构造通知内容
      let content = event.title;
      
      // 添加提醒时间信息到通知内容
      if (reminderMinutes > 0) {
        if (reminderMinutes < 60) {
          content = `[${reminderMinutes}分钟前] ${event.title}`;
        } else if (reminderMinutes < 1440) {
          const hours = Math.floor(reminderMinutes / 60);
          content = `[${hours}小时前] ${event.title}`;
        } else if (reminderMinutes < 10080) {
          const days = Math.floor(reminderMinutes / 1440);
          content = `[${days}天前] ${event.title}`;
        } else {
          const weeks = Math.floor(reminderMinutes / 10080);
          content = `[${weeks}周前] ${event.title}`;
        }
      } else {
        content = `[准时] ${event.title}`;
      }
      
      const payload = JSON.stringify({ 
        id: eventId, 
        reminderId: reminderId,
        type: 'calendar_event',
        title: event.title,
        reminderMinutes: reminderMinutes,
        startTime: new Date(startTime).toLocaleString()
      });
      
      const options = {
        title: reminderMinutes === 0 ? '日程开始' : '日程提醒',
        cover: false,
        sound: 'system',
        when: new Date(reminderTime)
      };

      try {
        // 设置定时提醒
        setTimeout(() => {
          try {
            plus.push.createMessage(content, payload, options);
            
            const timeText = this.getReminderTimeText(reminderMinutes);
            console.log(`🚀 触发${timeText}提醒: "${event.title}"`);
            
            // 通知触发后从跟踪中移除
            this.notifications.delete(reminderId);
          } catch (e) {
            console.error('推送失败:', e);
          }
        }, delay);
        
        // 跟踪这个通知
        this.notifications.set(reminderId, {
          id: reminderId,
          eventId: eventId,
          title: event.title,
          reminderMinutes: reminderMinutes,
          startTime: startTime,
          reminderTime: reminderTime,
          timestamp: now
        });
        
        const delaySeconds = Math.round(delay / 1000);
        const delayMinutes = Math.round(delaySeconds / 60);
        
        const timeText = this.getReminderTimeText(reminderMinutes);
        
        if (delaySeconds < 60) {
          console.log(`✅ ${timeText}提醒排期成功: "${event.title}"，${delaySeconds}秒后触发`);
        } else {
          console.log(`✅ ${timeText}提醒排期成功: "${event.title}"，${delayMinutes}分钟后触发`);
        }
        
      } catch (error) {
        console.error('设置提醒失败:', error);
      }
      // #endif
      
      // #ifdef H5
      this.createH5Notification(event, reminderTime, reminderMinutes).then(resolve);
      // #endif
      
      // #ifdef MP-WEIXIN
      console.log('微信小程序暂不支持本地通知');
      // #endif
      
      resolve();
    });
  }

  /**
   * 获取提醒时间文本
   */
  getReminderTimeText(minutes) {
    if (minutes === 0) return '准时';
    if (minutes < 60) return `${minutes}分钟前`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}小时前`;
    if (minutes < 10080) return `${Math.floor(minutes / 1440)}天前`;
    return `${Math.floor(minutes / 10080)}周前`;
  }

  /**
   * 解析事件日期时间
   */
  parseEventDateTime(event) {
    try {
      const dateStr = event.startDate.replace(/-/g, '/');
      
      if (event.isAllDay === true) {
        // 全天事件：使用当天的开始时间（00:00）
        return new Date(dateStr).getTime();
      }
      
      const timeStr = event.startTime || '00:00';
      return new Date(`${dateStr} ${timeStr}`).getTime();
    } catch (e) {
      console.error('日期时间解析失败:', e);
      return null;
    }
  }

  /**
   * 检查日程是否已经过去
   */
  isEventInPast(event) {
    try {
      const eventTime = this.parseEventDateTime(event);
      if (!eventTime) return true;
      
      return eventTime <= Date.now();
    } catch (e) {
      console.error('检查日程时间失败:', e);
      return true;
    }
  }

  /**
   * 清除特定事件的所有提醒
   */
  cancelNotification(eventId = null) {
    // #ifdef APP-PLUS
    if (typeof plus !== 'undefined' && plus.push) {
      if (eventId) {
        // 清除该事件的所有提醒
        let count = 0;
        for (const [id, notification] of this.notifications) {
          if (notification.eventId === eventId) {
            this.notifications.delete(id);
            count++;
          }
        }
        console.log(`🗑️ 取消事件 ${eventId} 的 ${count} 个提醒`);
      }
    }
    // #endif
  }

  /**
   * 为事件设置多个提醒
   */
  async setupMultipleReminders(event, reminderMinutesArray) {
    if (!reminderMinutesArray || !Array.isArray(reminderMinutesArray)) {
      console.warn('无效的提醒时间数组');
      return;
    }
    
    const now = Date.now();
    const startTime = this.parseEventDateTime(event);
    
    if (!startTime || startTime <= now) {
      console.log('⏰ 过去日程，不设置提醒');
      return;
    }
    
    console.log(`📅 为日程 "${event.title}" 设置 ${reminderMinutesArray.length} 个提醒`);
    
    // 为每个提醒时间设置通知
    for (const minutes of reminderMinutesArray) {
      const reminderEvent = {
        ...event,
        reminderMinutes: minutes
      };
      
      await this.createLocalNotification(reminderEvent);
    }
  }

  /**
   * H5 浏览器通知实现
   */
  async createH5Notification(event, reminderTime, reminderMinutes) {
    if ('Notification' in window) {
      if (Notification.permission === 'default') {
        await Notification.requestPermission();
      }
      
      if (Notification.permission === 'granted') {
        const now = Date.now();
        const delay = reminderTime - now;
        
        if (delay > 0) {
          setTimeout(() => {
            const timeText = this.getReminderTimeText(reminderMinutes);
            new Notification(`${timeText}提醒`, { 
              body: `${event.title}\n开始时间: ${new Date(this.parseEventDateTime(event)).toLocaleString()}`,
              icon: '/static/logo.png'
            });
            console.log(`🔔 触发${timeText}浏览器通知: ${event.title}`);
          }, delay);
        } else {
          // 立即触发
          const timeText = this.getReminderTimeText(reminderMinutes);
          new Notification(`${timeText}提醒`, { 
            body: `${event.title}\n开始时间: ${new Date(this.parseEventDateTime(event)).toLocaleString()}`
          });
        }
      }
    }
  }
  
  /**
   * 获取所有已设置的提醒
   */
  getAllScheduledNotifications() {
    const now = Date.now();
    const upcoming = [];
    const past = [];
    
    for (const [id, notification] of this.notifications) {
      if (notification.reminderTime > now) {
        const timeLeft = notification.reminderTime - now;
        upcoming.push({
          id: id,
          eventId: notification.eventId,
          title: notification.title,
          reminderText: this.getReminderTimeText(notification.reminderMinutes),
          reminderTime: new Date(notification.reminderTime).toLocaleString(),
          starts: new Date(notification.startTime).toLocaleString(),
          secondsLeft: Math.round(timeLeft / 1000),
          minutesLeft: Math.round(timeLeft / 60000)
        });
      } else {
        past.push({
          id: id,
          eventId: notification.eventId,
          title: notification.title,
          reminderText: this.getReminderTimeText(notification.reminderMinutes)
        });
      }
    }
    
    return {
      upcoming: upcoming,
      past: past,
      total: this.notifications.size
    };
  }
  
  /**
   * 清除所有提醒跟踪记录
   */
  clearAllNotifications() {
    this.notifications.clear();
    console.log('🗑️ 已清除所有提醒跟踪记录');
  }
}

export default new ReminderService();