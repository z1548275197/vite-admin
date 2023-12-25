// router/index.ts
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import { routes } from './router.config'

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
