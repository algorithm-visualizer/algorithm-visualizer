'use strict';

const RSVP = require('rsvp');
const app = require('../app');

const postJSON = require('./ajax/post_json');

const {
  setPath
} = require('./helpers');

module.exports = () => {
  return new RSVP.Promise((resolve, reject) => {

    const {
      dataEditor,
      codeEditor
    } = app.getEditor();

    const gist = {
      'description': 'temp',
      'public': true,
      'files': {
        'data.js': {
          'content': dataEditor.getValue()
        },
        'code.js': {
          'content': codeEditor.getValue()
        }
      }
    };

    postJSON('https://api.github.com/gists', gist).then(({
      id
    }) => {
      app.setLoadedScratch(id);
      setPath('scratch', id);
      const {
        href
      } = location;
      $('#algorithm').html('Shared');
      resolve(href);
    });
  });
};