/* eslint-disable no-param-reassign */
// 用于对象转换为query查询字符串
export const jsonstringify = (obj: any): string => {
  const type = typeof obj;
  if (type !== 'object') {
    if (/string|undefined|function/.test(type)) {
      obj = `"${obj}"`;
    }
    return String(obj);
  }
  const arr = Array.isArray(obj);
  const json = [];
  for (const i in obj) {
    let j = obj[i];
    const type = typeof j;
    if (/string|undefined|function/.test(type)) {
      j = `"${j}"`;
    } else if (type === 'object') {
      j = jsonstringify(j);
    }
    json.push((arr ? '' : `${i}:`) + String(j));
  }
  return (arr ? '[' : '{') + String(json) + (arr ? ']' : '}');
};
