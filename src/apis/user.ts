import { get, post } from '@/utils/request';
/*  登录 */
export const login = (data: { mobile: any; password: any }) => post('login', data);
/*  获取菜单权限 */
export const getAuthMenu = () => get('/base/getAuthMenu', {});
