import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

/* Vue实例可以作为事件总线 挂载在Vue原型上 */
Vue.prototype.$bus = new Vue()

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
