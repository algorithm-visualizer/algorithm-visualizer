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

const srcPath = path.resolve(__dirname, 'src');
const frontendSrcPath = path.resolve(srcPath, 'frontend');
const backendSrcPath = path.resolve(srcPath, 'backend');

const apiEndpoint = '/api';

module.exports = {
  __PROD__,
  __DEV__,
  httpPort,
  proxyPort,
  frontendBuiltPath,
  backendBuiltPath,
  frontendSrcPath,
  backendSrcPath,
  apiEndpoint,
};