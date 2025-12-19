"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_calendar = require("../../stores/calendar.js");
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
      isAllDay: false
    });
    const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
    const timeSlots = Array.from(
      { length: 24 },
      (_, i) => `${i.toString().padStart(2, "0")}:00`
    );
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
      const events = calendarStore.getEventsForDayAndTime(date, time);
      return events.slice(0, 2);
    };
    const hasMoreEvents = (date, time) => {
      const events = calendarStore.getEventsForDayAndTime(date, time);
      return events.length > 2;
    };
    const getShortTitle = (title) => {
      if (title.length <= 6) {
        return title;
      }
      return title.substring(0, 6) + "...";
    };
    const handleViewMoreEvents = (date, time) => {
      const events = calendarStore.getEventsForDayAndTime(date, time);
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
      return calendarStore.getEventsForDayAndTime(date, time);
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
        common_vendor.index.__f__("error", "at pages/index/index.vue:498", "保存日程失败:", error);
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
              common_vendor.index.__f__("error", "at pages/index/index.vue:522", "删除日程失败:", error);
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
    common_vendor.watch([() => calendarStore.currentView, () => calendarStore.selectedDate], () => {
      calendarStore.loadEvents();
      if (calendarStore.currentView === "week") {
        common_vendor.nextTick$1(() => {
          setTimeout(syncScroll, 100);
        });
      }
    });
    common_vendor.onMounted(() => {
      common_vendor.index.__f__("log", "at pages/index/index.vue:551", "🚀 日历应用启动");
      setTimeout(() => {
        calendarStore.debugSystem().then(() => {
          common_vendor.index.__f__("log", "at pages/index/index.vue:556", "🎯 系统调试完成，开始加载日程数据");
          calendarStore.loadEvents();
        }).catch((error) => {
          common_vendor.index.__f__("error", "at pages/index/index.vue:560", "❌ 系统调试失败:", error);
          calendarStore.loadEvents();
        });
      }, 1e3);
      calendarStore.loadEvents();
      common_vendor.nextTick$1(() => {
        setTimeout(syncScroll, 100);
      });
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(common_vendor.unref(calendarStore).pageTitle),
        b: common_vendor.o(handleAddEvent),
        c: common_vendor.unref(calendarStore).currentView === "month" ? 1 : "",
        d: common_vendor.o(($event) => common_vendor.unref(calendarStore).switchView("month")),
        e: common_vendor.unref(calendarStore).currentView === "week" ? 1 : "",
        f: common_vendor.o(($event) => common_vendor.unref(calendarStore).switchView("week")),
        g: common_vendor.unref(calendarStore).currentView === "day" ? 1 : "",
        h: common_vendor.o(($event) => common_vendor.unref(calendarStore).switchView("day")),
        i: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(calendarStore).previousPeriod && common_vendor.unref(calendarStore).previousPeriod(...args)
        ),
        j: common_vendor.t(common_vendor.unref(calendarStore).displayDate),
        k: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(calendarStore).nextPeriod && common_vendor.unref(calendarStore).nextPeriod(...args)
        ),
        l: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(calendarStore).goToToday && common_vendor.unref(calendarStore).goToToday(...args)
        ),
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
            c: common_vendor.f(common_vendor.unref(calendarStore).getTimeEventsForDay(day.date).slice(0, 3), (event, k1, i1) => {
              return {
                a: event._id,
                b: event.color
              };
            }),
            d: index,
            e: !day.isCurrentMonth ? 1 : "",
            f: day.isToday ? 1 : "",
            g: day.isSelected ? 1 : "",
            h: common_vendor.o(($event) => common_vendor.unref(calendarStore).selectDate(day.date), index)
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
            d: common_vendor.o(($event) => common_vendor.unref(calendarStore).selectDate(day.fullDate), day.fullDate.toString())
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
                  return {
                    a: common_vendor.t(index === 1 && hasMoreEvents(day.fullDate, time) ? "..." : getShortTitle(event.title)),
                    b: event._id,
                    c: event.color,
                    d: index === 1 && hasMoreEvents(day.fullDate, time) ? 1 : "",
                    e: common_vendor.o(($event) => index === 1 && hasMoreEvents(day.fullDate, time) ? handleViewMoreEvents(day.fullDate, time) : handleViewEvent(event), event._id)
                  };
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
      }, common_vendor.unref(calendarStore).currentView === "day" ? {
        v: common_vendor.t(common_vendor.unref(calendarStore).selectedDate.format("YYYY年MM月DD日")),
        w: common_vendor.t(common_vendor.unref(calendarStore).selectedDate.format("dddd")),
        x: common_vendor.f(common_vendor.unref(timeSlots), (time, k0, i0) => {
          return {
            a: common_vendor.t(time),
            b: common_vendor.f(getEventsForTimeSlot(common_vendor.unref(calendarStore).selectedDate, time), (event, k1, i1) => {
              return {
                a: common_vendor.t(event.title),
                b: common_vendor.t(event.startTime),
                c: common_vendor.t(event.endTime),
                d: event._id,
                e: event.color,
                f: common_vendor.o(($event) => handleViewEvent(event), event._id)
              };
            }),
            c: common_vendor.o(($event) => handleAddEventAtTime(common_vendor.unref(calendarStore).selectedDate, time), time),
            d: time
          };
        })
      } : {}, {
        y: showEventModal.value
      }, showEventModal.value ? common_vendor.e({
        z: common_vendor.t(isEditing.value ? "编辑日程" : "添加日程"),
        A: common_vendor.o(closeEventModal),
        B: autoFocusTitle.value,
        C: eventForm.title,
        D: common_vendor.o(($event) => eventForm.title = $event.detail.value),
        E: common_vendor.t(eventForm.startDate || "选择日期"),
        F: eventForm.startDate,
        G: common_vendor.o((e) => handleDateChange("startDate", e.detail.value)),
        H: common_vendor.t(eventForm.startTime || "选择时间"),
        I: eventForm.startTime,
        J: common_vendor.o((e) => handleTimeChange("startTime", e.detail.value)),
        K: common_vendor.t(eventForm.endDate || "选择日期"),
        L: eventForm.endDate,
        M: common_vendor.o((e) => handleDateChange("endDate", e.detail.value)),
        N: common_vendor.t(eventForm.endTime || "选择时间"),
        O: eventForm.endTime,
        P: common_vendor.o((e) => handleTimeChange("endTime", e.detail.value)),
        Q: common_vendor.f(common_vendor.unref(calendarStore).colorOptions, (color, k0, i0) => {
          return {
            a: color,
            b: color,
            c: eventForm.color === color ? 1 : "",
            d: common_vendor.o(($event) => eventForm.color = color, color)
          };
        }),
        R: eventForm.notes,
        S: common_vendor.o(($event) => eventForm.notes = $event.detail.value),
        T: common_vendor.o(closeEventModal),
        U: isEditing.value
      }, isEditing.value ? {
        V: common_vendor.o(handleDeleteEvent)
      } : {}, {
        W: common_vendor.o(handleSaveEvent)
      }) : {}, {
        X: common_vendor.unref(calendarStore).loading
      }, common_vendor.unref(calendarStore).loading ? {} : {});
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
