import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import LoCmp from '@~'
import http from '@/assets/http'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/utils/dialogDrag'
Vue.prototype.$http = http

Vue.use(ElementUI)

Vue.use(LoCmp, { http })

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
