import {combineReducers} from 'redux';
import user from './user';
import board from './board';
import account from "./account";
import content from "./content";

const rootReducer = combineReducers({
  user,
  board,
  account,
  content
});

export default rootReducer;

