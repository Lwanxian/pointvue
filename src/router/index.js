import Vue from 'vue'
import Router from 'vue-router'
import Wpoint from '@/components/Wpoint'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Wpoint',
      component: Wpoint
    }
  ]
})
