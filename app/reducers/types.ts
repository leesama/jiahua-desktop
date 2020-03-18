import { Dispatch as ReduxDispatch, Store as ReduxStore, Action } from 'redux';

declare global {
  type Dispatch = ReduxDispatch<Action<string>>;
  type StoreState = { tag: TagStates; common: CommonState };
}
export type Store = ReduxStore<Action<string>>;
