const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const {
  __PROD__,
  __DEV__,
  frontendBuiltPath: builtPath,
  frontendSrcPath: srcPath,
} = require('./environment');

const filter = arr => arr.filter(v => v);
const alias = {
  '/environment': path.resolve(__dirname, 'environment.js'),
};
fs.readdirSync(srcPath).forEach(name => {
  alias['/' + name] = path.resolve(srcPath, name);
});

process.traceDeprecation = true;

module.exports = {
  target: 'web',
  entry: filter([
    'babel-polyfill',
    __DEV__ && 'webpack-hot-middleware/client',
    srcPath,
  ]),
  resolve: {
    modules: [path.resolve(__dirname, 'node_modules')],
    extensions: ['.jsx', '.js', '.scss'],
    alias,
  },
  output: {
    filename: __DEV__ ? '[name].js' : '[name].[chunkhash].js',
    path: builtPath,
    publicPath: '/',
  },
  module: {
    rules: [
      { test: /\.(js|jsx)$/, use: 'babel-loader', include: srcPath },
      {
        test: /\.scss$/,
        use: filter([
          __DEV__ && 'css-hot-loader',
          MiniCssExtractPlugin.loader,
          'css-loader?minimize&importLoaders=2&modules&localIdentName=[local]__[hash:base64:5]',
          'postcss-loader',
          'sass-loader',
        ]),
        include: srcPath,
      }, {
        test: /\.css$/,
        use: filter([
          MiniCssExtractPlugin.loader,
          'css-loader',
        ]),
        exclude: srcPath,
      },
      { test: /\.md$/, use: 'raw-loader' },
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /\/node_modules\//,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
        },
        core: {
          test: /\/core\//,
          name: 'core',
          chunks: 'all',
          priority: 5,
          minSize: 0,
        },
      },
    },
    minimizer: [
      new UglifyJSPlugin({
        exclude: /core/,
      }),
      new UglifyJSPlugin({
        include: /core/,
        uglifyOptions: {
          keep_classnames: true,
          keep_fnames: true,
        },
      }),
    ],
  },
  plugins: filter([
    new CleanWebpackPlugin([builtPath]),
    new CopyWebpackPlugin([{ from: path.resolve(srcPath, 'static'), to: builtPath }]),
    new HtmlWebpackPlugin({
      template: path.resolve(srcPath, 'template.html'),
      hash: false,
      filename: 'index.html',
      inject: 'body',
      minify: {
        collapseWhitespace: true,
      },
    }),
    new MiniCssExtractPlugin({ filename: __DEV__ ? '[name].css' : '[name].[contenthash].css' }),
    __PROD__ && new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i }),
    __DEV__ && new webpack.HotModuleReplacementPlugin(),
    // new BundleAnalyzerPlugin(),
  ]),
  mode: __DEV__ ? 'development' : 'production',
};