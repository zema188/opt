import './assets/styles/main.css'

import Home from './pages/index.vue'

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'

const app = createApp(App)

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: Home },
    ]
})

app.use(router)
app.mount('#app')
