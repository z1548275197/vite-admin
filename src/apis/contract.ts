import { get, post } from '@/utils/request';
 // 保存合约模板 
export const createContract = (data: any) => post('/api/contract/createContractMapping', data);

// 获取合约模板
export const getContractData = (data: any) => get('/api/contract/getContractMapping', data);

// 获取合约关联业务字段
export const getContractField = (data: any = {}) => get('/api/contract/getContractField', data);

