import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import FastClick from 'fastclick'
/* import VueLazyLoad from 'vue-lazyload' */

import toast from 'components/common/toast'

Vue.config.productionTip = false

//添加事件总线对象
Vue.prototype.$bus = new Vue()
//安装toast
Vue.use(toast)
//解决客户端300ms延迟
FastClick.attach(document.body)
//使用懒加载  把src改成v-lazy
/* Vue.use(VueLazyLoad, {
  loading:require()//在显示图片前显示
}) */

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')