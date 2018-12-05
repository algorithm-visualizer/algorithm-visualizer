const compression = require('compression');
const history = require('connect-history-api-fallback');
const express = require('express');
const app = express();

const frontend = require('./frontend');
const backend = require('./backend');

const {
  apiEndpoint,
  credentials,
} = require('../environment');

app.use((req, res, next) => {
  if (req.hostname === 'algo-visualizer.jasonpark.me') {
    res.redirect(301, 'https://algorithm-visualizer.org/');
  } else if (credentials && !req.secure) {
    res.redirect(301, `https://${req.hostname}${req.url}`);
  } else {
    next();
  }
});
app.use(apiEndpoint, backend);
app.use(history());
app.use(compression());
app.use(frontend);

module.exports = app;
