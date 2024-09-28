import router from './routes';
import Cookies from 'js-cookie';

router.beforeEach((to, from, next) => {
   const token = Cookies.get('token') || '';
   if (!token && to.path !== '/login') {
      next({ path: '/login' });
   } else {
      next();
   }
});
