export default [
  {
    path: '/Login',
    meta: {
      name: 'External',
      requiresAuth: false
    },
    component: () => import('@/frame/External.vue'),
    children: [
      {
        path: '',
        name: 'LoginView',
        component: () => import('@/views/LoginView.vue')
      }
    ]
  },
  {
    path: '/',
    meta: {
      name: 'Primary',
      requiresAuth: true
    },
    redirect: '/Home',
    component: import('@/frame/Primary.vue'),
    children: [
      {
        path: '/Home',
        name: 'HomeView',
        label: '首页',
        icon: 's-home',
        component: () => import('@/views/HomeView.vue')
      }
    ]
  },
  {
    path: '*',
    redirect: {
      name: 'catchAll',
      path: '/'
    },
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/:catchAll(.*)',
    component: () => import('@/components/error/NotFound.vue'),
    name: 'NotFoundView'
  }
]
