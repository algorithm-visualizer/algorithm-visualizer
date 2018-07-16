import Promise from 'bluebird';
import express from 'express';
import path from 'path';
import { GitHubApi } from '/apis';

const router = express.Router();

const getPath = (...args) => path.resolve(__dirname, '..', 'public', 'libs', ...args);

const downloadLibs = () => {
  GitHubApi.getLatestRelease('algorithm-visualizer', 'tracers').then(release => {
    return Promise.each(release.assets, asset => GitHubApi.download(asset.browser_download_url, getPath(asset.name)));
  });
};
downloadLibs(); // TODO: download again when webhooked

const getJsWorker = (req, res, next) => {
  res.sendFile(path.resolve(__dirname, '..', 'tracers', 'languages', 'js', 'build', 'index.js'));
};

const compileJava = (req, res, next) => {
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