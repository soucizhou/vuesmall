import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import toast from 'components/common/toast'
import FastClick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

//安装toast插件
Vue.use(toast)
Vue.use(VueLazyLoad, {
  // loading:require('assets/img/common/loading.gif')
})

Vue.config.productionTip = false
//解决移动端300ms延迟
FastClick.attach(document.body)

Vue.prototype.$bus = new Vue()

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')



