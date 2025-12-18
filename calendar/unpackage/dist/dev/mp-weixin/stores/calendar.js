"use strict";
const common_vendor = require("../common/vendor.js");
const useCalendarStore = common_vendor.defineStore("calendar", () => {
  const pageTitle = common_vendor.ref("我的日历");
  const currentView = common_vendor.ref("month");
  const selectedDate = common_vendor.ref(common_vendor.hooks());
  const events = common_vendor.ref([]);
  const loading = common_vendor.ref(false);
  const debugInfo = common_vendor.ref("");
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
        // 农历或节日
        isCurrentMonth: day.isSame(selectedDate.value, "month"),
        isToday: day.isSame(common_vendor.hooks(), "day"),
        isSelected: day.isSame(selectedDate.value, "day")
      });
      day.add(1, "day");
    }
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
        date: day.date()
      });
    }
    return days;
  });
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
    loadEvents();
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
    loadEvents();
  };
  const goToToday = () => {
    selectedDate.value = common_vendor.hooks();
    loadEvents();
  };
  const selectDate = (date) => {
    selectedDate.value = date.clone();
    if (currentView.value === "month") {
      currentView.value = "day";
    }
    loadEvents();
  };
  const getTimeEventsForDay = (date) => {
    const dateStr = date.format("YYYY-MM-DD");
    return events.value.filter(
      (event) => event.startDate === dateStr || event.endDate === dateStr || event.startDate <= dateStr && event.endDate >= dateStr
    );
  };
  const getEventsForDayAndTime = (date, time) => {
    const dateStr = date.format("YYYY-MM-DD");
    return events.value.filter((event) => {
      const dateMatch = event.startDate === dateStr || event.endDate === dateStr || event.startDate <= dateStr && event.endDate >= dateStr;
      if (!dateMatch)
        return false;
      if (event.startTime && event.endTime) {
        return time >= event.startTime && time < event.endTime;
      }
      return false;
    });
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
      debugLog.push("\n🔍 测试4: 数据格式分析");
      if (eventsResult.responseData) {
        debugLog.push(`📊 响应数据Keys: ${Object.keys(eventsResult.responseData).join(", ")}`);
        if (Array.isArray(eventsResult.responseData)) {
          debugLog.push("✅ 数据格式: 直接数组");
        } else if (eventsResult.responseData.data) {
          debugLog.push("✅ 数据格式: 包含data字段的对象");
        } else if (eventsResult.responseData.events) {
          debugLog.push("✅ 数据格式: 包含events字段的对象");
        } else {
          debugLog.push("❓ 数据格式: 未知格式");
        }
      }
      debugLog.push("\n🎯 ===== 调试完成 =====");
    } catch (error) {
      debugLog.push(`❌ 调试过程中出错: ${error.message}`);
    }
    common_vendor.index.__f__("log", "at stores/calendar.js:277", debugLog.join("\n"));
    debugInfo.value = debugLog.join("\n");
    return debugLog;
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
          // 使用动态头部
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
          // 使用动态头部
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
  const loadEvents = async () => {
    try {
      loading.value = true;
      const baseURL = getBaseURL();
      const url = baseURL + "/api/events?userId=default-user";
      common_vendor.index.__f__("log", "at stores/calendar.js:386", "🌐 请求日程数据:", url);
      common_vendor.index.__f__("log", "at stores/calendar.js:387", "📋 请求头:", getRequestHeaders());
      common_vendor.index.__f__("log", "at stores/calendar.js:388", "🌍 当前环境:", isNgrokEnvironment() ? "Ngrok" : "本地");
      const response = await new Promise((resolve, reject) => {
        common_vendor.index.request({
          url,
          method: "GET",
          timeout: 3e4,
          header: getRequestHeaders(),
          // 使用动态头部
          success: (res) => resolve(res),
          fail: (err) => reject(err)
        });
      });
      const contentType = response.header && response.header["Content-Type"];
      if (contentType && contentType.includes("text/html")) {
        throw new Error("服务器返回了HTML页面而不是JSON数据，请检查ngrok配置");
      }
      const { statusCode, responseData } = handleUniResponse(response);
      common_vendor.index.__f__("log", "at stores/calendar.js:409", "📡 响应状态:", statusCode);
      common_vendor.index.__f__("log", "at stores/calendar.js:410", "📦 响应数据:", responseData);
      if (statusCode === 200) {
        if (Array.isArray(responseData)) {
          events.value = responseData;
        } else if (responseData && Array.isArray(responseData.data)) {
          events.value = responseData.data;
        } else if (responseData && Array.isArray(responseData.events)) {
          events.value = responseData.events;
        } else {
          common_vendor.index.__f__("warn", "at stores/calendar.js:421", "⚠️ 无法识别的数据格式");
          events.value = [];
        }
        common_vendor.index.__f__("log", "at stores/calendar.js:425", `✅ 成功加载 ${events.value.length} 个日程`);
      } else {
        throw new Error(`HTTP错误: ${statusCode}`);
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at stores/calendar.js:430", "❌ 加载事件失败:", error);
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
          // 使用动态头部
          timeout: 1e4,
          success: (res) => resolve(res),
          fail: (err) => reject(err)
        });
      });
      const { statusCode, responseData } = handleUniResponse(response);
      if (statusCode === 200 || statusCode === 201) {
        if (responseData) {
          await loadEvents();
          return responseData.data || responseData;
        } else {
          throw new Error("创建日程失败: 响应数据为空");
        }
      } else {
        throw new Error(`HTTP错误: ${statusCode}`);
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at stores/calendar.js:475", "❌ 创建事件失败:", error);
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
          // 使用动态头部
          timeout: 1e4,
          success: (res) => resolve(res),
          fail: (err) => reject(err)
        });
      });
      const { statusCode, responseData } = handleUniResponse(response);
      if (statusCode === 200) {
        if (responseData) {
          await loadEvents();
          return responseData.data || responseData;
        } else {
          throw new Error("更新日程失败: 响应数据为空");
        }
      } else {
        throw new Error(`HTTP错误: ${statusCode}`);
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at stores/calendar.js:510", "❌ 更新事件失败:", error);
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
          // 使用动态头部
          timeout: 1e4,
          success: (res) => resolve(res),
          fail: (err) => reject(err)
        });
      });
      const { statusCode, responseData } = handleUniResponse(response);
      if (statusCode === 200) {
        if (responseData) {
          await loadEvents();
        } else {
          throw new Error("删除日程失败: 响应数据为空");
        }
      } else {
        throw new Error(`HTTP错误: ${statusCode}`);
      }
    } catch (error) {
      common_vendor.index.__f__("error", "at stores/calendar.js:543", "❌ 删除事件失败:", error);
      throw error;
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
  };
});
exports.useCalendarStore = useCalendarStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/stores/calendar.js.map
