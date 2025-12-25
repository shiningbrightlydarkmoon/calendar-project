<script>
	import reminderService from '@/utils/reminder.js'
	
	export default {
		onLaunch: function() {
			console.log('App Launch')
			
			// 初始化提醒服务
			reminderService.init().then(() => {
				console.log('🔔 提醒服务初始化完成')
			}).catch(error => {
				console.error('❌ 提醒服务初始化失败:', error)
			})
			
			// #ifdef APP-PLUS
			// 监听通知栏点击事件
			plus.push.addEventListener('click', (msg) => {
			    try {
					let payload = null
					if (typeof msg.payload === 'string') {
						try {
							payload = JSON.parse(msg.payload)
						} catch (e) {
							console.warn('通知内容解析失败')
							return
						}
					} else {
						payload = msg.payload || {}
					}
					
					if (payload && payload.id) {
						console.log('📱 点击了日程通知，ID:', payload.id)
						
						// 保存到本地存储
						try {
							uni.setStorageSync('lastClickedNotification', {
								eventId: payload.id,
								eventTitle: payload.title || '日程提醒',
								time: new Date().toISOString()
							})
						} catch (e) {
							console.error('保存通知记录失败:', e)
						}
						
						// 显示提示
						uni.showToast({
							title: `查看日程: ${payload.title || '日程提醒'}`,
							icon: 'none',
							duration: 2000
						})
					}
				} catch (error) {
					console.error('处理通知点击时出错:', error)
				}
			}, false)
			// #endif
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>