/*
 * @Author: your name
 * @Date: 2020-03-08 22:59:20
 * @LastEditTime: 2020-03-19 20:33:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \jiahua-desktop\app\models\equipment-tag.ts
 */
import callCloudDB from '../utils/requests/handlers/callCloudDB';
import { jsonstringify } from '../utils/util';

export const getEquipmentTagList = async (): Promise<TagItem[]> => {
  const query =
    'db.collection("equipment-tag").orderBy("tagWeight", "asc").limit(999).get()';
  let { data } = await callCloudDB('databasequery', query);
  data = data.map((i: string) => {
    const tagItem = JSON.parse(i) as TagItem;
    tagItem.key = tagItem._id;
    return tagItem;
  });

  return data as TagItem[];
};

export const updateEquipmentTagById = async (
  id: string,
  newData: TagItem
): Promise<boolean> => {
  const query = `db.collection('equipment-tag').doc('${id}').update({data:${jsonstringify(
    newData
  )}})`;
  const { errcode } = await callCloudDB('databaseupdate', query);
  return errcode === 0;
};

export const deleteEquipmentTagByid = async (id: string): Promise<boolean> => {
  const query = `db.collection('equipment-tag').doc('${id}').remove()`;
  const { errcode } = await callCloudDB('databasedelete', query);
  return errcode === 0;
};
/**
 * 获取标签最大权重
 * @param id
 */

export const getMaxEquipmentTagWeight = async (): Promise<string> => {
  const query = `db.collection('equipment-tag').orderBy('tagWeight', 'desc').skip(0).limit(1).get()`;

  const result = await callCloudDB('databasequery', query);
  const maxTagWeight = JSON.parse(result.data[0]).tagWeight + 100;

  return maxTagWeight;
};
/**
 * 新增标签
 * @param newTag
 */
export const creatEquipmentTag = async (newTag: TagItem): Promise<boolean> => {
  // 查重
  const checkHasExistQuery = `db.collection('equipment-tag').where({tagName:'${newTag.tagName}'}).limit(0).skip(1).get()`;
  const result = await callCloudDB('databasequery', checkHasExistQuery);
  if (result.data.length > 0) {
    return false;
  }
  // 新增

  // 如果tagValueList,添加一个空的tagValueList (针对于时间标签)
  !newTag.tagValueList && (newTag.tagValueList = []);
  const query = `db.collection('equipment-tag').add({data:${jsonstringify(
    newTag
  )}})`;

  const { errcode } = await callCloudDB('databaseadd', query);
  return errcode === 0;
};
