'use strict';

const app = require('../app');
const Toast = require('../dom/toast');

const checkLoading = () => {
  if (app.getIsLoading()) {
    Toast.showErrorToast('Wait until it completes loading of previous file.');
    return true;
  }
  return false;
};

const getParameterByName = (name) => {
  const url = window.location.href;
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);

  const results = regex.exec(url);

  if (!results || results.length !== 3) {
    return null;
  }

  const [, , id] = results;

  return id;
};

const getHashValue = (key)=> {
  if (!key) return null;
  const hash = window.location.hash.substr(1);
  const params = hash ? hash.split('&') : [];
  for (let i = 0; i < params.length; i++) {
    const pair = params[i].split('=');
    if (pair[0] === key) {
      return pair[1];
    }
  }
  return null;
};

const setHashValue = (key, value)=> {
  if (!key || !value) return;
  const hash = window.location.hash.substr(1);
  const params = hash ? hash.split('&') : [];

  let found = false;
  for (let i = 0; i < params.length && !found; i++) {
    const pair = params[i].split('=');
    if (pair[0] === key) {
      pair[1] = value;
      params[i] = pair.join('=');
      found = true;
    }
  }
  if (!found) {
    params.push([key, value].join('='));
  }

  const newHash = params.join('&');
  window.location.hash = '#' + newHash;
};

const removeHashValue = (key) => {
  if (!key) return;
  const hash = window.location.hash.substr(1);
  const params = hash ? hash.split('&') : [];

  for (let i = 0; i < params.length; i++) {
    const pair = params[i].split('=');
    if (pair[0] === key) {
      params.splice(i, 1);
      break;
    }
  }

  const newHash = params.join('&');
  window.location.hash = '#' + newHash;
};

const setPath = (category, algorithm, file) => {
  const path = category ? category + (algorithm ? '/' + algorithm + (file ? '/' + file : '') : '') : '';
  setHashValue('path', path);
};

const getPath = () => {
  const hash = getHashValue('path');
  if (hash) {
    const parts = hash.split('/');
    return {category: parts[0], algorithm: parts[1], file: parts[2]};
  } else {
    return false;
  }
};

module.exports = {
  checkLoading,
  getParameterByName,
  getHashValue,
  setHashValue,
  removeHashValue,
  setPath,
  getPath
};