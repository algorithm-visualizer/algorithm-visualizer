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
  const tracesPath = path.resolve(tempPath, 'traces.json');
  fs.outputFile(path.resolve(tempPath, `Main.${lang}`), code)
    .then(() => {
      const builder = builderMap[lang];
      const containerName = uuid.v4();
      let killed = false;
      const timer = setTimeout(() => {
        execute(`docker kill ${containerName}`).then(() => {
          killed = true;
        });
      }, timeLimit);
      return execute([
        'docker run --rm',
        `--name=${containerName}`,
        '-w=/usr/tracer',
        `-v=${tempPath}:/usr/tracer:rw`,
        `-m=${memoryLimit}m`,
        builder.imageName,
      ].join(' ')).catch(error => {
        if (killed) throw new Error('Time Limit Exceeded');
        throw error;
      }).finally(() => clearTimeout(timer));
    })
    .then(() => fs.pathExists(tracesPath))
    .then(exists => {
      if (!exists) throw new Error('Traces Not Found');
      res.sendFile(tracesPath);
    })
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
    router.get(`/${lang}`, (req, res) => res.sendFile(builder.workerPath));
  }
});

export default router;
