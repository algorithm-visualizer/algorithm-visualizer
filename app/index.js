const compression = require('compression');
const history = require('connect-history-api-fallback');
const express = require('express');
const app = express();

const {
  apiEndpoint
} = require('../environment');

const frontend = require('./frontend');
const backend = require('./backend');
app.use(apiEndpoint, backend);
app.use(history());
app.use(compression());
app.use(frontend);

module.exports = app;