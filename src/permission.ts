 import router from './routes';
 
 router.beforeEach((to, from, next) => {
   const token = localStorage.getItem('token') || '';
   console.log(token, '我的')
   if (!token && to.path !== '/login') {
     next({ path: '/login' });
   } else {
     next();
   }
 });
 