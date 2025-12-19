"use strict";
const common_vendor = require("../common/vendor.js");
class ReminderService {
  constructor() {
    this.initialized = false;
  }
  // 初始化提醒服务
  async init() {
    if (this.initialized)
      return;
    try {
      this.initialized = true;
    } catch (error) {
      common_vendor.index.__f__("error", "at utils/reminder.js:23", "❌ 提醒服务初始化失败:", error);
    }
  }
  // 创建本地通知
  createLocalNotification(event) {
    return new Promise((resolve, reject) => {
    });
  }
  // H5环境下的通知
  async createH5Notification(event) {
    if (!("Notification" in window)) {
      throw new Error("浏览器不支持通知功能");
    }
    if (Notification.permission === "default") {
      await Notification.requestPermission();
    }
    if (Notification.permission === "granted") {
      const reminderTime = this.calculateReminderTime(event) - Date.now();
      if (reminderTime > 0) {
        setTimeout(() => {
          const notification = new Notification("日程提醒", {
            body: `${event.title} 即将开始`,
            icon: "/static/logo.png",
            tag: event._id
          });
          notification.onclick = function() {
            window.focus();
            notification.close();
          };
        }, reminderTime);
      }
    }
  }
  // 计算提醒时间
  calculateReminderTime(event) {
    const startDateTime = /* @__PURE__ */ new Date(`${event.startDate} ${event.startTime || "00:00"}`);
    const reminderMinutes = event.reminders && event.reminders.length > 0 ? event.reminders[0] : 15;
    return startDateTime.getTime() - reminderMinutes * 60 * 1e3;
  }
  // 取消通知
  cancelNotification(eventId) {
  }
  // 检查并设置提醒
  async scheduleEventReminders(events) {
    await this.init();
    const now = Date.now();
    const futureEvents = events.filter((event) => {
      const eventTime = (/* @__PURE__ */ new Date(`${event.startDate} ${event.startTime || "00:00"}`)).getTime();
      return eventTime > now && !event.hasReminded;
    });
    for (const event of futureEvents) {
      try {
        await this.createLocalNotification(event);
      } catch (error) {
        common_vendor.index.__f__("error", "at utils/reminder.js:132", "❌ 设置提醒失败:", event.title, error);
      }
    }
  }
}
const reminderService = new ReminderService();
exports.reminderService = reminderService;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/reminder.js.map
