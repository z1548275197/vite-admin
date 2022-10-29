import { createApp } from 'vue'
import router from './routes'
import './styles/base.scss'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
import App from './App.vue'
import './permission';

const app = createApp(App);
app.use(router);
app.use(ElementPlus);
app.mount('#app');

