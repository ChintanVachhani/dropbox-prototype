import axios from 'axios';

let fileDownload = require('react-file-download');

const SERVER_URL = 'http://localhost:8000';

export const GET_FILES = 'GET_FILES';
export const GET_FILES_SUCCESS = 'GET_FILES_SUCCESS';
export const GET_FILES_FAILURE = 'GET_FILES_FAILURE';
export const GET_DIRECTORIES = 'GET_DIRECTORIES';
export const GET_DIRECTORIES_SUCCESS = 'GET_DIRECTORIES_SUCCESS';
export const GET_DIRECTORIES_FAILURE = 'GET_DIRECTORIES_FAILURE';
export const STAR_FILE = 'STAR_FILE';
export const STAR_FILE_SUCCESS = 'STAR_FILE_SUCCESS';
export const STAR_FILE_FAILURE = 'STAR_FILE_FAILURE';
export const DOWNLOAD_FILE = 'DOWNLOAD_FILE';
export const UPLOAD_FILE = 'UPLOAD_FILE';
export const UPLOAD_FILE_SUCCESS = 'UPLOAD_FILE_SUCCESS';
export const UPLOAD_FILE_FAILURE = 'UPLOAD_FILE_FAILURE';
export const DELETE_FILE = 'DELETE_FILE';
export const DELETE_FILE_SUCCESS = 'DELETE_FILE_SUCCESS';
export const DELETE_FILE_FAILURE = 'DELETE_FILE_FAILURE';
export const STAR_DIRECTORY = 'STAR_DIRECTORY';
export const STAR_DIRECTORY_SUCCESS = 'STAR_DIRECTORY_SUCCESS';
export const STAR_DIRECTORY_FAILURE = 'STAR_DIRECTORY_FAILURE';
export const DOWNLOAD_DIRECTORY = 'DOWNLOAD_DIRECTORY';
export const CREATE_DIRECTORY = 'CREATE_DIRECTORY';
export const CREATE_DIRECTORY_SUCCESS = 'CREATE_DIRECTORY_SUCCESS';
export const CREATE_DIRECTORY_FAILURE = 'CREATE_DIRECTORY_FAILURE';
export const DELETE_DIRECTORY = 'DELETE_DIRECTORY';
export const DELETE_DIRECTORY_SUCCESS = 'DELETE_DIRECTORY_SUCCESS';
export const DELETE_DIRECTORY_FAILURE = 'DELETE_DIRECTORY_FAILURE';

export function getFiles(path) {
  return function (dispatch) {
    dispatch({
      type: GET_FILES,
    });
    axios({
      method: 'get',
      url: `${SERVER_URL}/file?path=root${path}&token=${localStorage.getItem('token')}`,
    })
      .then((result) => {
        if (result.response && result.response.status !== 200) {
          dispatch({
            type: GET_FILES_FAILURE,
            response: result.response.data.title + ' ' + result.response.data.error.message,
          });
        }
        dispatch({
          type: GET_FILES_SUCCESS,
          response: result.data.data,
        });
      }).catch((result) => {
      if (result.response) {
        dispatch({
          type: GET_FILES_FAILURE,
          response: result.response.data.title + ' ' + result.response.data.error.message,
        });
      }
    });
  };
}

export function getDirectories(path) {
  return function (dispatch) {
    dispatch({
      type: GET_DIRECTORIES,
    });
    axios({
      method: 'get',
      url: `${SERVER_URL}/directory?path=root${path}&token=${localStorage.getItem('token')}`,
    })
      .then((result) => {
        if (result.response && result.response.status !== 200) {
          dispatch({
            type: GET_DIRECTORIES_FAILURE,
            response: result.response.data.title + ' ' + result.response.data.error.message,
          });
        }
        dispatch({
          type: GET_DIRECTORIES_SUCCESS,
          response: result.data.data,
        });
      }).catch((result) => {
      if (result.response) {
        dispatch({
          type: GET_DIRECTORIES_FAILURE,
          response: result.response.data.title + ' ' + result.response.data.error.message,
        });
      }
    });
  };
}

export function uploadFile(data) {
  return function (dispatch) {
    dispatch({
      type: UPLOAD_FILE,
    });
    axios({
      method: 'post',
      url: `${SERVER_URL}/file?token=${localStorage.getItem('token')}`,
      data: data,
    })
      .then((result) => {
        if (result.response && result.response.status !== 201) {
          dispatch({
            type: UPLOAD_FILE_FAILURE,
            response: result.response.data.title + ' ' + result.response.data.error.message,
          });
        }
        dispatch({
          type: UPLOAD_FILE_SUCCESS,
          response: result.data.name + 'uploaded.',
        });
      }).catch((result) => {
      if (result.response) {
        dispatch({
          type: UPLOAD_FILE_FAILURE,
          response: result.response.data.title + ' ' + result.response.data.error.message,
        });
      }
    });
  };
}

