'use strict';

const RSVP = require('rsvp');

const appInstance = require('../app');
const Utils = require('../utils');

const {
  checkLoading
} = require('./helpers');

const get = require('./ajax/get');

const loadDataAndCode = (dir) => {
  return RSVP.hash({
    data: get(`${dir}data.js`),
    code: get(`${dir}code.js`)
  });
};

const loadFileAndUpdateContent = (dir) => {
  appInstance.setIsLoading(true);
  appInstance.getEditor().clearContent();

  return loadDataAndCode(dir).then((content) => {
    appInstance.updateCachedFile(dir, content);
    appInstance.getEditor().setContent(content);
  });
};

const cachedContentExists = (cachedFile) => {
  return cachedFile &&
    cachedFile.data !== undefined &&
    cachedFile.code !== undefined;
};

module.exports = (category, algorithm, file, explanation) => {
  return new RSVP.Promise((resolve, reject) => {

    if (checkLoading()) {
      reject();
    } else {
      $('#explanation').html(explanation);

      let dir = Utils.getFileDir(category, algorithm, file);
      appInstance.setLastFileUsed(dir);
      const cachedFile = appInstance.getCachedFile(dir);

      if (cachedContentExists(cachedFile)) {
        appInstance.getEditor().setContent(cachedFile);
        resolve();
      } else {
        loadFileAndUpdateContent(dir).then(resolve, reject);
      }
    }
  });
};