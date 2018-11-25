import Vue from 'vue'
import 'mint-ui/lib/style.css'
import {Button} from '_mint-ui@2.2.13@mint-ui'
import App from './App.vue'
import router from './router'
import store from './store'
import './mock/mockServer' // 加载mockServer即可
import VueResource from 'vue-resource'
import '../static/iconfont.css'
Vue.use(VueResource)
Vue.component(Button.name, Button)

Vue.config.productionTip = false // 产品说明

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
