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
  STAR_DIRECTORY, GET_ACTIVITIES, GET_ACTIVITIES_SUCCESS, GET_ACTIVITIES_FAILURE, GET_STARRED_FILES, GET_STARRED_FILES_SUCCESS, GET_STARRED_FILES_FAILURE, GET_STARRED_DIRECTORIES,
  GET_STARRED_DIRECTORIES_SUCCESS, GET_STARRED_DIRECTORIES_FAILURE, CREATE_SHARE_LINK_FAILURE, CREATE_SHARE_LINK_SUCCESS, CREATE_SHARE_LINK, USER_SEARCH, USER_SEARCH_SUCCESS,
  USER_SEARCH_FAILURE, SHARE_FILE, SHARE_FILE_SUCCESS, SHARE_FILE_FAILURE, CREATE_SHARE_LINK_DIRECTORY, CREATE_SHARE_LINK_DIRECTORY_SUCCESS, CREATE_SHARE_LINK_DIRECTORY_FAILURE,
  SHARE_DIRECTORY, SHARE_DIRECTORY_SUCCESS, SHARE_DIRECTORY_FAILURE, SHARED_LIST_FILES, SHARED_LIST_FILES_SUCCESS, SHARED_LIST_FILES_FAILURE, SHARED_LIST_DIRECTORIES,
  SHARED_LIST_DIRECTORIES_SUCCESS, SHARED_LIST_DIRECTORIES_FAILURE, SHARED_GET_DIRECTORIES_FAILURE, SHARED_GET_DIRECTORIES_SUCCESS, SHARED_GET_DIRECTORIES,
  SHARED_GET_FILES_FAILURE, SHARED_GET_FILES_SUCCESS, SHARED_GET_FILES, SHARED_DOWNLOAD_FILE, SHARED_DOWNLOAD_DIRECTORY, SHARED_STAR_FILE, SHARED_STAR_DIRECTORY_SUCCESS,
  SHARED_STAR_FILE_FAILURE, SHARED_STAR_FILE_SUCCESS, SHARED_STAR_DIRECTORY, SHARED_STAR_DIRECTORY_FAILURE, TOGGLE_ALERT,
} from "../actions/content";

