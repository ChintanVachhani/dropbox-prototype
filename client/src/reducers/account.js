import {
  GET_USER_ACCOUNT, GET_USER_ACCOUNT_SUCCESS, GET_USER_ACCOUNT_FAILURE, UPDATE_USER_ACCOUNT, UPDATE_USER_ACCOUNT_SUCCESS,
  UPDATE_USER_ACCOUNT_FAILURE, GET_ACTIVITIES, GET_ACTIVITIES_SUCCESS, GET_ACTIVITIES_FAILURE,
} from "../actions/account";

const INITIAL_STATE = {user: null, error: null, alert: null, activities: null};

export default function (state = INITIAL_STATE, action) {

  switch (action.type) {
    case GET_USER_ACCOUNT:
      return {...state, user: null, error: null, alert: null};
    case GET_USER_ACCOUNT_SUCCESS:
      return {...state, user: action.response, error: null, alert: null};
    case GET_USER_ACCOUNT_FAILURE:
      return {...state, user: null, error: action.response, alert: null};
    case UPDATE_USER_ACCOUNT:
      return {...state, user: null, error: null, alert: null};
    case UPDATE_USER_ACCOUNT_SUCCESS:
      return {...state, user: action.response, error: null, alert: null};
    case UPDATE_USER_ACCOUNT_FAILURE:
      return {...state, user: null, error: action.response, alert: null};
    case GET_ACTIVITIES:
      return {...state, activities: null, error: null, alert: null};
    case GET_ACTIVITIES_SUCCESS:
      return {...state, activities: action.response};
    case GET_ACTIVITIES_FAILURE:
      return {...state, activities: null, error: action.response, alert: null};
    default:
      return state;
  }
}
