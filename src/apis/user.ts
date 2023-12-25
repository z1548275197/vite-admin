import { get, post } from '@/utils/request';
/*  登录 */
export const login = (data: any) => post('login', data);
/*  注册 */
export const registerUser = (data: any) => post('/auth/register', data);
/*  获取菜单权限 */
export const getAuthMenu = () => get('/base/getAuthMenu', {});
