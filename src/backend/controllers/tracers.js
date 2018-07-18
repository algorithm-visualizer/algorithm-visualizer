import Promise from 'bluebird';
import express from 'express';
import fs from 'fs-extra';
import uuid from 'uuid';
import path from 'path';
import child_process from 'child_process';
import { GitHubApi } from '/apis';
import { __PROD__ } from '/environment';
import { CompileError, RuntimeError } from '/common/error';

const router = express.Router();

const getLibPath = (...args) => path.resolve(__dirname, '..', 'public', 'libs', ...args);

const downloadLibs = () => {
  GitHubApi.getLatestRelease('algorithm-visualizer', 'tracers').then(release => {
    return Promise.each(release.assets, asset => GitHubApi.download(asset.browser_download_url, getLibPath(asset.name)));
  });
};
if (__PROD__) downloadLibs(); // TODO: download again when webhooked

const getJsWorker = (req, res, next) => {
  res.sendFile(getLibPath('js.js'));
};

const execute = (imageId, srcPath, command, ErrorClass) => new Promise((resolve, reject) => {
  const libPath = getLibPath();
  // TODO: memory limit + time limit + space limit?
  const dockerCommand = `docker run --rm -w=/usr/judge -t -v=${libPath}:/usr/bin/tracers:ro -v=${srcPath}:/usr/judge:rw -e MAX_TRACES=1000000 -e MAX_TRACERS=100 ${imageId}`;
  child_process.exec(`${dockerCommand} ${command}`, (error, stdout, stderr) => {
    if (error) return reject(new ErrorClass(stdout));
    resolve();
  });
});

const trace = ({ imageId, compileCommand, runCommand }) => (req, res, next) => {
  const { code } = req.body;
  const srcPath = path.resolve(__dirname, '..', 'public', 'codes', uuid.v4());
  fs.outputFile(path.resolve(srcPath, 'code.java'), code)
    .then(() => execute(imageId, srcPath, compileCommand, CompileError))
    .then(() => execute(imageId, srcPath, runCommand, RuntimeError))
    .then(() => res.sendFile(path.resolve(srcPath, 'traces.json')))
    .catch(next)
    .finally(() => fs.remove(srcPath));
};

router.route('/js')
  .get(getJsWorker);

router.route('/java')
  .post(trace({
    imageId: 'baekjoon/onlinejudge-java:1.8',
    compileCommand: 'javac -cp /usr/bin/tracers/java.jar code.java',
    runCommand: 'java -cp /usr/bin/tracers/java.jar:. Main',
  }));

export default router;