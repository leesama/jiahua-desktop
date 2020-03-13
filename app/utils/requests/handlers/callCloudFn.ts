import { env } from '@/config';
import getAccessToken from '../core/getAccessToken';
import request from '../core/request';

const callCloudFn = async (fnName: string, params = {}) => {
  const ACCESS_TOKEN = await getAccessToken();
  const requestUrlSuffix = `tcb/invokecloudfunction?access_token=${ACCESS_TOKEN}&env=${env}&name=${fnName}`;
  const res = await request(
    requestUrlSuffix,
    { ...params },
    { method: 'POST' }
  );
  return res;
};

export default callCloudFn;
