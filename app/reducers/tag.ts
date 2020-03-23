/*
 * @Author: your name
 * @Date: 2020-03-08 15:20:44
 * @LastEditTime: 2020-03-19 11:41:35
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \jiahua-desktop\app\reducers\tag.ts
 */
const initState = { tags: [] };
export default (
  state = initState,
  action: EquipmentTagActions
): EquipmentTagState => {
  switch (action.type) {
    case 'SET_TAG':
      return { ...state, tags: [...action.data] };
    default:
      return state;
  }
};
