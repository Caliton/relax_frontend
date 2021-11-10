const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('pages/Login.vue')
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('pages/Index.vue')
      },

      {
        path: '/colaborator',
        name: 'colaborator',
        component: () => import('pages/Colaborator.vue')
      },

      {
        path: '/reserva',
        name: 'reserva',
        component: () => import('pages/Reserva.vue')
      },

      {
        path: '/vacationrequest',
        name: 'vacationrequest',
        component: () => import('pages/VacationRequest.vue')
      },

      {
        path: '/settings',
        name: 'settings',
        component: () => import('pages/Setting.vue')
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
