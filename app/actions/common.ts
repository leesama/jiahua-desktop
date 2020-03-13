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
