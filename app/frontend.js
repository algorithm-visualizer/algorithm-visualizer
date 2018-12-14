const express = require('express');
const path = require('path');
const fs = require('fs');
const url = require('url');
const packageJson = require('../package');

const {
  __DEV__,
  frontendSrcPath,
  frontendBuildPath,
} = require('../environment');

const app = express();

if (__DEV__) {
  const webpack = require('webpack');
  const webpackDev = require('webpack-dev-middleware');
  const webpackHot = require('webpack-hot-middleware');
  const webpackConfig = require('../webpack.frontend.config.js');
  const compiler = webpack(webpackConfig);
  app.use(express.static(path.resolve(frontendSrcPath, 'static')));
  app.use(webpackDev(compiler, {
    stats: {
      cached: false,
      colors: true,
    },
    serverSideRender: true,
    index: false,
  }));
  app.use(webpackHot(compiler));
  app.use((req, res, next) => {
    const { fs } = res.locals;
    const outputPath = res.locals.webpackStats.toJson().outputPath;
    const filePath = path.resolve(outputPath, 'index.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) return next(err);
      res.indexFile = data;
      next();
    });
  });
} else {
  app.use(express.static(frontendBuildPath));
  app.use((req, res, next) => {
    const filePath = path.resolve(frontendBuildPath, 'index.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) return next(err);
      res.indexFile = data;
      next();
    });
  });
}

app.use((req, res) => {
  const backend = require('./backend');
  const hierarchy = backend.getHierarchy();

  const [, categoryKey, algorithmKey] = url.parse(req.originalUrl).pathname.split('/');
  let { title, description } = packageJson;
  const algorithm = hierarchy.find(categoryKey, algorithmKey);
  if (algorithm) {
    title = [algorithm.categoryName, algorithm.algorithmName].join(' - ');
    description = algorithm.description;
  }

  const indexFile = res.indexFile
    .replace(/\$TITLE/g, title)
    .replace(/\$DESCRIPTION/g, description)
    .replace(/\$ALGORITHM/g, algorithm ? JSON.stringify(algorithm).replace(/</g, '\\u003c') : 'undefined');
  res.send(indexFile);
});

module.exports = app;
