import { get, post } from '@/utils/request';
 // 保存合约模板 
export const createContract = (data: any) => post('/api/contract/createContractMapping', data);

// 获取合约模板
export const getContractData = (data: any) => post('/api/contract/getContractMapping', data);



