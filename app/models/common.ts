/*
 * @Author: your name
 * @Date: 2020-03-18 18:15:58
 * @LastEditTime: 2020-03-19 20:37:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \jiahua-desktop\app\models\common.ts
 */
import callCloudDB from '../utils/requests/handlers/callCloudDB';
import { jsonstringify } from '../utils/util';
import { getEquipmentTagList } from './equipment-tag';

/**
 * 获取常用设备标签,用于搜索
 */
export const getCommonUseEquipmentTag = async (): Promise<string[]> => {
  const query =
    'db.collection("common").where({name:"common-use-equipment-tag"}).get()';
  let { data } = await callCloudDB('databasequery', query);
  return JSON.parse(data[0]).value;
};

/**
 * 设置常用标签
 */
export const setCommonUseEquipmentTag = async (
  newData: string[]
): Promise<boolean> => {
  const query = `db.collection("common").where({name:"common-use-equipment-tag"}).update({data:{value:${jsonstringify(
    newData
  )}}})`;
  const { errcode } = await callCloudDB('databaseupdate', query);
  return errcode === 0;
};
