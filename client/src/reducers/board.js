import {
  HOME, FILES, ACCOUNT, LOADING_ERROR,
} from "../actions/board";

const INITIAL_STATE = {toLoad: 'home', pageTitle: 'Home', currentPath: '', error: null, alert: null};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case HOME:
      return {...state, toLoad: 'home', pageTitle: 'Home', currentPath: '', error: null, alert: null};
    case FILES:
      return {...state, toLoad: 'files', pageTitle: 'Dropbox', currentPath: '', error: null, alert: null};
    case ACCOUNT:
      return {...state, toLoad: 'account', pageTitle: 'Personal Account', error: null, alert: null};
    case LOADING_ERROR:
      return {...state, toLoad: null, pageTitle: '', error: action.response, alert: null};
    default:
      return state;
  }
}
