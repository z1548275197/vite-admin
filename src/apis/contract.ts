import { get, post } from '@/utils/request';
/*  登录 */
export const createContract = (data: any) => post('/api/contract/createContractMapping', data);

