/*
 * @Author: your name
 * @Date: 2020-03-08 15:42:56
 * @LastEditTime: 2020-03-23 14:19:14
 * @LastEditors: leecho
 * @Description: In User Settings Edit
 * @FilePath: \jiahua-desktop\app\actions\equipment-tag.ts
 */
import {
  getEquipmentTagList,
  updateEquipmentTagById,
  deleteEquipmentTagByid
} from '../models/equipment-tag';
import { message } from 'antd';
import { setSpin } from './common';
// 设置标签
export const setEquipmentTags = (tagList: TagItem[]): SetEquipmentTagAction => {
  return {
    type: 'SET_TAG',
    data: tagList
  };
};
/** 清除。获取。设置标签
 *
 *
 */
export const getEquipmentTags = (callback?: () => void) => async (
  dispatch: Dispatch
) => {
  dispatch(setSpin(true));
  dispatch(setEquipmentTags([]));
  const data = await getEquipmentTagList();
  dispatch(setEquipmentTags(data));
  callback && callback();
  dispatch(setSpin(false));
};
/**
 * 更新标签
 * 更新store数据，更新数据库
 */
export const updateEquipmentTags = (
  id: string,
  data: TagItem,
  newData: TagItem[]
) => async (dispatch: Dispatch) => {
  dispatch(setEquipmentTags(newData));
  const isOk = await updateEquipmentTagById(id, data);
  isOk ? message.success('数据修改成功') : message.error('数据修改失败');
};
/**
 * 删除标签
 * @param id
 * @param tagList
 */
export const deleteEquipmentTag = (id: string, tagList: TagItem[]) => async (
  dispatch: Dispatch
) => {
  const index = tagList.findIndex(i => i._id === id);
  tagList.splice(index, 1);
  dispatch(setEquipmentTags(tagList));
  const isOk = await deleteEquipmentTagByid(id);
  isOk ? message.success('数据删除成功') : message.error('数据删除失败');
};

declare global {
  interface TagItem {
    _id: string;
    key: string;
    tagName: string;
    tagType: '文字' | '数字' | '整数' | '时间';
    tagValueList: string[];
    tagRequire: boolean;
    tagWeight: number;
  }
  interface EquipmentTagState {
    tags: TagItem[];
  }
  interface SetEquipmentTagAction {
    type: 'SET_TAG';
    data: TagItem[];
  }
  type EquipmentTagActions = SetEquipmentTagAction;
}
