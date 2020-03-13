import { env } from '../../../config';
import getAccessToken from '../core/getAccessToken';
import request from '../core/request';

const callCloudDB = async (fnName: string, query = {}) => {
  const ACCESS_TOKEN = await getAccessToken();
  const requestUrlSuffix = `tcb/${fnName}?access_token=${ACCESS_TOKEN}`;
  const data = await request(
    requestUrlSuffix,
    { query, env },
    { method: 'POST' }
  );
  return data;
};

export default callCloudDB;
