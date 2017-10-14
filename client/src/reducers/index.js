import {combineReducers} from 'redux';
import user from './user';
import board from './board';
import account from "./account";

const rootReducer = combineReducers({
  user,
  board,
  account,
});

export default rootReducer;

