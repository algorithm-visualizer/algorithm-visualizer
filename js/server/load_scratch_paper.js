'use strict';

const RSVP = require('rsvp');

const Utils = require('../utils');
const appInstance = require('../app');

const getJSON = require('./ajax/get_json');
const loadAlgorithm = require('./load_algorithm');

const extractGistCode = (files, name) => files[`${name}.js`].content;

module.exports = (gistID) => {
  return new RSVP.Promise((resolve, reject) => {
    getJSON(`https://api.github.com/gists/${gistID}`).then(({
      files
    }) => {

      const algorithm = 'scratch_paper';
      const category = null;

      loadAlgorithm(category, algorithm).then((data) => {

        const algoData = extractGistCode(files, 'data');
        const algoCode = extractGistCode(files, 'code');

        // update scratch paper algo code with the loaded gist code
        const dir = Utils.getFileDir(category, algorithm, 'scratch_paper');
        appInstance.updateCachedFile(dir, {
          data: algoData,
          code: algoCode,
          'CREDIT.md': 'Shared by an anonymous user from http://parkjs814.github.io/AlgorithmVisualizer'
        });

        resolve({
          category,
          algorithm,
          data
        });
      });
    });
  });

};