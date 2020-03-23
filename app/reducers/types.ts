/*
 * @Author: your name
 * @Date: 2020-03-06 20:33:19
 * @LastEditTime: 2020-03-19 12:38:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \jiahua-desktop\app\reducers\types.ts
 */
import { Dispatch as ReduxDispatch, Store as ReduxStore, Action } from 'redux';

declare global {
  type Dispatch = ReduxDispatch<Action<string>>;
  type StoreState = {
    tag: EquipmentTagState;
    common: CommonState;
    equipmentStatistics: EquipmentStatisticsState;
  };
}
export type Store = ReduxStore<StoreState, Action<string>>;
