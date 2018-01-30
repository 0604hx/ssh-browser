import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      meta: {title:"我的通道"},
      component: resolve => require(['V/Index'], resolve)
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
