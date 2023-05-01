import { createRouter, createWebHashHistory } from 'vue-router';

import MainView from './views/MainView.vue';
import LoginView from './views/LoginView.vue';
import AdminView from './views/AdminView.vue';

const routes = [
    { path: '/', component: MainView },
    { path: '/login', component: LoginView },
    { path: '/admin', component: AdminView },
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
})