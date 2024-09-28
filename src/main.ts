import { createApp } from 'vue'
import router from './routes'
import App from '@/App.vue'
import store from '@/store';
import ElementPlus from 'element-plus';
import '@/permission';

import '@/styles/index.scss';
import 'element-plus/dist/index.css';

const app = createApp(App);
app.use(router);
app.use(ElementPlus, { size: 'small', zIndex: 3000 });
app.use(store);
app.mount('#app');

