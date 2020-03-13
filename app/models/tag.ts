import callCloudDB from '../utils/requests/handlers/callCloudDB';
import { jsonstringify } from '../utils/util';

export const getTagList = async (): Promise<TagItem[]> => {
  const query =
    'db.collection("tag").orderBy("tagWeight", "asc").limit(999).get()';
  let { data } = await callCloudDB('databasequery', query);
  data = data.map((i: string) => {
    const tagItem = JSON.parse(i) as TagItem;
    tagItem.key = tagItem._id;
    return tagItem;
  });

  return data as TagItem[];
};

export const updateTagById = async (
  id: string,
  newData: TagItem
): Promise<boolean> => {
  const query = `db.collection('tag').doc('${id}').update({data:${jsonstringify(
    newData
  )}})`;
  const { errcode } = await callCloudDB('databaseupdate', query);
  return errcode === 0;
};

export const deleteTagByid = async (id: string): Promise<boolean> => {
  const query = `db.collection('tag').doc('${id}').remove()`;
  const { errcode } = await callCloudDB('databasedelete', query);
  return errcode === 0;
};
/**
 * 获取标签最大权重
 * @param id
 */

export const getMaxTagWeight = async (): Promise<string> => {
  const query = `db.collection('tag').orderBy('tagWeight', 'desc').skip(0).limit(1).get()`;

  const result = await callCloudDB('databasequery', query);
  const maxTagWeight = JSON.parse(result.data[0]).tagWeight + 100;

  return maxTagWeight;
};
/**
 * 新增标签
 * @param newTag
 */
export const createTag = async (newTag: TagItem): Promise<boolean> => {
  const checkHasExistQuery = `db.collection('tag').where({tagName:'${newTag.tagName}'}).limit(0).skip(1).get()`;
  const result = await callCloudDB('databasequery', checkHasExistQuery);
  if (result.data.length > 0) {
    return false;
  }
  const query = `db.collection('tag').add({data:${jsonstringify(newTag)}})`;
  const { errcode } = await callCloudDB('databaseadd', query);
  return errcode === 0;
};
