import express from 'express';
import fs from 'fs-extra';
import Promise from 'bluebird';
import uuid from 'uuid';
import path from 'path';
import { GitHubApi } from '/apis';
import { execute } from '/common/util';
import webhook from '/common/webhook';
import { ImageBuilder, WorkerBuilder } from '/tracers';
import { memoryLimit, timeLimit } from '/common/config';

const router = express.Router();

const trace = lang => (req, res, next) => {
  const { code } = req.body;
  const tempPath = path.resolve(__dirname, '..', 'public', 'codes', uuid.v4());
  fs.outputFile(path.resolve(tempPath, `Main.${lang}`), code)
    .then(() => {
      const builder = builderMap[lang];
      const containerName = uuid.v4();
      let killed = false;
      const timer = setTimeout(() => {
/*        execute(`docker kill ${containerName}`).then(() => {
          killed = true;
        });*/
      }, timeLimit);
      return execute([
        'docker run --rm',
        `--name=${containerName}`,
        '-w=/usr/visualization',
        `-v=${tempPath}:/usr/visualization:rw`,
        //`-m=${memoryLimit}m`,
        '-e ALGORITHM_VISUALIZER=1',
        builder.imageName,
      ].join(' '), { stdout: null, stderr: null }).catch(error => {
        if (killed) throw new Error('Time Limit Exceeded');
        throw error;
      }).finally(() => clearTimeout(timer));
    })
    .then(() => new Promise((resolve, reject) => {
      const visualizationPath = path.resolve(tempPath, 'visualization.json');
      res.sendFile(visualizationPath, err => {
        if (err) return reject(new Error('Visualization Not Found'));
        resolve();
      });
    }))
    .catch(next)
    .finally(() => fs.remove(tempPath));
};

const builderMap = {
  js: new WorkerBuilder(),
  cpp: new ImageBuilder('cpp'),
  java: new ImageBuilder('java'),
};

Promise.map(Object.keys(builderMap), lang => {
  const builder = builderMap[lang];
  return GitHubApi.getLatestRelease('algorithm-visualizer', `tracers.${lang}`).then(builder.build);
}).catch(console.error);

webhook.on('release', (repo, data) => {
  const result = /^tracers\.(\w+)$/.exec(repo);
  if (result) {
    const [, lang] = result;
    const builder = builderMap[lang];
    builder.build(data.release).catch(console.error);
  }
});

Object.keys(builderMap).forEach(lang => {
  const builder = builderMap[lang];
  if (builder instanceof ImageBuilder) {
    router.post(`/${lang}`, trace(lang));
  } else if (builder instanceof WorkerBuilder) {
    router.get(`/${lang}`, (req, res) => res.sendFile(builder.tracerPath));
    router.get(`/${lang}/worker`, (req, res) => res.sendFile(builder.workerPath));
  }
});

export default router;
