import express from 'express';
import fs from 'fs-extra';
import uuid from 'uuid';
import path from 'path';
import { GitHubApi } from '/apis';
import { execute } from '/common/util';
import { CompileError, RuntimeError } from '/common/error';

const router = express.Router();

const repoPath = path.resolve(__dirname, '..', 'public', 'tracers');
const getLibsPath = (...args) => path.resolve(repoPath, 'libs', ...args);
const getCodesPath = (...args) => path.resolve(__dirname, '..', 'public', 'codes', ...args);

const buildRelease = release => (
  fs.pathExistsSync(repoPath) ?
    execute(`git fetch && ! git diff-index --quiet ${release.target_commitish}`, repoPath) :
    execute(`git clone git@github.com:algorithm-visualizer/tracers ${repoPath}`, __dirname)
).then(() => execute(`git reset --hard ${release.target_commitish} && npm install && npm run build`, repoPath));

GitHubApi.getLatestRelease('algorithm-visualizer', 'tracers').then(buildRelease);
// TODO: build release when webhooked

const getJsWorker = (req, res, next) => {
  res.sendFile(getLibsPath('js', 'tracers.js'));
};

const executeInDocker = (imageId, ext, srcPath, command) => {
  // TODO: memory limit + time limit + space limit?
  const libsPath = getLibsPath(ext);
  const dockerCommand = [
    `docker run --rm`,
    '-w=/usr/judge',
    `-v=${libsPath}:/usr/bin/tracers:ro`,
    `-v=${srcPath}:/usr/judge:rw`,
    `-e MAX_TRACES=${1e6} -e MAX_TRACERS=${1e2}`,
    imageId,
  ].join(' ');
  return execute(`${dockerCommand} ${command}`, repoPath, { stdout: null, stderr: null });
};

const trace = ({ ext, imageId, compileCommand, runCommand }) => (req, res, next) => {
  const { code } = req.body;
  const srcPath = getCodesPath(uuid.v4());
  fs.outputFile(path.resolve(srcPath, `Main.${ext}`), code)
    .then(() => executeInDocker(imageId, ext, srcPath, compileCommand)
      .catch(error => {
        throw new CompileError(error);
      }))
    .then(() => executeInDocker(imageId, ext, srcPath, runCommand)
      .catch(error => {
        throw new RuntimeError(error);
      }))
    .then(() => res.sendFile(path.resolve(srcPath, 'traces.json')))
    .catch(next)
    .finally(() => fs.remove(srcPath));
};


router.route('/js')
  .get(getJsWorker);

router.route('/java')
  .post(trace({
    ext: 'java',
    imageId: 'openjdk:8',
    compileCommand: 'javac -cp /usr/bin/tracers/tracers.jar Main.java',
    runCommand: 'java -cp /usr/bin/tracers/tracers.jar:. Main',
  }));

router.route('/cpp')
  .post(trace({
    ext: 'cpp',
    imageId: 'gcc:8.1',
    compileCommand: 'g++ Main.cpp -o Main -O2 -std=c++11 -L/usr/bin/tracers/lib -l:tracers.a -I/usr/bin/tracers/include',
    runCommand: './Main',
  }));

export default router;