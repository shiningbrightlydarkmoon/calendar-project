"use strict";
const common_vendor = require("../common/vendor.js");
class ReminderService {
  constructor() {
    this.initialized = false;
    this.notifications = /* @__PURE__ */ new Map();
  }
  /**
   * 初始化提醒服务
   */
  async init() {
    if (this.initialized)
      return;
    this.initialized = true;
  }
  /**
   * 清理过期通知记录
   */
  cleanupOldNotifications() {
    try {
      const now = Date.now();
      const oneDayAgo = now - 24 * 60 * 60 * 1e3;
      for (const [id, notification] of this.notifications) {
        if (notification.timestamp < oneDayAgo) {
          this.notifications.delete(id);
        }
      }
      common_vendor.index.__f__("log", "at utils/reminder.js:49", "🧹 清理过期通知记录完成");
    } catch (error) {
      common_vendor.index.__f__("error", "at utils/reminder.js:51", "清理通知失败:", error);
    }
  }
  /**
   * 创建本地通知（支持多个提醒时间）
   */
  createLocalNotification(rawEvent) {
    return new Promise((resolve) => {
      const event = rawEvent && rawEvent.data ? rawEvent.data : rawEvent;
      if (!event || !event.title || !event.startDate) {
        common_vendor.index.__f__("warn", "at utils/reminder.js:65", "数据不完整，忽略提醒设置");
        return resolve();
      }
      const startTime = this.parseEventDateTime(event);
      if (!startTime) {
        common_vendor.index.__f__("warn", "at utils/reminder.js:72", "无法解析日程时间");
        return resolve();
      }
      const now = Date.now();
      if (startTime <= now) {
        common_vendor.index.__f__("log", "at utils/reminder.js:80", "⏰ 过去日程，不设置提醒:", event.title);
        return resolve();
      }
      let reminderMinutes = 15;
      if (event.reminderMinutes !== void 0) {
        reminderMinutes = event.reminderMinutes;
      }
      let reminderTime = startTime - reminderMinutes * 60 * 1e3;
      const minReminderTime = now + 1e4;
      if (reminderTime <= now) {
        reminderTime = Math.max(minReminderTime, now + 5e3);
        common_vendor.index.__f__("log", "at utils/reminder.js:100", `⏱️ 提醒时间已过，调整为立即提醒: "${event.title}"`);
      }
      common_vendor.index.__f__("log", "at utils/reminder.js:200", "微信小程序暂不支持本地通知");
      resolve();
    });
  }
  /**
   * 获取提醒时间文本
   */
  getReminderTimeText(minutes) {
    if (minutes === 0)
      return "准时";
    if (minutes < 60)
      return `${minutes}分钟前`;
    if (minutes < 1440)
      return `${Math.floor(minutes / 60)}小时前`;
    if (minutes < 10080)
      return `${Math.floor(minutes / 1440)}天前`;
    return `${Math.floor(minutes / 10080)}周前`;
  }
  /**
   * 解析事件日期时间
   */
  parseEventDateTime(event) {
    try {
      const dateStr = event.startDate.replace(/-/g, "/");
      if (event.isAllDay === true) {
        return new Date(dateStr).getTime();
      }
      const timeStr = event.startTime || "00:00";
      return (/* @__PURE__ */ new Date(`${dateStr} ${timeStr}`)).getTime();
    } catch (e) {
      common_vendor.index.__f__("error", "at utils/reminder.js:233", "日期时间解析失败:", e);
      return null;
    }
  }
  /**
   * 检查日程是否已经过去
   */
  isEventInPast(event) {
    try {
      const eventTime = this.parseEventDateTime(event);
      if (!eventTime)
        return true;
      return eventTime <= Date.now();
    } catch (e) {
      common_vendor.index.__f__("error", "at utils/reminder.js:248", "检查日程时间失败:", e);
      return true;
    }
  }
  /**
   * 清除特定事件的所有提醒
   */
  cancelNotification(eventId = null) {
  }
  /**
   * 为事件设置多个提醒
   */
  async setupMultipleReminders(event, reminderMinutesArray) {
    if (!reminderMinutesArray || !Array.isArray(reminderMinutesArray)) {
      common_vendor.index.__f__("warn", "at utils/reminder.js:279", "无效的提醒时间数组");
      return;
    }
    const now = Date.now();
    const startTime = this.parseEventDateTime(event);
    if (!startTime || startTime <= now) {
      common_vendor.index.__f__("log", "at utils/reminder.js:287", "⏰ 过去日程，不设置提醒");
      return;
    }
    common_vendor.index.__f__("log", "at utils/reminder.js:291", `📅 为日程 "${event.title}" 设置 ${reminderMinutesArray.length} 个提醒`);
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
    if ("Notification" in window) {
      if (Notification.permission === "default") {
        await Notification.requestPermission();
      }
      if (Notification.permission === "granted") {
        const now = Date.now();
        const delay = reminderTime - now;
        if (delay > 0) {
          setTimeout(() => {
            const timeText = this.getReminderTimeText(reminderMinutes);
            new Notification(`${timeText}提醒`, {
              body: `${event.title}
开始时间: ${new Date(this.parseEventDateTime(event)).toLocaleString()}`,
              icon: "/static/logo.png"
            });
            common_vendor.index.__f__("log", "at utils/reminder.js:324", `🔔 触发${timeText}浏览器通知: ${event.title}`);
          }, delay);
        } else {
          const timeText = this.getReminderTimeText(reminderMinutes);
          new Notification(`${timeText}提醒`, {
            body: `${event.title}
开始时间: ${new Date(this.parseEventDateTime(event)).toLocaleString()}`
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
          id,
          eventId: notification.eventId,
          title: notification.title,
          reminderText: this.getReminderTimeText(notification.reminderMinutes),
          reminderTime: new Date(notification.reminderTime).toLocaleString(),
          starts: new Date(notification.startTime).toLocaleString(),
          secondsLeft: Math.round(timeLeft / 1e3),
          minutesLeft: Math.round(timeLeft / 6e4)
        });
      } else {
        past.push({
          id,
          eventId: notification.eventId,
          title: notification.title,
          reminderText: this.getReminderTimeText(notification.reminderMinutes)
        });
      }
    }
    return {
      upcoming,
      past,
      total: this.notifications.size
    };
  }
  /**
   * 清除所有提醒跟踪记录
   */
  clearAllNotifications() {
    this.notifications.clear();
    common_vendor.index.__f__("log", "at utils/reminder.js:380", "🗑️ 已清除所有提醒跟踪记录");
  }
}
const reminderService = new ReminderService();
exports.reminderService = reminderService;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/reminder.js.map
