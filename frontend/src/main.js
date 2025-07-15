import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router' //Where we fetch the routes

const app = createApp(App)
app.use(router)
app.mount('#app')
