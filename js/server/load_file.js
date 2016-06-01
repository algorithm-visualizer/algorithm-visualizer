'use strict';

const RSVP = require('rsvp');

const app = require('../app');

const {
  getFileDir,
  isScratchPaper
} = require('../utils');

const {
  checkLoading,
  setPath
} = require('./helpers');

const get = require('./ajax/get');

const loadDataAndCode = (dir) => {
  return RSVP.hash({
    data: get(`${dir}data.js`),
    code: get(`${dir}code.js`)
  });
};

const loadFileAndUpdateContent = (dir) => {
  app.getEditor().clearContent();

  return loadDataAndCode(dir).then((content) => {
    app.updateCachedFile(dir, content);
    app.getEditor().setContent(content);
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
      if (isScratchPaper(category)) {
        setPath(category, app.getLoadedScratch());
      } else {
        setPath(category, algorithm, file);
      }
      $('#explanation').html(explanation);

      let dir = getFileDir(category, algorithm, file);
      app.setLastFileUsed(dir);
      const cachedFile = app.getCachedFile(dir);

      if (cachedContentExists(cachedFile)) {
        app.getEditor().setContent(cachedFile);
        resolve();
      } else {
        loadFileAndUpdateContent(dir).then(resolve, reject);
      }
    }
  });
};