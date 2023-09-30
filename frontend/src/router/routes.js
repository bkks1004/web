const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: false },
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        meta: { requiresAuth: false },
      },
      {
        path: 'profile',
        component: () => import('pages/Profile.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/login',
    component: () => import('layouts/LogInLayout.vue'),
    meta: { requiresAuth: false },
    children: [
      {
        path: '',
        component: () => import('pages/LogIn.vue'),
        meta: { requiresAuth: false },
      },
      {
        path: 'naver',
        component: () => import('pages/LogInNaver.vue'),
        meta: { requiresAuth: false },
      },
      {
        path: 'kakao',
        component: () => import('pages/LogInKakao.vue'),
        meta: { requiresAuth: false },
      },
    ],
  },
  {
    path: '/join',
    component: () => import('layouts/LogInLayout.vue'),
    meta: { requiresAuth: false },
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
