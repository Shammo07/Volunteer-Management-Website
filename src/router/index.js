import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/events',
      name: 'events',
      component: () => import('../views/EventsPage.vue')
    },
    {
      path: '/events/new',
      name: 'newEvents',
      component: () => import('../views/EventsPage.vue')
    },
    {
      path: '/events/detail/:id',
      name: 'eventDetails',
      component: () => import('../views/EventsPage.vue')
    },
    {
      path: '/events/edit/:id',
      name: 'editEvent',
      component: () => import('../views/EventsPage.vue')
    },
    {
      path: '/becomeVolunteer',
      name: 'becomeVolunteer',
      component: () => import('../views/BecomeVolunteer.vue')
    },
  ]
})

export default router
