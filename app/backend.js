const proxy = require('http-proxy-middleware');
const {
  __DEV__,
  proxyPort,
  backendBuildPath,
  apiEndpoint,
} = require('../environment');

if (__DEV__) {
  const webpack = require('webpack');

  const webpackConfig = require('../webpack.backend.config.js');

  const compiler = webpack(webpackConfig);

  let lastHash = null;
  let httpServer = null;
  compiler.watch({
    watchOptions: {
      ignored: /public/,
    },
  }, (err, stats) => {
    if (err) {
      lastHash = null;
      compiler.purgeInputFileSystem();
      console.error(err);
    }
    if (stats.hash !== lastHash) {
      lastHash = stats.hash;
      console.info(stats.toString({
        cached: false,
        colors: true,
      }));

      try {
        if (httpServer) httpServer.close();
        delete require.cache[require.resolve(backendBuildPath)];
        const app = require(backendBuildPath).default;
        httpServer = app.listen(proxyPort);
      } catch (e) {
        console.error(e);
      }
    }
  });

  module.exports = proxy({
    target: `http://localhost:${proxyPort}/`,
    pathRewrite: { ['^' + apiEndpoint]: '' },
    ws: true,
  });
} else {
  module.exports = require(backendBuildPath).default;
}
