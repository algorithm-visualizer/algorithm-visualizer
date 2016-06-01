'use strict';

const RSVP = require('rsvp');
const app = require('../../app');

const {
  ajax,
  extend
} = $;

const defaults = {

};

module.exports = function(url, options = {}) {
  app.setIsLoading(true);

  return new RSVP.Promise((resolve, reject) => {
    const callbacks = {
      success(response) {
        app.setIsLoading(false);
        resolve(response);
      },
      error(reason) {
        app.setIsLoading(false);
        reject(reason);
      }
    };

    const opts = extend({}, defaults, options, callbacks, {
      url
    });

    ajax(opts);
  });
};