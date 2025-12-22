"use strict";
const common_vendor = require("../common/vendor.js");
class ReminderService {
  constructor() {
    this.initialized = false;
  }
  /**
   * 初始化提醒服务
   * 在 App.vue 的 onLaunch 中调用，确保申请到系统通知权限
   */
  async init() {
    if (this.initialized)
      return;
    this.initialized = true;
  }
  /**
   * 创建本地通知
   * @param {Object} rawEvent - 日程数据（自动兼容包含 data 字段的对象）
   */
  createLocalNotification(rawEvent) {
    return new Promise((resolve) => {
      const event = rawEvent && rawEvent.data ? rawEvent.data : rawEvent;
      if (!event || !event.title || !event.startDate) {
        common_vendor.index.__f__("warn", "at utils/reminder.js:43", "⚠️ [Reminder] 数据不完整，忽略提醒设置:", {
          receivedData: event,
          hasTitle: !!(event == null ? void 0 : event.title),
          hasStartDate: !!(event == null ? void 0 : event.startDate)
        });
        return resolve();
      }
      resolve();
    });
  }
  /**
   * 计算提醒时间：默认提前 15 分钟
   */
  calculateReminderTime(event) {
    try {
      const dateStr = event.startDate.replace(/-/g, "/");
      const timeStr = event.startTime || "00:00";
      const startDateTime = /* @__PURE__ */ new Date(`${dateStr} ${timeStr}`);
      const advanceMS = 15 * 60 * 1e3;
      return startDateTime.getTime() - advanceMS;
    } catch (e) {
      common_vendor.index.__f__("error", "at utils/reminder.js:115", "❌ [Reminder] 时间解析出错:", e);
      return Date.now() + 5e3;
    }
  }
  /**
   * 清除所有本地通知记录
   */
  cancelNotification() {
  }
  /**
   * H5 浏览器通知实现
   */
  async createH5Notification(event, reminderTime) {
    if ("Notification" in window && Notification.permission === "granted") {
      const delay = reminderTime - Date.now();
      if (delay > 0) {
        setTimeout(() => {
          new Notification("日程提醒", { body: event.title });
        }, delay);
      }
    }
  }
}
const reminderService = new ReminderService();
exports.reminderService = reminderService;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/reminder.js.map
