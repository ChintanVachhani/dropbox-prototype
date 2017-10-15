import {
  GET_FILES,
  GET_FILES_SUCCESS,
  GET_FILES_FAILURE,
  GET_DIRECTORIES,
  GET_DIRECTORIES_SUCCESS,
  GET_DIRECTORIES_FAILURE,
  DOWNLOAD_FILE,
  UPLOAD_FILE,
  UPLOAD_FILE_SUCCESS,
  UPLOAD_FILE_FAILURE,
  STAR_FILE,
  STAR_FILE_FAILURE,
  STAR_FILE_SUCCESS,
  DELETE_FILE,
  DELETE_FILE_FAILURE,
  DELETE_FILE_SUCCESS,
  CREATE_DIRECTORY,
  CREATE_DIRECTORY_FAILURE,
  CREATE_DIRECTORY_SUCCESS,
  DELETE_DIRECTORY_FAILURE,
  DELETE_DIRECTORY_SUCCESS,
  DELETE_DIRECTORY,
  DOWNLOAD_DIRECTORY,
  STAR_DIRECTORY_FAILURE,
  STAR_DIRECTORY_SUCCESS,
  STAR_DIRECTORY,
} from "../actions/content";

const INITIAL_STATE = {files: null, directories: null, error: null, alert: null};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_FILES:
      return {...state, files: null, error: null, alert: null};
    case GET_FILES_SUCCESS:
      return {...state, files: action.response, error: null, alert: null};
    case GET_FILES_FAILURE:
      return {...state, files: null, error: action.response, alert: null};
    case GET_DIRECTORIES:
      return {...state, directories: null, error: null, alert: null};
    case GET_DIRECTORIES_SUCCESS:
      return {...state, directories: action.response, error: null, alert: null};
    case GET_DIRECTORIES_FAILURE:
      return {...state, directories: null, error: action.response, alert: null};
    case UPLOAD_FILE:
      return {...state, error: null, alert: null};
    case UPLOAD_FILE_SUCCESS:
      return {...state, error: null, alert: action.response};
    case UPLOAD_FILE_FAILURE:
      return {...state, error: action.response, alert: null};
    case STAR_FILE:
      return {...state, error: null, alert: null};
    case STAR_FILE_SUCCESS:
      return {...state, error: null, alert: action.response};
    case STAR_FILE_FAILURE:
      return {...state, error: action.response, alert: null};
    case DELETE_FILE:
      return {...state, error: null, alert: null};
    case DELETE_FILE_SUCCESS:
      return {...state, error: null, alert: action.response};
    case DELETE_FILE_FAILURE:
      return {...state, error: action.response, alert: null};
    case DOWNLOAD_FILE:
      return {...state, error: null, alert: action.response};
    case CREATE_DIRECTORY:
      return {...state, error: null, alert: null};
    case CREATE_DIRECTORY_SUCCESS:
      return {...state, error: null, alert: action.response};
    case CREATE_DIRECTORY_FAILURE:
      return {...state, error: action.response, alert: null};
    case STAR_DIRECTORY:
      return {...state, error: null, alert: null};
    case STAR_DIRECTORY_SUCCESS:
      return {...state, error: null, alert: action.response};
    case STAR_DIRECTORY_FAILURE:
      return {...state, error: action.response, alert: null};
    case DELETE_DIRECTORY:
      return {...state, error: null, alert: null};
    case DELETE_DIRECTORY_SUCCESS:
      return {...state, error: null, alert: action.response};
    case DELETE_DIRECTORY_FAILURE:
      return {...state, error: action.response, alert: null};
    case DOWNLOAD_DIRECTORY:
      return {...state, error: null, alert: action.response};
    default:
      return state;
  }
}