export function downloadFile(file) {
  return function (dispatch) {
    dispatch({
      type: DOWNLOAD_FILE,
      response: file.name + ' downloaded.',
    });
    axios({
      method: 'get',
      url: `${SERVER_URL}/file/download?userId=${file.userId}&name=${file.name}&path=${file.path}&token=${localStorage.getItem('token')}`,
    }).then((result) => {
      fileDownload(result.data, file.name);
    });
  };
}

export function starFile(data) {
  return function (dispatch) {
    dispatch({
      type: STAR_FILE,
    });
    axios({
      method: 'patch',
      url: `${SERVER_URL}/file/star?token=${localStorage.getItem('token')}`,
      data: data,
    })
      .then((result) => {
        if (result.response && result.response.status !== 200) {
          dispatch({
            type: STAR_FILE_FAILURE,
            response: result.response.data.title + ' ' + result.response.data.error.message,
          });
        }
        dispatch({
          type: STAR_FILE_SUCCESS,
          response: result.data.name + 'starred.',
        });
      }).catch((result) => {
      if (result.response) {
        dispatch({
          type: STAR_FILE_FAILURE,
          response: result.response.data.title + ' ' + result.response.data.error.message,
        });
      }
    });
  };
}

export function deleteFile(data) {
  return function (dispatch) {
    dispatch({
      type: DELETE_FILE,
    });
    axios({
      method: 'delete',
      url: `${SERVER_URL}/file?token=${localStorage.getItem('token')}`,
      data: data,
    })
      .then((result) => {
        if (result.response && result.response.status !== 200) {
          dispatch({
            type: DELETE_FILE_FAILURE,
            response: result.response.data.title + ' ' + result.response.data.error.message,
          });
        }
        dispatch({
          type: DELETE_FILE_SUCCESS,
          response: result.data.name + 'deleted.',
        });
      }).catch((result) => {
      if (result.response) {
        dispatch({
          type: DELETE_FILE_FAILURE,
          response: result.response.data.title + ' ' + result.response.data.error.message,
        });
      }
    });
  };
}

export function createDirectory(data) {
  return function (dispatch) {
    dispatch({
      type: CREATE_DIRECTORY,
    });
    axios({
      method: 'put',
      url: `${SERVER_URL}/directory?token=${localStorage.getItem('token')}`,
      data: data,
    })
      .then((result) => {
        if (result.response && result.response.status !== 201) {
          dispatch({
            type: CREATE_DIRECTORY_FAILURE,
            response: result.response.data.title + ' ' + result.response.data.error.message,
          });
        }
        dispatch({
          type: CREATE_DIRECTORY_SUCCESS,
          response: result.data.name + 'uploaded.',
        });
      }).catch((result) => {
      if (result.response) {
        dispatch({
          type: CREATE_DIRECTORY_FAILURE,
          response: result.response.data.title + ' ' + result.response.data.error.message,
        });
      }
    });
  };
}

export function downloadDirectory(directory) {
  return function (dispatch) {
    dispatch({
      type: DOWNLOAD_DIRECTORY,
      response: directory.name + ' downloaded.',
    });
    axios({
      method: 'get',
      url: `${SERVER_URL}/directory/download?userId=${directory.userId}&name=${directory.name}&path=${directory.path}&token=${localStorage.getItem('token')}`,
    }).then((result) => {
      fileDownload(result.data, directory.name + '.zip');
    });
  };
}

export function starDirectory(data) {
  return function (dispatch) {
    dispatch({
      type: STAR_DIRECTORY,
    });
    axios({
      method: 'patch',
      url: `${SERVER_URL}/directory/star?token=${localStorage.getItem('token')}`,
      data: data,
    })
      .then((result) => {
        if (result.response && result.response.status !== 200) {
          dispatch({
            type: STAR_DIRECTORY_FAILURE,
            response: result.response.data.title + ' ' + result.response.data.error.message,
          });
        }
        dispatch({
          type: STAR_DIRECTORY_SUCCESS,
          response: result.data.name + 'starred.',
        });
      }).catch((result) => {
      if (result.response) {
        dispatch({
          type: STAR_DIRECTORY_FAILURE,
          response: result.response.data.title + ' ' + result.response.data.error.message,
        });
      }
    });
  };
}

export function deleteDirectory(data) {
  return function (dispatch) {
    dispatch({
      type: DELETE_DIRECTORY,
    });
    axios({
      method: 'delete',
      url: `${SERVER_URL}/directory?token=${localStorage.getItem('token')}`,
      data: data,
    })
      .then((result) => {
        if (result.response && result.response.status !== 200) {
          dispatch({
            type: DELETE_DIRECTORY_FAILURE,
            response: result.response.data.title + ' ' + result.response.data.error.message,
          });
        }
        dispatch({
          type: DELETE_DIRECTORY_SUCCESS,
          response: result.data.name + 'deleted.',
        });
      }).catch((result) => {
      if (result.response) {
        dispatch({
          type: DELETE_DIRECTORY_FAILURE,
          response: result.response.data.title + ' ' + result.response.data.error.message,
        });
      }
    });
  };
}
