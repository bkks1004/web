const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('layouts/LogInLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/LogIn.vue'),
      },
      {
        path: 'naver',
        component: () => import('pages/LogInNaver.vue'),
      },
    ],
  },
  {
    path: '/join',
    component: () => import('layouts/LogInLayout.vue'),
    children: [{ path: '', component: () => import('pages/Join.vue') }],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
