import Vue from 'vue'
import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// import store from '@/store' // FIXME:
import { Notification, Message }from 'element-ui'
import { VueAxios } from './axios'
// import { ACCESS_TOKEN } from '@/store/mutation-types'
NProgress.configure({
  ease:'ease',
  speed:1000,
  showSpinner:false,
});

// 创建 axios 实例
const service = axios.create({
  // baseURL: process.env.BASE_URL, // api base_url
  baseURL: '/',
  timeout: 6000, // 请求超时时间,
  headers: { 'Content-Type': 'application/json' }
})

const err = (error) => { 
  Message.error('请求超时', 1)
  if (error.response) {
    const { data } = error.response
    const token = window.sessionStorage.getItem('token')
    if (error.response.status === 403) {
      Notification.error({
        title: data.message,
        message: 'Forbidden'
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      Notification.error({
        title: 'Authorization verification failed',
        message: 'Unauthorized'  
      })
      if (token) {
        // FIXME:
        // store.dispatch('Logout').then(() => {
        //   setTimeout(() => {
        //     window.location.reload()
        //   }, 1500)
        // })
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use((config) => { 
  // 当进入request拦截器，表示发送了请求，我们就开启进度条
  NProgress.start()
  const token = window.sessionStorage.getItem('token')
  if (token) {
    config.headers.token = token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, err)

// response interceptor
service.interceptors.response.use(response => {
  NProgress.done()
  if(response.data.code == '403'){
    window.location.assign('/#/login')
  }
  return response.data
}, err)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}

export { installer as VueAxios, service as axios }
