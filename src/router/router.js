import Vue from 'vue';
import Router from 'vue-router';
import { getToken } from '@/utils/localStorageTokens.utils.js';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'auth',
      component: () => import(/* webpackChunkName: "home" */ '../pages/AuthPage.vue'),
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../pages/HomePage.vue'),
      meta: {
        auth: true,
        layout: 'default',
      },
    },
    {
      path: '/inspection/contractId/:id',
      name: 'inspection',
      component: () => import('../pages/Inspection.vue'),
      props: true,
      meta: {
        auth: true,
        layout: 'default',
      },
    },
  ],
});

router.beforeEach((to, _, next) => {
  const token = getToken('token');
  const requireAuth = to.matched.some(record => record.meta.auth);
  if (!token && requireAuth) {
    next('/');
  } else {
    next();
  }
});

export default router;
