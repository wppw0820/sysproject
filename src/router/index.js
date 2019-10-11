import Vue from 'vue'
import Router from 'vue-router'
import constantRouterMap from '@/config/router.config'

Vue.use(Router)

const router =  new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

// 挂在路由导航守卫
router.beforeEach((to, from, next) => { 
  if (to.path == '/login') return next()
  const tokenStr = window.sessionStorage.getItem('isLogin')
  if (!tokenStr) return next('/login')
  next()
})
export default router

