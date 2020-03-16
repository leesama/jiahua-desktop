import callCloudDB from '../utils/requests/handlers/callCloudDB';
import { jsonstringify } from '../utils/util';
import { getEquipmentTagList } from './equipment-tag';
import moment from 'moment';
import { momentFormat } from '../config';
moment.locale('zh-cn');
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
  // 从tag中提取数据组成表头
  for (let index = 0; index < tagList.length; index++) {
    if (formHeader.length > 7) break;
    const tagItem = tagList[index];
    if (tagItem.tagRequire) {
      const { tagName, key } = tagItem;
      formHeader.push({ title: tagName, dataIndex: tagName, key });
    }
  }
  console.log(formHeader);

  // // 将时间标签数据转换格式
  // // 时间标签数组
  // const timeTagNameArr = tagList
  //   .filter(i => i.tagType == '时间')
  //   .map(i => i.tagName);
  // for (const i of data) {
  //   for (const j of timeTagNameArr) {
  //     i[j] && (i[j] = moment(i[j]).format(momentFormat));
  //   }
  // }
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
