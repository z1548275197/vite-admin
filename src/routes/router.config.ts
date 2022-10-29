// router/router.config.ts
import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layouts/index.tsx';
import Login from '@/views/login';
import Record from '@/views/record';
export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    redirect: '/record',
    meta: {
      title: '首页',
      keepAlive: false
    },
    component: Layout,
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/Home'),
        meta: { title: '首页', keepAlive: false, showTab: true }
      },
      {
        path: '/record',
        name: 'Record',
        component: Record,
      }
      // {
      //   path: '/tsx',
      //   name: 'Tsx',
      //   component: () => import('@/test/demo'),
      //   meta: { title: '测试tsx', keepAlive: false, showTab: true }
      // },
      // {
      //   path: '/static',
      //   name: 'Static',
      //   component: () => import('@/test/testStatic.vue'),
      //   meta: { title: '测试静态资源', keepAlive: false, showTab: true }
      // },
      // {
      //   path: '/cssModel',
      //   name: 'CssModel',
      //   component: () => import('@/test/testCssModel'),
      //   meta: { title: '测试css-model', keepAlive: false, showTab: true }
      // },
      // {
      //   path: '/mockAxios',
      //   name: 'MockAxios',
      //   component: () => import('@/test/testMockAxios'),
      //   meta: { title: '测试mock-axios', keepAlive: false, showTab: true }
      // },
      // {
      //   path: '/pinia',
      //   name: 'Pinia',
      //   component: () => import('@/test/testPinia.vue'),
      //   meta: { title: '测试pinia', keepAlive: false, showTab: true }
      // }
    ]
  }, 
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/record',
    name: 'Record',
    component: Record,
  }
]
