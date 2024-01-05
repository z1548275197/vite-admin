import router from '@/routes/index';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import qs from 'querystring';
import Cookies from 'js-cookie';
import { isObject, changeForm, getCookie } from './helper';

const apiUrl: any = import.meta.env.VITE_BASE_API;

const axiosReq = axios.create({
  baseURL: apiUrl,
  timeout: 10000,
  withCredentials: false,
});
axiosReq.interceptors.request.use(
  (conf: any) => {
    const { baseURL, method, headers, data, url } = conf;
    const config = {
      ...conf,
      baseURL: baseURL,
      headers: {
        ...headers,
        'Content-Type': 'application/x-www-form-urlencoded',
        'token': Cookies.get('PHPSESSID') || ''
      },
    };
    config.data = qs.stringify(data);
    return config;
  },
  (error) => Promise.reject(error)
);

axiosReq.interceptors.response.use(
  (res: any) => {
    const { data, status = '', config } = res;
    if (config.responseType === 'blob') return data;
    if (status === 200) {
      const { code, msg } = data;
      switch (code) {
        case 0:
          return data.data;
        case 4: // token失效
          ElMessage.error(msg);
          return Promise.reject(res);
        default:
          ElMessage.error(msg);
          return Promise.reject(data);
      }
    }
    return Promise.reject(data);
  },
  (error) => {
    return Promise.reject(error);
  }
);

// get请求
export const get = (url: string, params: any, conf?: any) => {
  const config: any = {
    method: 'GET',
    url,
    params: { ...params, is_form: true },
  };
  if (isObject(conf)) {
    Object.assign(config, conf);
  }
  return axiosReq(config);
};

// post请求
export const post = (url: string, data?: any, conf?: any) => {
  const config: any = {
    method: 'POST',
    url,
    data: { ...data, is_form: true },
  };
  if (isObject(conf)) {
    Object.assign(config, conf);
  }
  return axiosReq(config);
};

export default {
  get,
  post,
};
