import router from './routes';
import Cookies from 'js-cookie';
import NProgress from 'nprogress'; // Progress 进度条
import 'nprogress/nprogress.css'; // Progress 进度条样式

let loadAsyncRouter = false;
const whiteList = ['/login', '/404']; // 不重定向白名单
router.beforeEach((to, from, next) => {
   console.log('to::', to);
   console.log(router.getRoutes(), '所有路由');
   NProgress.start();
   const token = Cookies.get('token') || '';
   if (whiteList.includes(to.path)) {
      next();
   } else if (!token) {
      next({ path: '/login' });
   } else if (!loadAsyncRouter) {
      loadAsyncRouter = true;
      router.addRoute({
         path: '/test3',
         name: 'Test333',
         component: () => import('@/views/test/index'),
         meta: {
            title: '测试',
         },
      });
      router.addRoute({
         path: '/404',
         name: '404',
         component: () => import('@/views/404'),
         meta: {
            title: '404',
         },
      });
      router.addRoute({
         path: '/:pathMatch(.*)',
         redirect: '/404',
      });
      next({
         ...to,
         replace: true
      });
   } else {
      next()
   }
});

router.afterEach(() => {
   NProgress.done(); // 结束Progress
});
