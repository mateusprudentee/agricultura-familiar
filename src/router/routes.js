const routes = [
{
  path: '/captcha',
  component: () => import('pages/CaptchaPage.vue'),
  meta: { public: true }
},
  {
    path: '/login',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('pages/LoginPage.vue'),
        // Login geralmente é público, se não for, mude para false
        meta: { public: true }
      }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { public: false }, // Protege todas as rotas filhas por padrão
    children: [
      { path: '', component: () => import('pages/HomePage.vue') },
      { path: 'dashboard', component: () => import('pages/DashboardPage.vue') },
      { path: 'fonte-publica', component: () => import('pages/FontePublica.vue') },
      { path: 'verbas-por-municipio', component: () => import('../financiamento/VerbasPage.vue') },
      { path: 'repasses-auxilios-pnae', component: () => import('../financiamento/RepassesPNAE.vue') },
      { path: 'ods2-fome-zero', component: () => import('../ods/Ods2.vue') },
      { path: 'ods3-saude-bem-estar', component: () => import('../ods/Ods3.vue') },
      { path: 'ods4-educacao-qualidade', component: () => import('../ods/Ods4.vue') },
      { path: 'relatorios', component: () => import('../portal/Relatorios.vue') },
      { path: 'dados', component: () => import('pages/DadosPage.vue') }
    ]
  },

  // Sempre deixe a rota de erro por último
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorPage.vue'),
    meta: { public: true }
  }
]

export default routes
