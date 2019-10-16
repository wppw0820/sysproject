import Vue from 'vue'
import App from './App.vue'
import store from './store'
import ElementUI from 'element-ui'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import './assets/icon/iconfont.js'
// require ('./assets/icon/iconfont.js')
import { VueAxios } from './utils/request'
import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router/index'
import $ from 'jquery'
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$message = ElementUI.Message
Vue.prototype.$confirm = ElementUI.MessageBox.confirm
Vue.use(VueAxios)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

