import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: () => import('../views/HomeView.vue') },
    { path: '/producer', component: () => import('../views/ProducerView.vue') },
    { path: '/psong', component: () => import('../views/PSongView.vue') },
  ],
})

export default router
