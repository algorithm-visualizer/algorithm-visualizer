'use strict';

const appInstance = require('../app');
const Toast = require('../dom/toast');

const checkLoading = () => {
  if (appInstance.getIsLoading()) {
    Toast.showErrorToast('Wait until it completes loading of previous file.');
    return true;
  }
  return false;
};

const getParameterByName = (name) => {
  const url = window.location.href;
  const cleanName = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);

  const results = regex.exec(url);

  if (!results || results.length !== 3) {
    return null;
  }

  const [, , id] = results;

  return id;
};

module.exports = {
  checkLoading,
  getParameterByName
};