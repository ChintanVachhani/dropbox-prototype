import {SIGNIN, SIGNIN_SUCCESS, SIGNIN_FAILURE, SIGNUP, SIGNUP_SUCCESS, SIGNUP_FAILURE, SIGNOUT, GET_USER, GET_USER_SUCCESS, GET_USER_FAILURE} from "../actions/user";

const INITIAL_STATE = {userId: null, firstName: null, lastName: null, status: null, error: null, loading: false};

export default function (state = INITIAL_STATE, action) {

  switch (action.type) {
    case SIGNIN:
      return {...state, userId: null, firstName: null, lastName: null, status: 'signin', error: null, loading: true};
    case SIGNIN_SUCCESS:
      return {...state, userId: action.response, firstName: null, lastName: null, status: 'authenticated', error: null, loading: false};
    case SIGNIN_FAILURE:
      return {...state, userId: null, firstName: null, lastName: null, status: 'signin', error: action.response, loading: false};
    case SIGNUP:
      return {...state, userId: null, firstName: null, lastName: null, status: 'signup', error: null, loading: true};
    case SIGNUP_SUCCESS:
      return {...state, userId: action.response, firstName: null, lastName: null, status: 'signin', error: null, loading: false};
    case SIGNUP_FAILURE:
      return {...state, userId: null, firstName: null, lastName: null, status: 'signin', error: action.response, loading: false};
    case SIGNOUT:
      return {...state, userId: null, firstName: null, lastName: null, status: 'signout', error: null, loading: false};
    case GET_USER:
      return {...state, userId: null, firstName: null, lastName: null, status: 'getUser', error: null, loading: true};
    case GET_USER_SUCCESS:
      return {
        ...state,
        userId: action.response.email,
        firstName: action.response.firstName,
        lastName: action.response.lastName,
        status: 'authenticated',
        error: null,
        loading: false,
      };
    case GET_USER_FAILURE:
      return {...state, userId: null, firstName: null, lastName: null, status: 'signin', error: action.response, loading: false};
    default:
      return state;
  }
}
