import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getSign } from '@utils/sign';

const instance = axios.create({
  baseURL: 'https://openapi.tuyacn.com',
  timeout: 30000,
  headers: {
    client_id: 'npp4m9qh4jxx8repxp5u',
    t: new Date().getTime(),
  },
});

// 请求拦截器
instance.interceptors.request.use(
  function (config: AxiosRequestConfig<any>): AxiosRequestConfig<any> {
    const result = getSign.apply(config);
    config.headers.sign = result;
    config.headers.sign_method = 'HMAC-SHA256';
    config.headers.access_token='88d5c530f70debe0c5d0370a24c7c7e2'

    return config;
  },
  function (error: any) {
    console.log('请求错误', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  function (response: AxiosResponse<any>): any {
    console.log('得到的响应数据', response);
    return response;
  },
  function (error: any) {
    console.log('响应错误', error);
    // if (error.message.indexOf('timeout') !== -1) {
    //   console.log('网络超时');
    // } else if (error.message === 'Network Error') {
    //   console.log('网络连接错误');
    // } else {
    //   if (error.response.data) console.log(error.response.statusText);
    //   else console.log('接口路径找不到');
    // }

    return Promise.reject(error);
  }
);

export default instance;
