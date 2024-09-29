// router/router.config.ts
import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layouts/index';
export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    meta: {
      title: '首页',
      keepAlive: false
    },
    component: Layout,
    redirect: '/test1',
    children: [
      {
        path: '/test1',
        name: 'Test111',
        component: () => import('@/views/test/index'),
        meta: {
          title: '服务项目模板预置',
        },
      },
    ]
  },
  {
    path: '/test2',
    name: 'test222',
    component: () => import('@/views/test1'),
    meta: {
      title: '',
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login'),
    meta: {
      title: '登录',
    },
  },
  // {
  //   path: '/404',
  //   name: '404',
  //   component: () => import('@/views/404'),
  //   meta: {
  //     title: '404',
  //   },
  // },
  // {
  //   path: '/:pathMatch(.*)',
  //   redirect: '/404',
  // },
]

