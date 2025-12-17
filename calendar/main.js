import { createApp } from 'vue'
import App from './App.vue'
import pinia from './stores'

// 创建Vue应用实例
const app = createApp(App)

// 使用Pinia状态管理
app.use(pinia)

// 挂载应用到DOM
app.mount('#app')

// 在开发环境下输出启动信息
if (process.env.NODE_ENV === 'development') {
  console.log('🎉 日历应用已启动')
  console.log('🚀 Vue 3 + uni-app + Pinia')
}