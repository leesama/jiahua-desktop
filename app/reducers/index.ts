/*
 * @Author: your name
 * @Date: 2020-03-06 20:33:19
 * @LastEditTime: 2020-03-19 12:00:59
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \jiahua-desktop\app\reducers\index.ts
 */
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import common from './common';
import tag from './tag';
import equipmentStatistics from './equipment-statistics';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    tag,
    equipmentStatistics,
    common
  });
}
