import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../views/LogIn.vue')
    },
    {
      path: '/singup',
      name: 'singup',
      component: () => import('../views/SignUp.vue')
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('../views/Chat.vue')
    },
    {
      path: '/loading',
      name: 'loading',
      component: () => import('../views/Welcome.vue')
    }
  ]
})

export default router
