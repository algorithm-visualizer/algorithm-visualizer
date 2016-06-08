'use strict';

const {
  stringify
} = JSON;

const toJSON = (obj) => {
  return stringify(obj, (key, value) => {
    return value === Infinity ? 'Infinity' : value;
  });
};

module.exports = toJSON;
