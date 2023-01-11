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
      component: () => import('../views/Chat.vue'),
      meta: {requiresAuth: true}
    },
    {
      path: '/loading',
      name: 'loading',
      component: () => import('../views/Welcome.vue')
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  //We check if page we are navigating to is protected
  if (to.matched.some(record => record.meta.requiresAuth)) {
  const getToken =  localStorage.getItem('token')
    
    if(getToken) { 
      //we check token and redirect to chat if it's the same registered
      const res = await dataService.authenticateToken({
        'x-access-token': getToken
      })
      if(!res.data.success) {return next('/')}
    }
    else {
      return next('/')
    }
  }
  next()
})

export default router
