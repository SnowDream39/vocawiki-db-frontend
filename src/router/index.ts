import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: () => import('../views/Home.vue') },
    { path: '/producer', component: () => import('../views/Producer.vue') },
    { path: '/psong', component: () => import('../views/PSong.vue') },
    { path: '/login', component: () => import('../views/User.vue') },
  ],
})

export default router
