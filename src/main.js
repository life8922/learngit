import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueResource from 'vue-resource'
Vue.use(VueResource)

Vue.config.productionTip = false // 产品说明

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
