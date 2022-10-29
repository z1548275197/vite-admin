// router/index.ts
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import { routes } from './router.config'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

export default router
