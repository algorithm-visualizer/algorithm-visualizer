import Promise from 'bluebird';
import express from 'express';
import fs from 'fs-extra';
import uuid from 'uuid';
import path from 'path';
import { GitHubApi } from '/apis';

const router = express.Router();

const getLibPath = (...args) => path.resolve(__dirname, '..', 'public', 'libs', ...args);
const createTempDir = () => {
  const dirPath = path.resolve(__dirname, '..', 'public', 'codes', uuid.v4());
  fs.mkdirSync(dirPath);
  return dirPath;
};

const downloadLibs = () => {
  GitHubApi.getLatestRelease('algorithm-visualizer', 'tracers').then(release => {
    return Promise.each(release.assets, asset => GitHubApi.download(asset.browser_download_url, getLibPath(asset.name)));
  });
};
downloadLibs(); // TODO: download again when webhooked

const getJsWorker = (req, res, next) => {
  res.sendFile(getLibPath('js.js'));
};

const compileJava = (req, res, next) => {
  const dirPath = createTempDir();
  fs.writeFileSync(dirPath, req.body);
  /* TODO:
  1. Write into a source file
  2. Execute in Docker
  3. Read the output file
   */
};

router.route('/js')
  .get(getJsWorker);

router.route('/java')
  .post(compileJava);

export default router;