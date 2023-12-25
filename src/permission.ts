 import router from './routes';
 
router.beforeEach((to, from, next) => {
   next();
  //  const token = localStorage.getItem('token') || '';
  //  if (!token && to.path !== '/login') {
  //    next({ path: '/login' });
  //  } else {
  //    next();
  //  }
 });
 