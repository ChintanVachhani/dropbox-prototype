import axios from 'axios';

const SERVER_URL = 'http://localhost:8000';

export const SIGNIN = 'SIGNIN';
export const SIGNIN_SUCCESS = 'SIGNIN_SUCCESS';
export const SIGNIN_FAILURE = 'SIGNIN_FAILURE';

export const SIGNUP = 'SIGNUP';
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';
export const SIGNUP_FAILURE = 'SIGNUP_FAILURE';

export const SIGNOUT = 'SIGNOUT';

export const GET_USER = 'GET_USER';
export const GET_USER_SUCCESS = 'GET_USER_SUCCESS';
export const GET_USER_FAILURE = 'GET_USER_FAILURE';

export function signin(data) {
  return function (dispatch) {
    dispatch({
      type: SIGNIN,
    });
    axios({
      method: 'post',
      url: `${SERVER_URL}/user/signin`,
      data: data,
    })
      .then((result) => {
        if (result.response && result.response.status !== 200) {
          dispatch({
            type: SIGNIN_FAILURE,
            response: result.response.data.title + ' ' + result.response.data.error.message,
          });
        }
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('userId', result.data.userId);
        dispatch({
          type: SIGNIN_SUCCESS,
          response: result.data.userId,
        });
      })
      .catch((result) => {
        if (result.response) {
          dispatch({
            type: SIGNIN_FAILURE,
            response: result.response.data.title + ' ' + result.response.data.error.message,
          });
        }
      });
  };
}

export function signup(data) {
  return function (dispatch) {
    dispatch({
      type: SIGNUP,
    });
    axios({
      method: 'post',
      url: `${SERVER_URL}/user/signup`,
      data: data,
    })
      .then((result) => {
        if (result.response && result.response.status !== 201) {
          dispatch({
            type: SIGNUP_FAILURE,
            response: result.response.data.title + ' ' + result.response.data.error.message,
          });
        }
        dispatch({
          type: SIGNUP_SUCCESS,
          response: result.data.userId,
        });
      }).catch((result) => {
      if (result.response) {
        dispatch({
          type: SIGNUP_FAILURE,
          response: result.response.data.title + ' ' + result.response.data.error.message,
        });
      }
    });
  };
}

export function signout() {
  return {
    type: SIGNOUT,
  };
}

export function getUser(data) {
  return function (dispatch) {
    dispatch({
      type: GET_USER,
    });
    axios({
      method: 'get',
      url: `${SERVER_URL}/user?userId=${data.userId}&token=${data.token}`,
    })
      .then((result) => {
        if (result.response && result.response.status !== 200) {
          dispatch({
            type: GET_USER_FAILURE,
            response: result.response.data.title + ' ' + result.response.data.error.message,
          });
        }
        dispatch({
          type: GET_USER_SUCCESS,
          response: result.data.data,
        });
      }).catch((result) => {
      if (result.response) {
        dispatch({
          type: GET_USER_FAILURE,
          response: result.response.data.title + ' ' + result.response.data.error.message,
        });
      }
    });
  };
}
