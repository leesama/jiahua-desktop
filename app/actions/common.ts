/*
 * @Author: your name
 * @Date: 2020-03-11 13:56:06
 * @LastEditTime: 2020-03-19 12:53:11
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \jiahua-desktop\app\actions\common.ts
 */
// 设置加载状态spin
export const setSpin = (spin: boolean): SetSpinAction => {
  return {
    type: 'SET_SPIN',
    data: spin
  };
};

declare global {
  interface CommonState {
    spinning: boolean;
  }
  interface SetSpinAction {
    type: 'SET_SPIN';
    data: boolean;
  }
  type CommonActions = SetSpinAction;
}
