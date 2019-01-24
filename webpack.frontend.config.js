const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const {
  __PROD__,
  __DEV__,
  frontendBuildPath: buildPath,
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
    path: buildPath,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        include: srcPath,
        exclude: path.resolve(srcPath, 'files'),
      }, {
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
    ],
  },
  plugins: filter([
    new CleanWebpackPlugin([buildPath]),
    new CopyWebpackPlugin([{ from: path.resolve(srcPath, 'static'), to: buildPath }]),
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
    new webpack.HashedModuleIdsPlugin(),
    // new BundleAnalyzerPlugin(),
  ]),
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 128 * 1024,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            return `npm.${packageName.replace('@', '')}`;
          },
        },
      },
    },
  },
  mode: __DEV__ ? 'development' : 'production',
};
