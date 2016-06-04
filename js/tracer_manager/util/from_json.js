'use strict';

const {
  parse
} = JSON;

const fromJSON = (obj) => {
  return parse(obj, (key, value) => {
    return value === 'Infinity' ? Infinity : value;
  });
};

module.exports = fromJSON;
