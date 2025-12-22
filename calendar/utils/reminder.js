// utils/reminder.js

class ReminderService {
  constructor() {
    this.initialized = false;
  }

  /**
   * 初始化提醒服务
   * 在 App.vue 的 onLaunch 中调用，确保申请到系统通知权限
   */
  async init() {
    if (this.initialized) return;
    
    // #ifdef APP-PLUS
    try {
      // 申请安卓通知权限（适配 Android 13+）
      plus.push.requestPermission((res) => {
        console.log('🔔 [System] 通知权限状态:', res);
        this.initialized = true;
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
   * 创建本地通知
   * @param {Object} rawEvent - 日程数据（自动兼容包含 data 字段的对象）
   */
  createLocalNotification(rawEvent) {
    return new Promise((resolve) => {
      // 1. 自动兼容嵌套层级：提取核心日程数据
      const event = (rawEvent && rawEvent.data) ? rawEvent.data : rawEvent;

      // 2. 增强校验：确保标题和日期格式正确
      if (!event || !event.title || !event.startDate) {
        console.warn('⚠️ [Reminder] 数据不完整，忽略提醒设置:', {
          receivedData: event,
          hasTitle: !!event?.title,
          hasStartDate: !!event?.startDate
        });
        return resolve();
      }

      // #ifdef APP-PLUS
      if (!plus.push) return resolve();

      // 3. 计算提醒时间与延时
      const reminderTime = this.calculateReminderTime(event);
      const now = Date.now();
      const delay = reminderTime - now;

      // 4. 构造通知内容（强制字符串化，解决 undefined 报错）
      const content = String(event.title); 
      const payload = JSON.stringify({ id: event._id, type: 'calendar_event' });
      
      const options = {
        title: '日程提醒',
        cover: false,
        sound: 'system',
        when: new Date(reminderTime) // 系统级定时排期
      };

      // 5. 执行提醒：使用计时器作为应用内存驻留期间的双重保险
      if (delay <= 0) {
        // 如果时间已过，立即弹出验证功能
        plus.push.createMessage(content, payload, options);
        console.log('🚀 [Reminder] 立即触发通知:', content);
      } else if (delay < 24 * 60 * 60 * 1000) { 
        // 24小时内的日程，设置计时器准时呼叫系统推送接口
        setTimeout(() => {
          try {
            plus.push.createMessage(content, payload, options);
            console.log('🚀 [Reminder] 到点触发:', content);
          } catch (e) {
            console.error('❌ [Reminder] 推送失败:', e);
          }
        }, delay);
        
        console.log(`✅ [Reminder] 提醒排期成功: "${content}"，预计于 ${new Date(reminderTime).toLocaleString()} 弹出`);
      }
      // #endif
      
      // #ifdef H5
      this.createH5Notification(event, reminderTime).then(resolve);
      // #endif
      
      // #ifdef MP-WEIXIN
      // 微信小程序不支持 plus.push，需通过订阅消息实现，此处静默处理以防报错
      resolve();
      // #endif
    });
  }

  /**
   * 计算提醒时间：默认提前 15 分钟
   */
  calculateReminderTime(event) {
    try {
      // 兼容格式：将 "2025-12-22" 转换为 "2025/12/22" 以支持所有内核
      const dateStr = event.startDate.replace(/-/g, '/');
      const timeStr = event.startTime || '00:00';
      const startDateTime = new Date(`${dateStr} ${timeStr}`);
      
      // 默认提前 15 分钟
      const advanceMS = 15 * 60 * 1000; 
      return startDateTime.getTime() - advanceMS;
    } catch (e) {
      console.error('❌ [Reminder] 时间解析出错:', e);
      return Date.now() + 5000; // 失败则5秒后兜底弹出
    }
  }

  /**
   * 清除所有本地通知记录
   */
  cancelNotification() {
    // #ifdef APP-PLUS
    if (typeof plus !== 'undefined' && plus.push) {
      plus.push.clear();
      console.log('🗑️ [Reminder] 本地通知栏已清空');
    }
    // #endif
  }

  /**
   * H5 浏览器通知实现
   */
  async createH5Notification(event, reminderTime) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const delay = reminderTime - Date.now();
      if (delay > 0) {
        setTimeout(() => {
          new Notification('日程提醒', { body: event.title });
        }, delay);
      }
    }
  }
}

export default new ReminderService();