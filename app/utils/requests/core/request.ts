/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable promise/no-return-wrap */
import axios, { AxiosRequestConfig } from 'axios';
import path from 'path';
// import { errorAction } from './handle-response';

// axios 跨域请求携带 cookie
axios.defaults.withCredentials = true;

const DEFAULT_CONFIG: RequestOptions = {
  method: 'POST',
  host: 'api.weixin.qq.com',
  protocol: 'https://',
  baseUrl: '/',
  timeout: 30000,
  loading: false,
  errorType: 'notification',
  checkStatus: true,
  headers: {
    'Content-Type': 'application/json'
  }
};

// 默认传递的参数
const DEFAULT_PARAMS = {};

/**
 * 发起一个请求
 * @param apiPath
 * @param params
 * @param optionsSource
 */
export default async (
  apiPath: string,
  params?: RequestParams,
  optionsSource?: RequestOptions
) => {
  const options: RequestOptions = {
    ...DEFAULT_CONFIG,
    ...optionsSource
  };
  const {
    method,
    protocol,
    host,
    baseUrl,
    headers,
    responseType,
    checkStatus,
    formData
  } = options;
  const sendData: AxiosRequestConfig = {
    url: `${protocol}${path.join(host || '', baseUrl || '', apiPath || '')}`,
    method,
    headers,
    responseType
  };

  const paramsData = { ...DEFAULT_PARAMS, ...params };

  if (method === 'GET') {
    sendData.params = params;
  } else if (formData) {
    const formData = new FormData();
    Object.keys(paramsData).forEach(key => {
      formData.append(key, paramsData[key]);
    });
    sendData.data = formData;
  } else {
    sendData.data = paramsData;
  }

  return axios(sendData)
    .then(res => {
      const { data, status } = res;
      if (!checkStatus || status === 200) {
        return data;
      }
      return Promise.reject(data);
    })
    .catch(async err => {
      // await errorAction(err, sendData, options);
      return Promise.reject({ ...err, path: apiPath, sendData, resData: err });
    });
};

/** - interface - split ------------------------------------------------------------------- */

declare global {
  /**
   * 网络请求参数
   */
  interface RequestParams {
    [key: string]: unknown;
  }

  /**
   * 网络请求返回值
   */
  interface RequestRes {
    /** 状态码,成功返回 200 */
    code: number;
    /** 错误消息 */
    message: string;
    /** 返回数据 */
    data: unknown;
  }

  /**
   * 请求选项
   */
  interface RequestOptions {
    /** 请求类型: [POST | GET] 默认: POST */
    method?: 'GET' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'POST' | 'PUT' | 'PATCH';
    /** 基本 url, 没有特殊需求无需传递 */
    baseUrl?: string;
    /** 请求域名 */
    host?: string;
    /** 协议 */
    protocol?: string;
    /** 使用 formData 传递参数 */
    formData?: boolean;
    /** 接口分组 */
    group?: string;
    /** 超时时间,单位: ms */
    timeout?: number;
    /** 请求过程中是否显示 Loading */
    loading?: boolean;
    /** 发生错误时提示框类型, 默认: notification */
    errorType?: 'notification' | 'modal' | false;
    /** 自定义请求头 */
    headers?: unknown;
    /** 类型动态设置 */
    responseType?:
      | 'arraybuffer'
      | 'blob'
      | 'document'
      | 'json'
      | 'text'
      | 'stream'
      | undefined;
    /** 是否校验请求状态 */
    checkStatus?: boolean;
  }
}