const INITIAL_STATE = {
  files: null,
  directories: null,
  starredFiles: null,
  starredDirectories: null,
  sharedFiles: null,
  sharedDirectories: null,
  activities: null,
  users: null,
  error: null,
  alert: null,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_FILES:
      return {...state, files: null};
    case GET_FILES_SUCCESS:
      return {...state, files: action.response};
    case GET_FILES_FAILURE:
      return {...state, files: null, error: action.response, alert: null};
    case GET_DIRECTORIES:
      return {...state, directories: null};
    case GET_DIRECTORIES_SUCCESS:
      return {...state, directories: action.response};
    case GET_DIRECTORIES_FAILURE:
      return {...state, directories: null, error: action.response, alert: null};
    case SHARED_LIST_FILES:
      return {...state, sharedFiles: null};
    case SHARED_LIST_FILES_SUCCESS:
      return {...state, sharedFiles: action.response};
    case SHARED_LIST_FILES_FAILURE:
      return {...state, sharedFiles: null, error: action.response, alert: null};
    case SHARED_LIST_DIRECTORIES:
      return {...state, sharedDirectories: null};
    case SHARED_LIST_DIRECTORIES_SUCCESS:
      return {...state, sharedDirectories: action.response};
    case SHARED_LIST_DIRECTORIES_FAILURE:
      return {...state, sharedDirectories: null, error: action.response, alert: null};
    case SHARED_GET_FILES:
      return {...state, sharedFiles: null};
    case SHARED_GET_FILES_SUCCESS:
      return {...state, sharedFiles: action.response};
    case SHARED_GET_FILES_FAILURE:
      return {...state, sharedFiles: null, error: action.response, alert: null};
    case SHARED_GET_DIRECTORIES:
      return {...state, sharedDirectories: null};
    case SHARED_GET_DIRECTORIES_SUCCESS:
      return {...state, sharedDirectories: action.response};
    case SHARED_GET_DIRECTORIES_FAILURE:
      return {...state, sharedDirectories: null, error: action.response, alert: null};
    case UPLOAD_FILE:
      return {...state};
    case UPLOAD_FILE_SUCCESS:
      return {...state, error: null, alert: action.response};
    case UPLOAD_FILE_FAILURE:
      return {...state, error: action.response, alert: null};
    case STAR_FILE:
      return {...state};
    case STAR_FILE_SUCCESS:
      return {...state, error: null, alert: action.response};
    case STAR_FILE_FAILURE:
      return {...state, error: action.response, alert: null};
    case DELETE_FILE:
      return {...state};
    case DELETE_FILE_SUCCESS:
      return {...state, error: null, alert: action.response};
    case DELETE_FILE_FAILURE:
      return {...state, error: action.response, alert: null};
    case DOWNLOAD_FILE:
      return {...state, error: null, alert: action.response};
    case SHARED_DOWNLOAD_FILE:
      return {...state, error: null, alert: action.response};
    case CREATE_DIRECTORY:
      return {...state};
    case CREATE_DIRECTORY_SUCCESS:
      return {...state, error: null, alert: action.response};
    case CREATE_DIRECTORY_FAILURE:
      return {...state, error: action.response, alert: null};
    case STAR_DIRECTORY:
      return {...state};
    case STAR_DIRECTORY_SUCCESS:
      return {...state, error: null, alert: action.response};
    case STAR_DIRECTORY_FAILURE:
      return {...state, error: action.response, alert: null};
    case SHARED_STAR_DIRECTORY:
      return {...state};
    case SHARED_STAR_DIRECTORY_SUCCESS:
      return {...state, error: null, alert: action.response};
    case SHARED_STAR_DIRECTORY_FAILURE:
      return {...state, error: action.response, alert: null};
    case SHARED_STAR_FILE:
      return {...state};
    case SHARED_STAR_FILE_SUCCESS:
      return {...state, error: null, alert: action.response};
    case SHARED_STAR_FILE_FAILURE:
      return {...state, error: action.response, alert: null};
    case DELETE_DIRECTORY:
      return {...state};
    case DELETE_DIRECTORY_SUCCESS:
      return {...state, error: null, alert: action.response};
    case DELETE_DIRECTORY_FAILURE:
      return {...state, error: action.response, alert: null};
    case DOWNLOAD_DIRECTORY:
      return {...state, error: null, alert: action.response};
    case SHARED_DOWNLOAD_DIRECTORY:
      return {...state, error: null, alert: action.response};
    case GET_ACTIVITIES:
      return {...state, activities: null};
    case GET_ACTIVITIES_SUCCESS:
      return {...state, activities: action.response};
    case GET_ACTIVITIES_FAILURE:
      return {...state, activities: null, error: action.response, alert: null};
    case GET_STARRED_FILES:
      return {...state, starredFiles: null};
    case GET_STARRED_FILES_SUCCESS:
      return {...state, starredFiles: action.response};
    case GET_STARRED_FILES_FAILURE:
      return {...state, starredFiles: null, error: action.response, alert: null};
    case GET_STARRED_DIRECTORIES:
      return {...state, starredDirectories: null};
    case GET_STARRED_DIRECTORIES_SUCCESS:
      return {...state, starredDirectories: action.response};
    case GET_STARRED_DIRECTORIES_FAILURE:
      return {...state, starredDirectories: null, error: action.response, alert: null};
    case CREATE_SHARE_LINK:
      return {...state};
    case CREATE_SHARE_LINK_SUCCESS:
      return {...state, error: null, alert: action.response};
    case CREATE_SHARE_LINK_FAILURE:
      return {...state, error: action.response, alert: null};
    case USER_SEARCH:
      return {...state, users: null};
    case USER_SEARCH_SUCCESS:
      return {...state, users: action.response};
    case USER_SEARCH_FAILURE:
      return {...state, users: null, error: action.response, alert: null};
    case SHARE_FILE:
      return {...state};
    case SHARE_FILE_SUCCESS:
      return {...state, error: null, alert: action.response};
    case SHARE_FILE_FAILURE:
      return {...state, error: action.response, alert: null};
    case CREATE_SHARE_LINK_DIRECTORY:
      return {...state};
    case CREATE_SHARE_LINK_DIRECTORY_SUCCESS:
      return {...state, error: null, alert: action.response};
    case CREATE_SHARE_LINK_DIRECTORY_FAILURE:
      return {...state, error: action.response, alert: null};
    case SHARE_DIRECTORY:
      return {...state};
    case SHARE_DIRECTORY_SUCCESS:
      return {...state, error: null, alert: action.response};
    case SHARE_DIRECTORY_FAILURE:
      return {...state, error: action.response, alert: null};
    case TOGGLE_ALERT:
      return {...state, error: null, alert: null};
    default:
      return state;
  }
}
