export const HOME = 'HOME';
export const FILES = 'FILES';
export const ACCOUNT = 'ACCOUNT';
export const LOADING_ERROR = 'LOADING_ERROR';

export function loadHome() {
  return {
    type: HOME,
  };
}

export function loadFiles() {
  return {
    type: FILES,
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
