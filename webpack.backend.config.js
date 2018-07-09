const CleanWebpackPlugin = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const fs = require('fs');

const {
  __DEV__,
  backendBuiltPath: builtPath,
  backendSrcPath: srcPath,
} = require('./environment');

const alias = {
  '/environment': path.resolve(__dirname, 'environment.js'),
};
fs.readdirSync(srcPath).forEach(name => {
  alias['/' + name] = path.resolve(srcPath, name);
});

module.exports = [{
  target: 'node',
  node: {
    __dirname: true,
  },
  entry: srcPath,
  externals: [nodeExternals()],
  resolve: {
    modules: [srcPath],
    extensions: ['.js'],
    alias,
  },
  output: {
    path: builtPath,
    filename: 'index.js',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader', include: srcPath },
    ],
  },
  plugins: [
    new CleanWebpackPlugin([builtPath]),
  ],
  mode: __DEV__ ? 'development' : 'production',
}, {
  target: 'web',
  entry: path.resolve(srcPath, 'tracers', 'js', 'worker'),
  resolve: {
    modules: [srcPath],
    extensions: ['.js'],
    alias,
  },
  output: {
    path: builtPath,
    filename: 'jsWorker.js',
  },
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader', include: srcPath },
    ],
  },
  mode: __DEV__ ? 'development' : 'production',
}];