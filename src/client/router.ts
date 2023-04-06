import { createRouter, createWebHashHistory } from 'vue-router';

import MainView from './views/MainView.vue';
import LoginView from './views/LoginView.vue';

const routes = [
    { path: '/', component: MainView },
    { path: '/login', component: LoginView },
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
})