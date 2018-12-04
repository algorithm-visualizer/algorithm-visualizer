import express from 'express';
import fs from 'fs-extra';
import uuid from 'uuid';
import path from 'path';
import { GitHubApi } from '/apis';
import { execute } from '/common/util';
import webhook from '/common/webhook';

const router = express.Router();

const repoPath = path.resolve(__dirname, '..', 'public', 'tracers');
const getCodesPath = (...args) => path.resolve(__dirname, '..', 'public', 'codes', ...args);

const getJsWorker = (req, res, next) => {
  res.sendFile(path.resolve(repoPath, 'src', 'languages', 'js', 'tracers', 'build', 'tracers.js'));
};

const trace = lang => (req, res, next) => {
  const { code } = req.body;
  const tempPath = getCodesPath(uuid.v4());
  fs.outputFile(path.resolve(tempPath, `Main.${lang}`), code)
    .then(() => execute(`LANG=${lang} TEMP_PATH=${tempPath} ./bin/compile`, repoPath, { stdout: null, stderr: null }))
    .then(() => execute(`LANG=${lang} TEMP_PATH=${tempPath} ./bin/run`, repoPath, { stdout: null, stderr: null }))
    .then(() => res.sendFile(path.resolve(tempPath, 'traces.json')))
    .catch(next)
    .finally(() => fs.remove(tempPath));
};

const buildRelease = release => (
  fs.pathExistsSync(repoPath) ?
    execute(`git fetch && ! git diff-index --quiet ${release.target_commitish}`, repoPath) :
    execute(`git clone https://github.com/algorithm-visualizer/tracers.git ${repoPath}`, __dirname)
).then(() => execute(`git reset --hard ${release.target_commitish} && npm install && npm run build && ./bin/build`, repoPath));

GitHubApi.getLatestRelease('algorithm-visualizer', 'tracers').then(buildRelease);

webhook.on('tracers', (event, data) => {
  switch (event) {
    case 'release':
      buildRelease(data.release);
      break;
  }
});

router.route('/js')
  .get(getJsWorker);

router.route('/java')
  .post(trace('java'));

router.route('/cpp')
  .post(trace('cpp'));

export default router;
