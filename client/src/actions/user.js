import axios from 'axios';

const SERVER_URL = 'http://localhost:8000';

export const SIGNIN = 'SIGNIN';
export const SIGNIN_SUCCESS = 'SIGNIN_SUCCESS';
export const SIGNIN_FAILURE = 'SIGNIN_FAILURE';

export const SIGNUP = 'SIGNUP';
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';
export const SIGNUP_FAILURE = 'SIGNUP_FAILURE';

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
            response: result.response,
          });
        }
        localStorage.setItem('token', result.data.token);
        dispatch({
          type: SIGNIN_SUCCESS,
          response: result.data.userId,
        });
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
            response: result.response,
          });
        }
        dispatch({
          type: SIGNUP_SUCCESS,
          response: result.data.userId,
        });
      });
  };
}
