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
import md5 from 'md5'
import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import { codemirror } from 'vue-codemirror'
import 'amfe-flexible'
import '@babel/polyfill'
import './utils/code'

Vue.use(VueCodemirror)
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$message = ElementUI.Message
Vue.prototype.$confirm = ElementUI.MessageBox.confirm
Vue.prototype.$md5 = md5
Vue.prototype.$editor = VueCodemirror
Vue.use(VueAxios)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

