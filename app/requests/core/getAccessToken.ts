/* eslint-disable consistent-return */
import Store from 'electron-store';
import { appid, secret } from '@/config';

const store = new Store();
const requestUrlSuffix = 'cgi-bin/token?grant_type=client_credential';

const updateAccessToken = async () => {
  const res = await $api.request(
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

const getAccessToken = async (): promise<void> => {
  // 读取文件
  try {
    const token = store.get('token');
    const createTime = new Date(token.createTime).getTime();
    const nowTime = new Date().getTime();
    if ((nowTime - createTime) / 3600000 >= 2) {
      await updateAccessToken();
      await getAccessToken();
    }
    return token.accessToken;
  } catch (error) {
    await updateAccessToken();
    await getAccessToken();
  }
};

setInterval(async () => {
  await updateAccessToken();
}, (7200 - 300) * 1000);

export default getAccessToken;
