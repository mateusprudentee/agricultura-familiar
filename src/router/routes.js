const routes = [
  {
    path: '/login',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/LoginPage.vue')
      }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/HomePage.vue')
      },
      {
        path: 'dashboard',
        component: () => import('pages/DashboardPage.vue')
      },
      {
        path: 'fonte-publica',
        component: () => import('pages/FontePublica.vue')
      },
      {
        path: 'dados',
        component: () => import('pages/DadosPage.vue')
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorPage.vue')
  }
]

export default routes
