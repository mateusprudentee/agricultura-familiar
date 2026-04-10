const routes = [
  {
    path: '/',
    component: () => import('pages/HomePage.vue'),
    children: [{ path: '', component: () => import('pages/HomePage.vue') }],
  },

  {
    path: '/ciencias-ambientais',
    component: () => import('pages/Mapa.vue'),
    children: [{ path: '', component: () => import('pages/Dashboard.vue') }],
  },




  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorPage.vue'),
  },
]

export default routes
