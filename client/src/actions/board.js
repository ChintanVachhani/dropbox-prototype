export const HOME = 'HOME';
export const FILES = 'FILES';
export const ACCOUNT = 'ACCOUNT';
export const LOADING_ERROR = 'LOADING_ERROR';
export const CHANGE_PATH = 'CHANGE_PATH';
export const SHARING = 'SHARING';

export function loadHome() {
  return {
    type: HOME,
  };
}

export function loadFiles(path) {
  return {
    type: FILES,
    response: path || '',
  };
}

export function loadSharing() {
  return {
    type: SHARING,
  };
}

export function loadAccount() {
  return {
    type: ACCOUNT,
  };
}

export function loadingError() {
  return {
    type: LOADING_ERROR,
    response: 'Something went wrong. Cannot load the page.',
  };
}

export function changePath(path) {
  return {
    type: CHANGE_PATH,
    response: path,
  };
}
