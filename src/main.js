import Vue from 'vue'
import App from './App.vue'
// import axios from 'axios'

Vue.config.productionTip = false

// const instance = axios.create(({
//   baseURL: `${process.env.baseURL}/${process.env.API_KEY}`
// }))

new Vue({
  render: h => h(App),
}).$mount('#app')
