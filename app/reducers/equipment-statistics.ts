/*
 * @Author: your name
 * @Date: 2020-03-19 11:57:37
 * @LastEditTime: 2020-03-19 17:56:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \jiahua-desktop\app\reducers\equipment-statistics.ts
 */

const initState: EquipmentStatisticsState = {
  commonDrawerVisible: false,
  commonTagList: []
};
export default (
  state = initState,
  action: EquipmentStatisticsActions
): EquipmentStatisticsState => {
  switch (action.type) {
    case 'SET_COMMON_DRAWER_VISIBLE':
      return { ...state, commonDrawerVisible: action.data };
    case 'SET_COMMON_TAG_LIST':
      return { ...state, commonTagList: action.data };
    default:
      return state;
  }
};
