const express = require('express');
const history = require('connect-history-api-fallback');
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
app.use(history());

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
  }));
  app.use(webpackHot(compiler));
} else {
  const { hierarchy } = require('./backend'); // TODO: Hmm...
  app.get('/index.html', (req, res, next) => {
    const [, categoryKey, algorithmKey] = url.parse(req.originalUrl).pathname.split('/');
    let { title, description } = packageJson;
    const algorithm = hierarchy.find(categoryKey, algorithmKey);
    if (algorithm) {
      title = [algorithm.categoryName, algorithm.algorithmName].join(' - ');
      description = algorithm.description;
    }

    const filePath = path.resolve(frontendBuildPath, 'index.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) next(err);
      const result = data.replace(/\$TITLE/g, title).replace(/\$DESCRIPTION/g, description);
      res.send(result);
    });
  });
  app.use(express.static(frontendBuildPath));
}

module.exports = app;
