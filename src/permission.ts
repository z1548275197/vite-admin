 import router from './routes';
 
 router.beforeEach((to, from, next) => {
  //  const token = localStorage.getItem('token') || '';
  //  console.log(token, '我的')
   if (to.path !== '/record') {
     next({ path: '/record' });
   } else {
     next();
   }
 });
 