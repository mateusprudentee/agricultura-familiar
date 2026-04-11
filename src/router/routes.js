const routes = [
  {
    path: '/login',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',  // Isso vai renderizar LoginPage quando acessar /login
        component: () => import('pages/LoginPage.vue')
      },
    ],
  },

  {
    // TUDO AQUI  ABAIXO TEM O NAVBAR JUNTO
    path: '/',
    component: () => import('layouts/MainLayout.vue'), // Crie este componente
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
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorPage.vue'),
  }

    ]
  },

  // TUDO AQUI ABAIXO ESTÁ FORA DO NAVBAR

]

export default routes
