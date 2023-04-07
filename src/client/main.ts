import "./style.css";

import { createApp } from "vue";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { router } from "./router";
import App from "./App.vue";
//@ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';

const app = createApp(App);

app.use(router)
app.use(ElementPlus, { locale: zhCn })
app.mount('#app');