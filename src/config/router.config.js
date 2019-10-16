
// 抽离路由配置模块
// import LoginPage from './views/LoginPage'
// import TabPage from './views/TabPage'
const constantRouterMap = [
  {
    path: '/',
    redirect: "/login"
  },
  {
    path: '/login',
    name: 'login',
    meta: { title: '登录' },
    component: () => import('@/views/Login')
  },
  {
    path: '/home',
    name: 'home',
    meta: { title: '首页' },
    component: () => import('@/views/Home'),
    redirect: '/list',
    children: [
      {
        path: '/list',
        name: 'list',
        meta: { title: '项目列表' },
        component: () => import('@/views/List')
      },
      {
        path: '/details',
        name:'details',
        meta: { title: '项目详情' },
        component: () => import('@/views/Details')
      }
    ]
  },
  // {
  //   path: '/404',
  //   name: '404',
  //   component: () => import('@/components/Exception')
  // },
  // {
  //   path: '*',
  //   redirect: '/404'
  // }
]
// 导出路由配置模块
export default constantRouterMap