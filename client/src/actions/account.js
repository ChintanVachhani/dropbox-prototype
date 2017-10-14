import axios from 'axios';

const SERVER_URL = 'http://localhost:8000';

export const GET_USER_ACCOUNT = 'GET_USER_ACCOUNT';
export const GET_USER_ACCOUNT_SUCCESS = 'GET_USER_ACCOUNT_SUCCESS';
export const GET_USER_ACCOUNT_FAILURE = 'GET_USER_ACCOUNT_FAILURE';
export const UPDATE_USER_ACCOUNT = 'UPDATE_USER_ACCOUNT';
export const UPDATE_USER_ACCOUNT_SUCCESS = 'UPDATE_USER_ACCOUNT_SUCCESS';
export const UPDATE_USER_ACCOUNT_FAILURE = 'UPDATE_USER_ACCOUNT_FAILURE';

export function getAccount() {
  return function (dispatch) {
    dispatch({
      type: GET_USER_ACCOUNT,
    });
    axios({
      method: 'get',
      url: `${SERVER_URL}/user/account?userId=${localStorage.getItem('userId')}&token=${localStorage.getItem('token')}`,
    })
      .then((result) => {
        if (result.response && result.response.status !== 200) {
          dispatch({
            type: GET_USER_ACCOUNT_FAILURE,
            response: result.response.data.title + ' ' + result.response.data.error.message,
          });
        }
        dispatch({
          type: GET_USER_ACCOUNT_SUCCESS,
          response: result.data.data,
        });
      }).catch((result) => {
      if (result.response) {
        dispatch({
          type: GET_USER_ACCOUNT_FAILURE,
          response: result.response.data.title + ' ' + result.response.data.error.message,
        });
      }
    });
  };
}

export function updateAccount(data) {
  return function (dispatch) {
    dispatch({
      type: UPDATE_USER_ACCOUNT,
    });
    axios({
      method: 'patch',
      url: `${SERVER_URL}/user/account?&token=${localStorage.getItem('token')}`,
      data: data,
    })
      .then((result) => {
        if (result.response && result.response.status !== 200) {
          dispatch({
            type: UPDATE_USER_ACCOUNT_FAILURE,
            response: result.response.data.title + ' ' + result.response.data.error.message,
          });
        }
        dispatch({
          type: UPDATE_USER_ACCOUNT_SUCCESS,
          response: result.data.data,
        });
      }).catch((result) => {
      if (result.response) {
        dispatch({
          type: UPDATE_USER_ACCOUNT_FAILURE,
          response: result.response.data.title + ' ' + result.response.data.error.message,
        });
      }
    });
  };
}
