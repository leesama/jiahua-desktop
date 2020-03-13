/* eslint-disable consistent-return */
import Store from 'electron-store';
import { appid, secret } from '@/config';
import request from './request';

const store = new Store();
const requestUrlSuffix = 'cgi-bin/token?grant_type=client_credential';

const updateAccessToken = async () => {
  const res = await request(
    requestUrlSuffix,
    { appid, secret },
    { method: 'GET', responseType: 'text' }
  );
  if (res.access_token) {
    store.set('token', {
      accessToken: res.access_token,
      createTime: new Date()
    });
  } else {
    await updateAccessToken();
  }
};

const getAccessToken = async (): Promise<string> => {
  // 读取文件
  const token = store.get('token');
  // 如果token有值
  if (token) {
    const createTime = new Date(token.createTime).getTime();
    const nowTime = new Date().getTime();
    // 如果token过期，更新后返回
    if ((nowTime - createTime) / 3600000 >= 2) {
      await updateAccessToken();
      return await getAccessToken();
    } else {
      // 没过期直接返回
      return token.accessToken;
    }
  } else {
    // 如果token没值，也就是第一次加载应用，请求token
    await updateAccessToken();
    return await getAccessToken();
  }
};

setInterval(async () => {
  await updateAccessToken();
}, (7200 - 300) * 1000);

export default getAccessToken;
