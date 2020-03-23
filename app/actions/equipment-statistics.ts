/*
 * @Author: your name
 * @Date: 2020-03-19 11:47:05
 * @LastEditTime: 2020-03-19 20:35:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \jiahua-desktop\app\actions\equipment-statistics.ts
 */

import { getCommonUseEquipmentTag } from '@/models/common';
import { getEquipmentTagList } from '@/models/equipment-tag';
import { setEquipmentTags } from './equipment-tag';
import { setSpin } from './common';

// 设置加载状态spin
export const setCommonDrawerVisible = (
  visbile: boolean
): SetCommonDrawerVisibleAction => {
  return {
    type: 'SET_COMMON_DRAWER_VISIBLE',
    data: visbile
  };
};
// 设置常用标签列表
export const setCommonTagList = (list: string[]): setCommonTagList => {
  return {
    type: 'SET_COMMON_TAG_LIST',
    data: list
  };
};
// 获取常用设备标签和所有设备标签
export const getCommonAndAllEquipmentTag = () => async (
  dispatch: Dispatch
): Promise<void> => {
  dispatch(setSpin(true));
  const [commonTags, tags] = await Promise.all([
    getCommonUseEquipmentTag(),
    getEquipmentTagList()
  ]);
  dispatch(setEquipmentTags(tags));
  dispatch(setCommonTagList(commonTags));
  dispatch(setSpin(false));
};
declare global {
  interface EquipmentStatisticsState {
    commonDrawerVisible: boolean;
    commonTagList: string[];
  }
  interface SetCommonDrawerVisibleAction {
    type: 'SET_COMMON_DRAWER_VISIBLE';
    data: boolean;
  }
  interface setCommonTagList {
    type: 'SET_COMMON_TAG_LIST';
    data: string[];
  }
  type EquipmentStatisticsActions =
    | SetCommonDrawerVisibleAction
    | setCommonTagList;
}
