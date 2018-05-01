const path = require('path');

const {
  NODE_ENV = 'production',

  HTTP_PORT = '8080',
  PROXY_PORT = '3000',

  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_BOT_USERNAME,
  GITHUB_BOT_PASSWORD,
  GITHUB_ORG = 'algorithm-visualizer',
  GITHUB_REPO_ALGORITHMS = 'algorithms',
} = process.env;

const __PROD__ = NODE_ENV === 'production';
const __DEV__ = !__PROD__;

const httpPort = parseInt(HTTP_PORT);
const proxyPort = parseInt(PROXY_PORT);

const githubClientId = GITHUB_CLIENT_ID;
const githubClientSecret = GITHUB_CLIENT_SECRET;
const githubBotAuth = {
  username: GITHUB_BOT_USERNAME,
  password: GITHUB_BOT_PASSWORD,
};
const githubOrg = GITHUB_ORG;
const githubRepos = {
  algorithms: GITHUB_REPO_ALGORITHMS
};

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
  githubClientId,
  githubClientSecret,
  githubBotAuth,
  githubOrg,
  githubRepos,
  frontendBuiltPath,
  backendBuiltPath,
  frontendSrcPath,
  backendSrcPath,
  apiEndpoint,
};