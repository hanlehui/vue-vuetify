import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import Meta from 'vue-meta'
import NProgress from 'nprogress'
import paths from './paths'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: paths,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { selector: to.hash }
    }
    return { x: 0, y: 0 }
  }
})

// 路由拦截
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth) && !store.getters.authorized) {
    console.log('authorize for route: ' + store.getters.authorized)
    console.log('next() value: ' + next())
    next({ path: '/Login', query: { redirect: to.fullPath } })
  } else if (to.name == 'LoginView' && store.getters.authorized) {
    next('/')
  } else {
    next()
  }
})

router.beforeResolve((to, from, next) => {
  if (to.path) {
    NProgress.start()
  }
  next()
})

router.afterEach(() => {
  NProgress.done()
})

Vue.use(Meta)

export default router

// import Vue from 'vue'
// import VueRouter from 'vue-router'
// import HomeView from '../views/HomeView.vue'

// Vue.use(VueRouter)

// const routes = [
//   {
//     path: '/',
//     name: 'home',
//     component: HomeView
//   },
//   {
//     path: '/Login',
//     name: 'login',
//     component: () => import(/* webpackChunkName: "about" */ '../views/LoginView.vue')
//   },
//   {
//     path: '/about',
//     name: 'about',
//     // route level code-splitting
//     // this generates a separate chunk (about.[hash].js) for this route
//     // which is lazy-loaded when the route is visited.
//     component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
//   }
// ]

// const router = new VueRouter({
//   mode: 'history',
//   base: process.env.BASE_URL,
//   routes
// })

// export default router
