import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import common from './common';
import tag from './tag';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    tag,
    common
  });
}
