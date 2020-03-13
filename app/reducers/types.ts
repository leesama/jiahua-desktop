import { Dispatch as ReduxDispatch, Store as ReduxStore, Action } from 'redux';

export type counterStateType = {
  counter: number;
};
declare global {
  type Dispatch = ReduxDispatch<Action<string>>;
  type StoreState = { tag: TagStates; common: CommonState };
}
export type Store = ReduxStore<counterStateType, Action<string>>;
