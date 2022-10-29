import axios from 'axios';
import { ElMessage, ElLoading } from 'element-plus';
import { isObject, changeForm, getCookie } from './helper';
import { useRouter } from 'vue-router'

const apiUrl: any = import.meta.env.VITE_BASE_API;

const router = useRouter();
console.log(router, 'router');

let loading: any;
const axiosReq = axios.create({
  baseURL: apiUrl,
  timeout: 10000,
  withCredentials: false,
});
const token = getCookie('token');
axiosReq.interceptors.request.use(
  (conf: any) => {
    const { baseURL, method, headers, data, url } = conf;
    const config = {
      ...conf,
      baseURL: baseURL,
      headers: {
        ...headers,
        'Content-Type': 'application/x-www-form-urlencoded',
        authKey: 'ea178d0ec27cddd56829e65fd9a9f8a7',
      },
    };
    if (method === 'post') {
      config.data = changeForm(data);
    }
    loading = ElLoading.service({
      lock: true,
      text: 'Loading',
      background: 'rgba(0, 0, 0, 0.7)',
    })
    setTimeout(() => {
      loading.close()
    }, 2000)
  
    return config;
  },
  (error) => Promise.reject(error)
);

axiosReq.interceptors.response.use(
  (res: any) => {
    const { data, status = '', config } = res;
    loading.close()
  
    if (config.url.includes('upload.qiniup')) {
      return data;
    }
    if (config.responseType === 'blob') return data;
    if (status === 200) {
      const { code, msg } = data;
      switch (code) {
        case 1:
          return data || {};
        case 4: // token失效
          ElMessage.error(msg);
          localStorage.removeItem('authInfo');
          localStorage.removeItem('token');
          // console.log(router)
          // router.push('/');
          const local: any = window.location;
          local.reload();
          return Promise.reject(res);
        default:
          ElMessage.error(msg);
          return Promise.reject(data);
      }
    }
    return Promise.reject(data);
  },
  (error) => {
    loading.close()
  
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
