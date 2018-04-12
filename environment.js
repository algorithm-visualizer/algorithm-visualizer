const path = require('path');

const {
  NODE_ENV = 'production',

  HTTP_PORT = '8080',
  PROXY_PORT = '3000',
} = process.env;

const __PROD__ = NODE_ENV === 'production';
const __DEV__ = !__PROD__;

const httpPort = parseInt(HTTP_PORT);
const proxyPort = parseInt(PROXY_PORT);

const builtPath = path.resolve(__dirname, 'built');
const frontendBuiltPath = path.resolve(builtPath, 'frontend');
const backendBuiltPath = path.resolve(builtPath, 'backend');
const apiBuiltPath = path.resolve(frontendBuiltPath, 'api');
const algorithmApiBuiltPath = path.resolve(apiBuiltPath, 'algorithm');
const wikiApiBuiltPath = path.resolve(apiBuiltPath, 'wiki');

const srcPath = path.resolve(__dirname, 'src');
const frontendSrcPath = path.resolve(srcPath, 'frontend');
const backendSrcPath = path.resolve(srcPath, 'backend');
const apiSrcPath = path.resolve(__dirname);
const algorithmApiSrcPath = path.resolve(apiSrcPath, 'algorithm');
const wikiApiSrcPath = path.resolve(apiSrcPath, 'wiki');

const apiEndpoint = '/api';

module.exports = {
  __PROD__,
  __DEV__,
  httpPort,
  proxyPort,
  frontendBuiltPath,
  backendBuiltPath,
  apiBuiltPath,
  algorithmApiBuiltPath,
  wikiApiBuiltPath,
  frontendSrcPath,
  backendSrcPath,
  apiSrcPath,
  algorithmApiSrcPath,
  wikiApiSrcPath,
  apiEndpoint,
};