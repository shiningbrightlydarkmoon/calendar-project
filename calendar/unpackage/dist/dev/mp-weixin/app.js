"use strict";
const common_vendor = require("./common/vendor.js");
const stores_index = require("./stores/index.js");
if (!Math) {
  "./pages/index/index.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:4", "App Launch");
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:17", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:20", "App Hide");
  }
};
const app = common_vendor.createApp(_sfc_main);
app.use(stores_index.pinia);
app.mount("#app");
{
  common_vendor.index.__f__("log", "at main.js:16", "🎉 日历应用已启动");
  common_vendor.index.__f__("log", "at main.js:17", "🚀 Vue 3 + uni-app + Pinia");
}
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
