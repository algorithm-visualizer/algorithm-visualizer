'use strict';

const RSVP = require('rsvp');
const appInstance = require('../app');

const postJSON = require('./ajax/post_json');

module.exports = () => {
  return new RSVP.Promise((resolve, reject) => {

    const {
      dataEditor,
      codeEditor
    } = appInstance.getEditor();

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

      const {
        protocol,
        host,
        pathname
      } = location;

      const url = `${protocol}//${host}${pathname}?scratch-paper=${id}`;
      resolve(url);
    });
  });
};