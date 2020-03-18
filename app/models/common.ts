import callCloudDB from '../utils/requests/handlers/callCloudDB';
import { jsonstringify } from '../utils/util';
import { getEquipmentTagList } from './equipment-tag';

/**
 * 获取常用设备标签,用于搜索
 */
export const getCommonUseEquipmentTag = async (): Promise<TagItem> => {
  const query =
    'db.collection("common").where({name:"common-use-equipment-tag"}).get()';
  let { data } = await callCloudDB('databasequery', query);
  return JSON.parse(data[0]).value;
};
/**
 * 获取常用和总设备标签数据
 */
export const getCommonAndAllEquipmentTag = async () => {
  return await Promise.all([getCommonUseEquipmentTag(), getEquipmentTagList()]);
};
