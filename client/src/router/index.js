import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/LogIn.vue'
import Signup from '../views/SignUp.vue'
import Chat from '../views/Chat.vue'
import Loading from '../views/Welcome.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/singup',
      name: 'singup',
      component: Signup
    },
    {
      path: '/chat',
      name: 'chat',
      component: Chat,
      props: true,
      meta: {requiresAuth: true}
    },
    {
      path: '/loading',
      name: 'loading',
      component: Loading
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  //We check if page we are navigating to is protected
  if (to.matched.some(record => record.meta.requiresAuth)) {
  const getToken =  localStorage.getItem('token')
    
    if(!getToken) { 
      return next('/')
    }
  }
  next()
})

export default router
