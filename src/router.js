import { createRouter, createWebHistory } from 'vue-router'
const Auth = () => import('./views/Auth.vue')
const Task = () => import('./views/Task.vue')
const Main = () => import('./views/Main.vue')

// import Task from "./views/Task.vue";
// import Main from "./views/Main.vue";

import authStore from './stores/auth.js'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Main
    },

    {
      path: '/auth',
      name: 'auth',
      component: Auth
    },

    {
      path: '/task/:id',
      name: 'task',
      component: Task
    },

    {
      path: '/main',
      name: 'main',
      component: Main

    }
  ],
})

router.beforeEach((to) => {
  const auth = authStore()

  if (!auth.getAuth() && to.name !== "auth") 
    return { name: 'auth' }
})