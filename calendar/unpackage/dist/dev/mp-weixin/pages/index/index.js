"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_calendar = require("../../stores/calendar.js");
const utils_reminder = require("../../utils/reminder.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const calendarStore = stores_calendar.useCalendarStore();
    const showEventModal = common_vendor.ref(false);
    const isEditing = common_vendor.ref(false);
    const editingEventId = common_vendor.ref(null);
    const autoFocusTitle = common_vendor.ref(false);
    const timeColumnRef = common_vendor.ref(null);
    const daysContentRef = common_vendor.ref(null);
    const eventForm = common_vendor.reactive({
      title: "",
      startDate: common_vendor.hooks().format("YYYY-MM-DD"),
      startTime: "09:00",
      endDate: common_vendor.hooks().format("YYYY-MM-DD"),
      endTime: "10:00",
      color: "#2979ff",
      notes: "",
      isAllDay: false,
      reminders: []
    });
    const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
    const timeSlots = Array.from(
      { length: 24 },
      (_, i) => `${i.toString().padStart(2, "0")}:00`
    );
    const monthDayEvents = common_vendor.computed(() => {
      if (calendarStore.currentView !== "month")
        return {};
      const eventsMap = {};
      calendarStore.monthDays.forEach((day) => {
        const dateStr = day.dateStr;
        if (dateStr) {
          const dayEvents = calendarStore.getTimeEventsForDay(day.date).slice(0, 3);
          eventsMap[dateStr] = dayEvents;
        }
      });
      return eventsMap;
    });
    const sortedReminders = common_vendor.computed(() => {
      return [...eventForm.reminders].sort((a, b) => a - b);
    });
    const toggleReminder = (value) => {
      const index = eventForm.reminders.indexOf(value);
      if (index === -1) {
        eventForm.reminders.push(value);
        eventForm.reminders.sort((a, b) => a - b);
      } else {
        eventForm.reminders.splice(index, 1);
      }
    };
    const clearReminders = () => {
      eventForm.reminders = [];
    };
    const getReminderLabel = (minutes) => {
      const option = calendarStore.reminderOptions.find((opt) => opt.value === minutes);
      return option ? option.label : `${minutes}分钟前`;
    };
    const handleSwitchView = (view) => {
      const oldView = calendarStore.currentView;
      calendarStore.switchView(view);
      if (oldView !== view) {
        setTimeout(() => {
          calendarStore.loadEventsSilently();
        }, 300);
      }
    };
    const handlePreviousPeriod = () => {
      calendarStore.previousPeriod();
      setTimeout(() => {
        calendarStore.loadEventsSilently();
      }, 200);
    };
    const handleNextPeriod = () => {
      calendarStore.nextPeriod();
      setTimeout(() => {
        calendarStore.loadEventsSilently();
      }, 200);
    };
    const handleGoToToday = () => {
      calendarStore.goToToday();
      setTimeout(() => {
        calendarStore.loadEventsSilently();
      }, 200);
    };
    const handleSelectDate = (date) => {
      calendarStore.selectDate(date);
      setTimeout(() => {
        calendarStore.loadEventsSilently();
      }, 200);
    };
    const syncScroll = () => {
      const timeColumn = timeColumnRef.value;
      const daysContent = daysContentRef.value;
      if (timeColumn && daysContent) {
        daysContent.addEventListener("scroll", () => {
          timeColumn.scrollTop = daysContent.scrollTop;
        });
        timeColumn.addEventListener("scroll", () => {
          daysContent.scrollTop = timeColumn.scrollTop;
        });
      }
    };
    const getLimitedEventsForTimeSlot = (date, time) => {
      const events = calendarStore.getEventsForTimeSlot(date, time);
      return events.slice(0, 2);
    };
    const hasMoreEvents = (date, time) => {
      const events = calendarStore.getEventsForTimeSlot(date, time);
      return events.length > 2;
    };
    const getShortTitle = (title) => {
      if (title.length <= 6) {
        return title;
      }
      return title.substring(0, 6) + "...";
    };
    const handleViewMoreEvents = (date, time) => {
      const events = calendarStore.getEventsForTimeSlot(date, time);
      common_vendor.index.showActionSheet({
        title: `${common_vendor.hooks(date).format("MM月DD日")} ${time} 的事件`,
        itemList: events.map((event) => event.title),
        success: (res) => {
          const selectedEvent = events[res.tapIndex];
          handleViewEvent(selectedEvent);
        }
      });
    };
    const getEventsForTimeSlot = (date, time) => {
      return calendarStore.getEventsForTimeSlot(date, time);
    };
    const handleDateChange = (field, value) => {
      eventForm[field] = value;
      if (field === "startDate" && eventForm.startDate > eventForm.endDate) {
        eventForm.endDate = value;
      }
    };
    const handleTimeChange = (field, value) => {
      eventForm[field] = value;
      if (field === "startTime" && eventForm.startDate === eventForm.endDate && eventForm.startTime >= eventForm.endTime) {
        const [hours, minutes] = value.split(":").map(Number);
        const endMoment = /* @__PURE__ */ new Date();
        endMoment.setHours(hours + 1, minutes);
        eventForm.endTime = `${endMoment.getHours().toString().padStart(2, "0")}:${endMoment.getMinutes().toString().padStart(2, "0")}`;
      }
    };
    const handleAddEvent = () => {
      resetEventForm();
      showEventModal.value = true;
      isEditing.value = false;
      editingEventId.value = null;
      common_vendor.nextTick$1(() => {
        autoFocusTitle.value = true;
      });
    };
    const handleAddEventAtTime = (date, time) => {
      resetEventForm();
      const dateStr = common_vendor.hooks(date).format("YYYY-MM-DD");
      eventForm.startDate = dateStr;
      eventForm.endDate = dateStr;
      eventForm.startTime = time;
      const endTime = common_vendor.hooks(time, "HH:mm").add(1, "hour").format("HH:mm");
      eventForm.endTime = endTime;
      showEventModal.value = true;
      isEditing.value = false;
      common_vendor.nextTick$1(() => {
        autoFocusTitle.value = true;
      });
    };
    const handleViewEvent = (event) => {
      isEditing.value = true;
      editingEventId.value = event._id;
      eventForm.title = event.title;
      eventForm.startDate = event.startDate;
      eventForm.endDate = event.endDate;
      eventForm.startTime = event.startTime || "09:00";
      eventForm.endTime = event.endTime || "10:00";
      eventForm.color = event.color || "#2979ff";
      eventForm.notes = event.notes || "";
      eventForm.reminders = event.reminders || [];
      showEventModal.value = true;
      common_vendor.nextTick$1(() => {
        autoFocusTitle.value = true;
      });
    };
    const resetEventForm = () => {
      eventForm.title = "";
      eventForm.startDate = common_vendor.hooks(calendarStore.selectedDate).format("YYYY-MM-DD");
      eventForm.startTime = "09:00";
      eventForm.endDate = common_vendor.hooks(calendarStore.selectedDate).format("YYYY-MM-DD");
      eventForm.endTime = "10:00";
      eventForm.color = "#2979ff";
      eventForm.notes = "";
      eventForm.reminders = [];
      autoFocusTitle.value = false;
    };
    const handleSaveEvent = async () => {
      if (!eventForm.title.trim()) {
        common_vendor.index.showToast({
          title: "请输入日程标题",
          icon: "none"
        });
        return;
      }
      if (eventForm.startDate > eventForm.endDate) {
        common_vendor.index.showToast({
          title: "开始日期不能晚于结束日期",
          icon: "none"
        });
        return;
      }
      if (eventForm.startDate === eventForm.endDate && eventForm.startTime >= eventForm.endTime) {
        common_vendor.index.showToast({
          title: "开始时间不能晚于或等于结束时间",
          icon: "none"
        });
        return;
      }
      try {
        if (isEditing.value && editingEventId.value) {
          await calendarStore.updateEvent(editingEventId.value, eventForm);
          common_vendor.index.showToast({
            title: "日程已更新",
            icon: "success"
          });
        } else {
          await calendarStore.createEvent(eventForm);
          common_vendor.index.showToast({
            title: "日程已添加",
            icon: "success"
          });
        }
        closeEventModal();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:672", "保存日程失败:", error);
        common_vendor.index.showToast({
          title: error.message || "保存失败，请重试",
          icon: "none"
        });
      }
    };
    const handleDeleteEvent = async () => {
      if (!editingEventId.value)
        return;
      common_vendor.index.showModal({
        title: "确认删除",
        content: "确定要删除这个日程吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              await calendarStore.deleteEvent(editingEventId.value);
              common_vendor.index.showToast({
                title: "日程已删除",
                icon: "success"
              });
              closeEventModal();
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/index/index.vue:696", "删除日程失败:", error);
              common_vendor.index.showToast({
                title: error.message || "删除失败，请重试",
                icon: "none"
              });
            }
          }
        }
      });
    };
    const closeEventModal = () => {
      showEventModal.value = false;
      resetEventForm();
      isEditing.value = false;
      editingEventId.value = null;
    };
    common_vendor.onMounted(() => {
      common_vendor.index.__f__("log", "at pages/index/index.vue:717", "🚀 日历应用启动");
      common_vendor.index.__f__("log", "at pages/index/index.vue:720", "🔔 提醒服务状态:", utils_reminder.reminderService.initialized ? "已初始化" : "未初始化");
      calendarStore.loadEvents();
      setTimeout(() => {
        calendarStore.startSilentRefresh();
      }, 3e3);
      common_vendor.nextTick$1(() => {
        setTimeout(syncScroll, 100);
      });
      setTimeout(() => {
        try {
          const notification = common_vendor.index.getStorageSync("lastClickedNotification");
          if (notification) {
            common_vendor.index.__f__("log", "at pages/index/index.vue:752", "发现通知点击记录:", notification);
            common_vendor.index.removeStorageSync("lastClickedNotification");
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/index/index.vue:756", "检查通知记录失败:", error);
        }
      }, 1e3);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(common_vendor.unref(calendarStore).pageTitle),
        b: common_vendor.o(handleAddEvent),
        c: common_vendor.unref(calendarStore).currentView === "month" ? 1 : "",
        d: common_vendor.o(($event) => handleSwitchView("month")),
        e: common_vendor.unref(calendarStore).currentView === "week" ? 1 : "",
        f: common_vendor.o(($event) => handleSwitchView("week")),
        g: common_vendor.unref(calendarStore).currentView === "day" ? 1 : "",
        h: common_vendor.o(($event) => handleSwitchView("day")),
        i: common_vendor.o(handlePreviousPeriod),
        j: common_vendor.t(common_vendor.unref(calendarStore).displayDate),
        k: common_vendor.o(handleNextPeriod),
        l: common_vendor.o(handleGoToToday),
        m: common_vendor.unref(calendarStore).currentView === "month"
      }, common_vendor.unref(calendarStore).currentView === "month" ? {
        n: common_vendor.f(weekdays, (day, k0, i0) => {
          return {
            a: common_vendor.t(day),
            b: day
          };
        }),
        o: common_vendor.f(common_vendor.unref(calendarStore).monthDays, (day, index, i0) => {
          return {
            a: common_vendor.t(day.day),
            b: common_vendor.t(day.lunarDay),
            c: common_vendor.f(monthDayEvents.value[day.dateStr], (event, k1, i1) => {
              return {
                a: event._id,
                b: event.color
              };
            }),
            d: index,
            e: !day.isCurrentMonth ? 1 : "",
            f: day.isToday ? 1 : "",
            g: day.isSelected ? 1 : "",
            h: common_vendor.o(($event) => handleSelectDate(day.date), index)
          };
        })
      } : {}, {
        p: common_vendor.unref(calendarStore).currentView === "week"
      }, common_vendor.unref(calendarStore).currentView === "week" ? {
        q: common_vendor.f(common_vendor.unref(calendarStore).weekDays, (day, k0, i0) => {
          return {
            a: common_vendor.t(day.weekday),
            b: common_vendor.t(day.date),
            c: day.fullDate.toString(),
            d: common_vendor.o(($event) => handleSelectDate(day.fullDate), day.fullDate.toString())
          };
        }),
        r: common_vendor.f(common_vendor.unref(timeSlots), (time, k0, i0) => {
          return {
            a: common_vendor.t(time),
            b: time
          };
        }),
        s: common_vendor.f(common_vendor.unref(calendarStore).weekDays, (day, k0, i0) => {
          return {
            a: common_vendor.f(common_vendor.unref(timeSlots), (time, k1, i1) => {
              return {
                a: common_vendor.f(getLimitedEventsForTimeSlot(day.fullDate, time), (event, index, i2) => {
                  return common_vendor.e({
                    a: common_vendor.t(index === 1 && hasMoreEvents(day.fullDate, time) ? "..." : getShortTitle(event.title)),
                    b: event.reminders && event.reminders.length > 0
                  }, event.reminders && event.reminders.length > 0 ? {} : {}, {
                    c: event._id,
                    d: event.color,
                    e: index === 1 && hasMoreEvents(day.fullDate, time) ? 1 : "",
                    f: common_vendor.o(($event) => index === 1 && hasMoreEvents(day.fullDate, time) ? handleViewMoreEvents(day.fullDate, time) : handleViewEvent(event), event._id)
                  });
                }),
                b: time,
                c: common_vendor.o(($event) => handleAddEventAtTime(day.fullDate, time), time)
              };
            }),
            b: day.fullDate.toString()
          };
        })
      } : {}, {
        t: common_vendor.unref(calendarStore).currentView === "day"
      }, common_vendor.unref(calendarStore).currentView === "day" ? common_vendor.e({
        v: common_vendor.t(common_vendor.unref(calendarStore).selectedDate.format("YYYY年MM月DD日")),
        w: common_vendor.t(common_vendor.unref(calendarStore).selectedDate.format("dddd")),
        x: common_vendor.unref(calendarStore).getLongEventsForDay(common_vendor.unref(calendarStore).selectedDate).length > 0
      }, common_vendor.unref(calendarStore).getLongEventsForDay(common_vendor.unref(calendarStore).selectedDate).length > 0 ? {
        y: common_vendor.f(common_vendor.unref(calendarStore).getLongEventsForDay(common_vendor.unref(calendarStore).selectedDate), (event, k0, i0) => {
          return {
            a: common_vendor.t(event.title),
            b: common_vendor.t(event.startDate),
            c: common_vendor.t(event.endDate),
            d: event._id,
            e: event.color + "20",
            f: "8rpx solid " + event.color,
            g: common_vendor.o(($event) => handleViewEvent(event), event._id)
          };
        })
      } : {}, {
        z: common_vendor.f(common_vendor.unref(timeSlots), (time, k0, i0) => {
          return {
            a: common_vendor.t(time),
            b: common_vendor.f(getEventsForTimeSlot(common_vendor.unref(calendarStore).selectedDate, time), (event, k1, i1) => {
              return common_vendor.e({
                a: common_vendor.t(event.title),
                b: common_vendor.t(event.startTime),
                c: common_vendor.t(event.endTime),
                d: event.reminders && event.reminders.length > 0
              }, event.reminders && event.reminders.length > 0 ? {} : {}, {
                e: event._id,
                f: event.color,
                g: common_vendor.o(($event) => handleViewEvent(event), event._id)
              });
            }),
            c: common_vendor.o(($event) => handleAddEventAtTime(common_vendor.unref(calendarStore).selectedDate, time), time),
            d: time
          };
        })
      }) : {}, {
        A: showEventModal.value
      }, showEventModal.value ? common_vendor.e({
        B: common_vendor.t(isEditing.value ? "编辑日程" : "添加日程"),
        C: common_vendor.o(closeEventModal),
        D: autoFocusTitle.value,
        E: eventForm.title,
        F: common_vendor.o(($event) => eventForm.title = $event.detail.value),
        G: common_vendor.t(eventForm.startDate || "选择日期"),
        H: eventForm.startDate,
        I: common_vendor.o((e) => handleDateChange("startDate", e.detail.value)),
        J: common_vendor.t(eventForm.startTime || "选择时间"),
        K: eventForm.startTime,
        L: common_vendor.o((e) => handleTimeChange("startTime", e.detail.value)),
        M: common_vendor.t(eventForm.endDate || "选择日期"),
        N: eventForm.endDate,
        O: common_vendor.o((e) => handleDateChange("endDate", e.detail.value)),
        P: common_vendor.t(eventForm.endTime || "选择时间"),
        Q: eventForm.endTime,
        R: common_vendor.o((e) => handleTimeChange("endTime", e.detail.value)),
        S: common_vendor.f(common_vendor.unref(calendarStore).colorOptions, (color, k0, i0) => {
          return {
            a: color,
            b: color,
            c: eventForm.color === color ? 1 : "",
            d: common_vendor.o(($event) => eventForm.color = color, color)
          };
        }),
        T: common_vendor.f(common_vendor.unref(calendarStore).reminderOptions, (option, k0, i0) => {
          return common_vendor.e({
            a: eventForm.reminders.includes(option.value)
          }, eventForm.reminders.includes(option.value) ? {} : {}, {
            b: common_vendor.t(option.label),
            c: option.value,
            d: eventForm.reminders.includes(option.value) ? 1 : "",
            e: common_vendor.o(($event) => toggleReminder(option.value), option.value)
          });
        }),
        U: eventForm.reminders.length === 0
      }, eventForm.reminders.length === 0 ? {} : {}, {
        V: eventForm.reminders.length === 0 ? 1 : "",
        W: common_vendor.o(clearReminders),
        X: eventForm.reminders.length > 0
      }, eventForm.reminders.length > 0 ? {
        Y: common_vendor.f(sortedReminders.value, (reminder, index, i0) => {
          return {
            a: common_vendor.t(getReminderLabel(reminder)),
            b: index
          };
        })
      } : {}, {
        Z: eventForm.notes,
        aa: common_vendor.o(($event) => eventForm.notes = $event.detail.value),
        ab: common_vendor.o(closeEventModal),
        ac: isEditing.value
      }, isEditing.value ? {
        ad: common_vendor.o(handleDeleteEvent)
      } : {}, {
        ae: common_vendor.o(handleSaveEvent)
      }) : {}, {
        af: common_vendor.unref(calendarStore).loading
      }, common_vendor.unref(calendarStore).loading ? {} : {});
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
