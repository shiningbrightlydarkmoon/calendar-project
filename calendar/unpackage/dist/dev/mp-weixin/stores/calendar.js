"use strict";
const common_vendor = require("../common/vendor.js");
const utils_reminder = require("../utils/reminder.js");
const useCalendarStore = common_vendor.defineStore("calendar", () => {
  const pageTitle = common_vendor.ref("我的日历");
  const currentView = common_vendor.ref("month");
  const selectedDate = common_vendor.ref(common_vendor.hooks());
  const events = common_vendor.ref([]);
  const loading = common_vendor.ref(false);
  const debugInfo = common_vendor.ref("");
  const isFetching = common_vendor.ref(false);
  const lastMonthKey = common_vendor.ref("");
  const cachedMonthData = common_vendor.ref(null);
  const eventsCache = common_vendor.ref({});
  const lastFetchTime = common_vendor.ref(0);
  const colorOptions = common_vendor.ref([
    "#2979ff",
    "#f56c6c",
    "#67c23a",
    "#e6a23c",
    "#909399",
    "#ff85c0",
    "#5cdbd3",
    "#b37feb"
  ]);
  const reminderOptions = common_vendor.ref([
    { label: "准时", value: 0 },
    { label: "5分钟前", value: 5 },
    { label: "10分钟前", value: 10 },
    { label: "15分钟前", value: 15 },
    { label: "30分钟前", value: 30 },
    { label: "1小时前", value: 60 },
    { label: "2小时前", value: 120 },
    { label: "1天前", value: 1440 },
    { label: "2天前", value: 2880 },
    { label: "1周前", value: 10080 }
  ]);
  const getBaseURL = () => {
    return "https://oozy-moaningly-macy.ngrok-free.dev";
  };
  const isNgrokEnvironment = () => {
    const baseURL = getBaseURL();
    return baseURL.includes("ngrok-free.dev") || baseURL.includes("ngrok.io");
  };
  const getRequestHeaders = () => {
    const headers = {
      "Content-Type": "application/json"
    };
    if (isNgrokEnvironment()) {
      headers["ngrok-skip-browser-warning"] = "true";
      headers["X-Requested-With"] = "XMLHttpRequest";
    }
    return headers;
  };
  const displayDate = common_vendor.computed(() => {
    switch (currentView.value) {
      case "month":
        return selectedDate.value.format("YYYY年MM月");
      case "week":
        const startOfWeek = selectedDate.value.clone().startOf("week");
        const endOfWeek = selectedDate.value.clone().endOf("week");
        return `${startOfWeek.format("MM月DD日")} - ${endOfWeek.format("MM月DD日")}`;
      case "day":
        return selectedDate.value.format("YYYY年MM月DD日");
      default:
        return selectedDate.value.format("YYYY年MM月");
    }
  });
  const monthDays = common_vendor.computed(() => {
    const currentMonthKey = selectedDate.value.format("YYYY-MM");
    if (currentMonthKey === lastMonthKey.value && cachedMonthData.value) {
      return cachedMonthData.value;
    }
    const startDay = selectedDate.value.clone().startOf("month").startOf("week");
    const endDay = selectedDate.value.clone().endOf("month").endOf("week");
    const days = [];
    let day = startDay.clone();
    while (day.isBefore(endDay, "day") || day.isSame(endDay, "day")) {
      const solar = common_vendor.lunarJavascript.Solar.fromYmd(day.year(), day.month() + 1, day.date());
      const lunar = solar.getLunar();
      let lunarText = lunar.getDayInChinese();
      if (lunar.getDay() === 1)
        lunarText = lunar.getMonthInChinese() + "月";
      const festival = lunar.getFestivals()[0] || lunar.getOtherFestivals()[0];
      days.push({
        date: day.clone(),
        day: day.date(),
        lunarDay: festival || lunarText,
        isCurrentMonth: day.isSame(selectedDate.value, "month"),
        isToday: day.isSame(common_vendor.hooks(), "day"),
        isSelected: day.isSame(selectedDate.value, "day"),
        dateStr: day.format("YYYY-MM-DD")
      });
      day.add(1, "day");
    }
    lastMonthKey.value = currentMonthKey;
    cachedMonthData.value = days;
    return days;
  });
  const weekDays = common_vendor.computed(() => {
    const startOfWeek = selectedDate.value.clone().startOf("week");
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = startOfWeek.clone().add(i, "days");
      days.push({
        fullDate: day,
        weekday: ["日", "一", "二", "三", "四", "五", "六"][i],
        date: day.date(),
        dateStr: day.format("YYYY-MM-DD")
      });
    }
    return days;
  });
  const buildEventsCache = () => {
    eventsCache.value = {};
    events.value.forEach((event) => {
      const startMoment = common_vendor.hooks(event.startDate);
      const endMoment = common_vendor.hooks(event.endDate);
      let current = startMoment.clone();
      while (current.isSameOrBefore(endMoment, "day")) {
        const dateStr = current.format("YYYY-MM-DD");
        if (!eventsCache.value[dateStr]) {
          eventsCache.value[dateStr] = [];
        }
        eventsCache.value[dateStr].push(event);
        current.add(1, "day");
      }
    });
  };
  const getTimeEventsForDay = (date) => {
    const dateStr = common_vendor.hooks(date).format("YYYY-MM-DD");
    return eventsCache.value[dateStr] || [];
  };
  const getEventsForTimeSlot = (date, time) => {
    const dateStr = common_vendor.hooks(date).format("YYYY-MM-DD");
    const eventsForDate = eventsCache.value[dateStr] || [];
    return eventsForDate.filter((event) => {
      const isSingleDay = event.startDate === event.endDate;
      const isNotAllDay = !event.isAllDay;
      const timeMatch = time >= event.startTime && time < event.endTime;
      return isSingleDay && isNotAllDay && event.startDate === dateStr && timeMatch;
    });
  };
  const getLongEventsForDay = (date) => {
    const dateStr = common_vendor.hooks(date).format("YYYY-MM-DD");
    const eventsForDate = eventsCache.value[dateStr] || [];
    return eventsForDate.filter((event) => {
      const isMultiDay = event.startDate !== event.endDate;
      const isAllDay = event.isAllDay === true;
      const isWithinRange = dateStr >= event.startDate && dateStr <= event.endDate;
      return (isMultiDay || isAllDay) && isWithinRange;
    });
  };
  const switchView = (view) => {
    currentView.value = view;
  };
  const previousPeriod = () => {
    switch (currentView.value) {
      case "month":
        selectedDate.value = selectedDate.value.clone().subtract(1, "month");
        break;
      case "week":
        selectedDate.value = selectedDate.value.clone().subtract(1, "week");
        break;
      case "day":
        selectedDate.value = selectedDate.value.clone().subtract(1, "day");
        break;
    }
  };
  const nextPeriod = () => {
    switch (currentView.value) {
      case "month":
        selectedDate.value = selectedDate.value.clone().add(1, "month");
        break;
      case "week":
        selectedDate.value = selectedDate.value.clone().add(1, "week");
        break;
      case "day":
        selectedDate.value = selectedDate.value.clone().add(1, "day");
        break;
    }
  };
  const goToToday = () => {
    selectedDate.value = common_vendor.hooks();
  };
  const selectDate = (date) => {
    selectedDate.value = date.clone();
  };
  const loadEventsSilently = async () => {
    if (isFetching.value)
      return;
    const now = Date.now();
    if (now - lastFetchTime.value < 2e3) {
      return;
    }
    try {
      isFetching.value = true;
      lastFetchTime.value = now;
      const baseURL = getBaseURL();
      const url = baseURL + "/api/events?userId=default-user";
      const response = await new Promise((resolve, reject) => {
        common_vendor.index.request({
          url,
          method: "GET",
          timeout: 1e4,
          header: getRequestHeaders(),
          success: (res) => resolve(res),
          fail: (err) => reject(err)
        });
      });
      const { statusCode, responseData } = handleUniResponse(response);
      if (statusCode === 200) {
        let newEvents = [];
        if (Array.isArray(responseData)) {
          newEvents = responseData;
        } else if (responseData && Array.isArray(responseData.data)) {
          newEvents = responseData.data;
        } else if (responseData && Array.isArray(responseData.events)) {
          newEvents = responseData.events;
        }
        if (JSON.stringify(events.value) !== JSON.stringify(newEvents)) {
          events.value = newEvents;
          buildEventsCache();
          common_vendor.index.__f__("log", "at stores/calendar.js:294", `✅ 静默更新 ${newEvents.length} 个日程`);
        }
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at stores/calendar.js:298", "静默加载失败:", error);
    } finally {
      isFetching.value = false;
    }
  };
  const loadEvents = async () => {
    try {
      loading.value = true;
      const baseURL = getBaseURL();
      const url = baseURL + "/api/events?userId=default-user";
      common_vendor.index.__f__("log", "at stores/calendar.js:312", "请求日程数据:", url);
      common_vendor.index.__f__("log", "at stores/calendar.js:313", "请求头:", getRequestHeaders());
      common_vendor.index.__f__("log", "at stores/calendar.js:314", "当前环境:", isNgrokEnvironment() ? "Ngrok" : "本地");
      const response = await new Promise((resolve, reject) => {
        common_vendor.index.request({
          url,
          method: "GET",
          timeout: 3e4,
          header: getRequestHeaders(),
          success: (res) => resolve(res),
          fail: (err) => reject(err)
        });
      });
      const contentType = response.header && response.header["Content-Type"];
      if (contentType && contentType.includes("text/html")) {
        throw new Error("服务器返回了HTML页面而不是JSON数据，请检查ngrok配置");
      }
      const { statusCode, responseData } = handleUniResponse(response);
      common_vendor.index.__f__("log", "at stores/calendar.js:335", "响应状态:", statusCode);
      common_vendor.index.__f__("log", "at stores/calendar.js:336", "响应数据:", responseData);
      if (statusCode === 200) {
        let newEvents = [];
        if (Array.isArray(responseData)) {
          newEvents = responseData;
        } else if (responseData && Array.isArray(responseData.data)) {
          newEvents = responseData.data;
        } else if (responseData && Array.isArray(responseData.events)) {
          newEvents = responseData.events;
        } else {
          common_vendor.index.__f__("warn", "at stores/calendar.js:348", "无法识别的数据格式");
          newEvents = [];
        }
        events.value = newEvents;
        buildEventsCache();
        common_vendor.index.__f__("log", "at stores/calendar.js:354", `成功加载 ${events.value.length} 个日程`);
      } else {
        throw new Error(`HTTP错误: ${statusCode}`);
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at stores/calendar.js:359", "加载事件失败:", error);
      common_vendor.index.showToast({
        title: "加载失败: " + error.message,
        icon: "none",
        duration: 4e3
      });
      events.value = [];
    } finally {
      loading.value = false;
    }
  };
  const startSilentRefresh = () => {
    common_vendor.index.__f__("log", "at stores/calendar.js:373", "⏰ 启动静默刷新");
    setInterval(() => {
      if (!loading.value) {
        loadEventsSilently();
      }
    }, 5 * 60 * 1e3);
  };
  const createEvent = async (eventData) => {
    try {
      const baseURL = getBaseURL();
      const url = baseURL + "/api/events";
      const response = await new Promise((resolve, reject) => {
        common_vendor.index.request({
          url,
          method: "POST",
          data: {
            ...eventData,
            userId: "default-user"
          },
          header: getRequestHeaders(),
          timeout: 1e4,
          success: (res) => resolve(res),
          fail: (err) => reject(err)
        });
      });
      const { statusCode, responseData } = handleUniResponse(response);
      if (statusCode === 200 || statusCode === 201) {
        if (!responseData) {
          throw new Error("创建日程失败: 响应数据为空");
        }
        const result = responseData.data || responseData;
        setTimeout(() => {
          loadEventsSilently();
        }, 500);
        if (eventData.reminders && eventData.reminders.length > 0) {
          common_vendor.index.__f__("log", "at stores/calendar.js:432", `📅 为日程 "${result.title}" 设置 ${eventData.reminders.length} 个提醒`);
          for (const reminderMinutes of eventData.reminders) {
            const reminderResult = {
              ...result,
              reminderMinutes
            };
            await utils_reminder.reminderService.createLocalNotification(reminderResult);
          }
        } else {
          common_vendor.index.__f__("log", "at stores/calendar.js:444", "⏰ 未设置提醒");
        }
        return result;
      } else {
        throw new Error(`HTTP错误: ${statusCode}`);
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at stores/calendar.js:452", "创建事件失败:", error);
      throw error;
    }
  };
  const updateEvent = async (eventId, eventData) => {
    try {
      const baseURL = getBaseURL();
      const url = baseURL + `/api/events/${eventId}`;
      const response = await new Promise((resolve, reject) => {
        common_vendor.index.request({
          url,
          method: "PUT",
          data: eventData,
          header: getRequestHeaders(),
          timeout: 1e4,
          success: (res) => resolve(res),
          fail: (err) => reject(err)
        });
      });
      const { statusCode, responseData } = handleUniResponse(response);
      utils_reminder.reminderService.cancelNotification(eventId);
      if (eventData.reminders && eventData.reminders.length > 0) {
        common_vendor.index.__f__("log", "at stores/calendar.js:481", `📅 更新日程提醒，设置 ${eventData.reminders.length} 个提醒`);
        const updatedEvent = { ...eventData, _id: eventId };
        for (const reminderMinutes of eventData.reminders) {
          const reminderEvent = {
            ...updatedEvent,
            reminderMinutes
          };
          await utils_reminder.reminderService.createLocalNotification(reminderEvent);
        }
      }
      setTimeout(() => {
        loadEventsSilently();
      }, 500);
      if (statusCode === 200) {
        if (responseData) {
          return responseData.data || responseData;
        } else {
          throw new Error("更新日程失败: 响应数据为空");
        }
      } else {
        throw new Error(`HTTP错误: ${statusCode}`);
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at stores/calendar.js:511", "更新事件失败:", error);
      throw error;
    }
  };
  const deleteEvent = async (eventId) => {
    try {
      const baseURL = getBaseURL();
      const url = baseURL + `/api/events/${eventId}`;
      const response = await new Promise((resolve, reject) => {
        common_vendor.index.request({
          url,
          method: "DELETE",
          header: getRequestHeaders(),
          timeout: 1e4,
          success: (res) => resolve(res),
          fail: (err) => reject(err)
        });
      });
      const { statusCode, responseData } = handleUniResponse(response);
      utils_reminder.reminderService.cancelNotification(eventId);
      setTimeout(() => {
        loadEventsSilently();
      }, 500);
      if (statusCode === 200) {
        if (responseData) {
          return responseData.data || responseData;
        } else {
          throw new Error("删除日程失败: 响应数据为空");
        }
      } else {
        throw new Error(`HTTP错误: ${statusCode}`);
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at stores/calendar.js:552", "删除事件失败:", error);
      throw error;
    }
  };
  const handleUniResponse = (response) => {
    let statusCode, responseData;
    statusCode = response.statusCode;
    responseData = response.data;
    if (statusCode === void 0) {
      statusCode = response.statusCode || response.status;
      responseData = response.data || response;
    }
    return { statusCode, responseData };
  };
  const debugSystem = async () => {
    const debugLog = [];
    const baseURL = getBaseURL();
    debugLog.push("🚀 ===== 开始系统调试 =====");
    debugLog.push(`📍 基础URL: ${baseURL}`);
    debugLog.push(`🕐 调试时间: ${(/* @__PURE__ */ new Date()).toLocaleString()}`);
    debugLog.push(`🌐 当前环境: ${isNgrokEnvironment() ? "Ngrok环境" : "本地环境"}`);
    debugLog.push("📱 运行环境: 微信小程序");
    try {
      debugLog.push("\n🔗 测试1: 健康检查接口");
      const healthResult = await testHealth();
      debugLog.push(`✅ 健康检查: ${healthResult.success ? "成功" : "失败"}`);
      debugLog.push(`📊 响应数据: ${JSON.stringify(healthResult.data)}`);
      debugLog.push("\n🌐 测试2: 网络连接测试");
      const networkResult = await testNetwork();
      debugLog.push(`📶 网络类型: ${networkResult.networkType}`);
      debugLog.push("\n📅 测试3: 事件API测试");
      const eventsResult = await testEventsAPI();
      debugLog.push(`📡 API状态码: ${eventsResult.statusCode}`);
      debugLog.push(`📦 原始数据格式: ${typeof eventsResult.responseData}`);
      debugLog.push(`🔢 解析后事件数量: ${eventsResult.parsedData.length}`);
      debugLog.push("\n🔔 测试4: 提醒服务状态");
      const reminders = utils_reminder.reminderService.getAllScheduledNotifications();
      debugLog.push(`📊 提醒总数: ${reminders.total}`);
      debugLog.push(`⏳ 即将触发: ${reminders.upcoming.length}`);
      debugLog.push(`✅ 已触发: ${reminders.past.length}`);
      debugLog.push("\n🎯 ===== 调试完成 =====");
    } catch (error) {
      debugLog.push(`❌ 调试过程中出错: ${error.message}`);
    }
    common_vendor.index.__f__("log", "at stores/calendar.js:632", debugLog.join("\n"));
    debugInfo.value = debugLog.join("\n");
    return debugLog;
  };
  const debugReminders = () => {
    common_vendor.index.__f__("log", "at stores/calendar.js:640", "🔔 当前所有提醒:");
    const reminders = utils_reminder.reminderService.getAllScheduledNotifications();
    common_vendor.index.__f__("log", "at stores/calendar.js:642", `总计: ${reminders.total} 个提醒`);
    if (reminders.upcoming.length > 0) {
      common_vendor.index.__f__("log", "at stores/calendar.js:645", "⏳ 即将触发的提醒:");
      reminders.upcoming.forEach((reminder) => {
        common_vendor.index.__f__("log", "at stores/calendar.js:647", `  📅 ${reminder.title} - ${reminder.reminderText} (${reminder.minutesLeft}分钟后)`);
      });
    }
    if (reminders.past.length > 0) {
      common_vendor.index.__f__("log", "at stores/calendar.js:652", "✅ 已触发的提醒:");
      reminders.past.forEach((reminder) => {
        common_vendor.index.__f__("log", "at stores/calendar.js:654", `  📅 ${reminder.title} - ${reminder.reminderText}`);
      });
    }
  };
  const testHealth = async () => {
    try {
      const baseURL = getBaseURL();
      const url = baseURL + "/health";
      const response = await new Promise((resolve, reject) => {
        common_vendor.index.request({
          url,
          method: "GET",
          timeout: 1e4,
          header: getRequestHeaders(),
          success: (res) => resolve(res),
          fail: (err) => reject(err)
        });
      });
      const { statusCode, responseData } = handleUniResponse(response);
      return {
        success: statusCode === 200,
        statusCode,
        data: responseData
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  };
  const testNetwork = async () => {
    return new Promise((resolve) => {
      common_vendor.index.getNetworkType({
        success: (res) => {
          resolve({
            success: true,
            networkType: res.networkType
          });
        },
        fail: (err) => {
          resolve({
            success: false,
            error: err.errMsg
          });
        }
      });
    });
  };
  const testEventsAPI = async () => {
    try {
      const baseURL = getBaseURL();
      const url = baseURL + "/api/events?userId=default-user";
      const response = await new Promise((resolve, reject) => {
        common_vendor.index.request({
          url,
          method: "GET",
          timeout: 15e3,
          header: getRequestHeaders(),
          success: (res) => resolve(res),
          fail: (err) => reject(err)
        });
      });
      const { statusCode, responseData } = handleUniResponse(response);
      let parsedData = [];
      if (Array.isArray(responseData)) {
        parsedData = responseData;
      } else if (responseData && Array.isArray(responseData.data)) {
        parsedData = responseData.data;
      } else if (responseData && Array.isArray(responseData.events)) {
        parsedData = responseData.events;
      }
      return {
        statusCode,
        responseData,
        parsedData,
        parsedCount: parsedData.length
      };
    } catch (error) {
      return {
        error: error.message
      };
    }
  };
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
  };
});
exports.useCalendarStore = useCalendarStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/stores/calendar.js.map
