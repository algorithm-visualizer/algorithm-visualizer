'use strict';

const RSVP = require('rsvp');
const appInstance = require('../../app');

const {
  ajax,
  extend
} = $;

const defaults = {

};

module.exports = function(url, options = {}) {
  appInstance.setIsLoading(true);

  return new RSVP.Promise((resolve, reject) => {
    const callbacks = {
      success(response) {
        appInstance.setIsLoading(false);
        resolve(response);
      },
      error(reason) {
        appInstance.setIsLoading(false);
        reject(reason);
      }
    };

    const opts = extend({}, defaults, options, callbacks, {
      url
    });

    ajax(opts);
  });
};