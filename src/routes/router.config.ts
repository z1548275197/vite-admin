// router/router.config.ts
import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layouts/index';
export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    redirect: '/contract',
    meta: {
      title: '首页',
      keepAlive: false
    },
    component: Layout,
    children: [
    ]
  }, 
  {
    path: '/contract',
    name: 'Contract',
    component: () => import('@/views/contract'),
    meta: {
      title: '',
    },
  },
  {
    path: '/editContract',
    name: 'EditContract',
    component: () => import('@/views/EditContract'),
    meta: {
      title: '自定义合约',
    },
  }
]

