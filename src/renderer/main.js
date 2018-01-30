import Vue from 'vue'

//引入常量
import Consts from 'S/Const'
global.C = window.C = Consts

import App from './App'
import router from './router'

import iview from 'iview'
import 'iview/dist/styles/iview.css'
// import './assets/main.css'

import moment from 'moment'
moment.locale('zh_cn')

//加入 util 中的工具类
import 'U'

Vue.prototype.date = (d) => { return window.D.date(d) }
Vue.prototype.datetime = (d) => { return window.D.datetime(d) }

//使用 iview
Vue.use(iview)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

//设置加载提示
router.beforeEach((to,from,next)=>{
  iview.LoadingBar.start();
  if(to.meta.title)  window.document.title = to.meta.title+" - "+Consts.name

  next()
})
router.afterEach(route => {
  iview.LoadingBar.finish()

  window.scrollTo(0, 0)
})


/**
 * 创建全局的事件调度器，详见：https://vuejs.org/v2/guide/migration.html#dispatch-and-broadcast-replaced
 *
 * 监听事件： E.$on("event-name", [func])
 * 发布事件：E.$emit("event-name", [data])
 * 取消监听：E.$off("event-name",[func])
 */
global.E = window.E = new Vue()


/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  template: '<App/>'
}).$mount('#app')


//引入 定时器 模块
// import('./schedule')