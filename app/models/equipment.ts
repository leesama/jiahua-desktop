/*
 * @Author: your name
 * @Date: 2020-03-11 20:39:50
 * @LastEditTime: 2020-03-20 11:19:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \jiahua-desktop\app\models\equipment.ts
 */
import callCloudDB from '../utils/requests/handlers/callCloudDB';
import { jsonstringify } from '../utils/util';
import { getEquipmentTagList } from './equipment-tag';
/**
 * 新增设备
 * @param equipmentInfo
 */
export const createEquipment = async (
  equipmentInfo: FormValue
): Promise<boolean> => {
  const query = `db.collection('equipment').add({data:${jsonstringify(
    equipmentInfo
  )}})`;
  const { errcode } = await callCloudDB('databaseadd', query);
  return errcode === 0;
};
/**
 * 获取设备信息同时还需要请求设备的标签信息用于确定表头
 * @param equipmentInfo
 */
export const getEquipmentListAndTableColumn = async (
  pageNum: number
): Promise<{
  Total: number;
  data: TableItem[];
  formHeader: TableItem[];
  tagList: TagItem[];
}> => {
  const [{ Total, data }, tagList] = await Promise.all([
    getEquipments(pageNum),
    getEquipmentTagList()
  ]);
  let formHeader: TableItem[] = [];
  // 从tag中提取必填项数据组成表头
  for (let index = 0; index < tagList.length; index++) {
    if (formHeader.length > 7) break;
    const tagItem = tagList[index];
    if (tagItem.tagRequire) {
      const { tagName, key } = tagItem;
      formHeader.push({ title: tagName, dataIndex: tagName, key });
    }
  }
  return { Total, data, formHeader, tagList };
};

/**
 * 获取设备信息
 * @param pageNum 页码
 */
export const getEquipments = async (
  pageNum: number
): Promise<{ data: TableItem[]; Total: number }> => {
  const query = `db.collection('equipment').limit(10).skip(${(pageNum - 1) *
    10}).get()`;
  let {
    data,
    pager: { Total }
  } = await callCloudDB('databasequery', query);
  data = data.map((i: string) => {
    const tagItem = JSON.parse(i);
    tagItem.key = tagItem._id;
    return tagItem;
  });
  return { data, Total };
};

/**
 * 更新设备信息
 */
export const updateEquipment = async (newData: TableItem): Promise<boolean> => {
  const query = `db.collection('equipment').doc('${
    newData._id
  }').update({data:${jsonstringify(newData)}})`;
  const { errcode } = await callCloudDB('databaseupdate', query);
  return errcode === 0;
};
/**
 * 删除标签
 * @param id
 */
export const deleteEquipmentByid = async (id: string): Promise<boolean> => {
  const query = `db.collection('equipment').doc('${id}').remove()`;
  const { errcode } = await callCloudDB('databasedelete', query);
  return errcode === 0;
};
/**
 * 根据标签名获取聚合分组标签信息
 */
export const getGroupInfoByTagName = async (
  tagName: string
): Promise<boolean> => {
  const query = `db.collection('equipment').aggregate().group({_id: '$${tagName}',count: $.sum(1),tagGroup: $.push('$$ROOT')}).end()`;
  const { data } = await callCloudDB('databaseaggregate', query);
  return data.map((i: string) => JSON.parse(i));
};
