const {
  __DEV__,
  backendBuildPath,
} = require('../environment');

if (__DEV__) {
  const webpack = require('webpack');
  const webpackConfig = require('../webpack.backend.config.js');
  const compiler = webpack(webpackConfig);

  let backend = null;
  let lastHash = null;
  compiler.watch({
    watchOptions: {
      ignored: /public/,
    },
  }, (err, stats) => {
    if (err) {
      lastHash = null;
      compiler.purgeInputFileSystem();
      console.error(err);
    } else if (stats.hash !== lastHash) {
      lastHash = stats.hash;
      console.info(stats.toString({
        cached: false,
        colors: true,
      }));

      delete require.cache[require.resolve(backendBuildPath)];
      backend = require(backendBuildPath).default;
    }
  });

  const backendWrapper = (req, res, next) => backend(req, res, next);
  backendWrapper.getHierarchy = () => backend.hierarchy;
  module.exports = backendWrapper;
} else {
  const backend = require(backendBuildPath).default;
  const backendWrapper = (req, res, next) => backend(req, res, next);
  backendWrapper.getHierarchy = () => backend.hierarchy;
  module.exports = backendWrapper;
}
