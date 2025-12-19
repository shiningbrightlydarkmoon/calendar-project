<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// #ifdef APP-PLUS
			// 监听通知栏点击事件
			plus.push.addEventListener('click', (msg) => {
			    const payload = typeof msg.payload === 'string' ? JSON.parse(msg.payload) : msg.payload;
			    if (payload && payload.eventId) {
			      // 可以在这里跳转到详情页或通过全局变量通知 index.vue 弹出详情框
			      console.log('点击了日程通知，ID:', payload.eventId);
			    }
			}, false);
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
