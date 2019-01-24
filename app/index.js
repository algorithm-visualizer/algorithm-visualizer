const path = require('path');
const express = require('express');
const compression = require('compression');
const app = express();

const frontend = require('./frontend');
const backend = require('./backend');

const {
  apiEndpoint,
  credentials,
} = require('../environment');

app.use(compression());
app.use((req, res, next) => {
  if (req.hostname === 'algo-visualizer.jasonpark.me') {
    res.redirect(301, 'https://algorithm-visualizer.org/');
  } else if (credentials && !req.secure) {
    res.redirect(301, `https://${req.hostname}${req.url}`);
  } else {
    next();
  }
});
app.get('/robots.txt', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'robots.txt'));
});
app.use(apiEndpoint, backend);
app.use(frontend);

module.exports = app;
