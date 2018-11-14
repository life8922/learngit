import Vue from 'vue'
import 'mint-ui/lib/style.css'
import {Button} from 'mint-ui'
import App from './App.vue'
import router from './router'
import store from './store'
import VueResource from 'vue-resource'
Vue.use(VueResource)
Vue.component(Button.name, Button)

Vue.config.productionTip = false // 产品说明

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
