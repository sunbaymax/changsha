// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Moment from 'moment'
Vue.prototype.moment=Moment
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import VCharts from 'v-charts'
Vue.use(VCharts)

// import 'lib-flexible/flexible'
import './utils/flexible.js'
import axios from 'axios'
Vue.prototype.$axios = axios
import qs from 'qs';
Vue.prototype.$qs = qs;
import DonMessage from '@/utils/message'
Vue.prototype.$message = DonMessage
// import Mock from './mock'
// Mock.bootstrap();
axios.defaults.baseURL ='http://127.0.0.1:8001/';//http://59.110.11.42:38405 http://114.64.253.136:8011/http://192.168.1.27:8011 /http://127.0.0.1:8011
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
// axios.defaults.transformRequest = [function (data) {
//   let ret = ''
//   for (let it in data) {
//     ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
//   }
//   return ret
// }]

// css
import './assets/css/style.css'

router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    sessionStorage.removeItem('user');
  }
  let user = JSON.parse(sessionStorage.getItem('user'));
  if (!user && to.path != '/login') {
    next({
      path: '/login'
    })
  } else {
    next()
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
