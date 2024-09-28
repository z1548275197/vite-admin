// router/router.config.ts
import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layouts/index';
export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    redirect: '/test',
    meta: {
      title: '首页',
      keepAlive: false
    },
    component: Layout,
    children: [
      {
        path: '/test',
        name: 'test',
        component: () => import('@/views/test'),
        meta: {
          title: '',
        },
      },
    ]
  },
]

