import {SIGNIN, SIGNIN_SUCCESS, SIGNIN_FAILURE} from "../actions/user";

const INITIAL_STATE = {userId: null, status: null, error: null, loading: false};

export default function (state = INITIAL_STATE, action) {
  let error;

  switch (action.type) {
    case SIGNIN:
      return {...state, userId: null, status: 'signin', error: null, loading: true};
    case SIGNIN_SUCCESS:
      return {...state, userId: action.response.userId, status: 'authenticated', error: null, loading: false};
    case SIGNIN_FAILURE:
      error = action.response.title + ' ' + action.response.error.message;
      return {...state, userId: null, status: 'signin', error: error, loading: false};
    case SIGNUP:
      return {...state, userId: null, status: 'signup', error: null, loading: true};
    case SIGNUP_SUCCESS:
      return {...state, userId: action.response.userId, status: 'signin', error: null, loading: false};
    case SIGNUP_FAILURE:
      error = action.response.title + ' ' + action.response.error.message;
      return {...state, userId: null, status: 'signin', error: error, loading: false};
    default:
      return state;
  }
}
