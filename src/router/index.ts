import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: () => import('../views/HomeView.vue') },
    { path: '/producer', component: () => import('../views/ProducerView.vue') },
    { path: '/blacklist', component: () => import('../views/BlacklistView.vue') },
  ],
})

export default router
