import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'

const pinia = createPinia()

pinia.use(() => {
  console.log('我是 pinia 的插件')
})

createApp(App).use(pinia).mount('#app')
