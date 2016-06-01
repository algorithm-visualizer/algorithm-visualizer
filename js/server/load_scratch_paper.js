'use strict';

const RSVP = require('rsvp');
const app = require('../app');

const {
  getFileDir
} = require('../utils');

const getJSON = require('./ajax/get_json');
const loadAlgorithm = require('./load_algorithm');

const extractGistCode = (files, name) => files[`${name}.js`].content;

module.exports = (gistID) => {
  return new RSVP.Promise((resolve, reject) => {
    app.setLoadedScratch(gistID);

    getJSON(`https://api.github.com/gists/${gistID}`).then(({
      files
    }) => {

      const category = 'scratch';
      const algorithm = gistID;

      loadAlgorithm(category, algorithm).then((data) => {

        const algoData = extractGistCode(files, 'data');
        const algoCode = extractGistCode(files, 'code');

        // update scratch paper algo code with the loaded gist code
        const dir = getFileDir(category, algorithm, 'scratch_paper');
        app.updateCachedFile(dir, {
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