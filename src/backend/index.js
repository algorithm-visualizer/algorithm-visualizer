import path from 'path';
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import * as controllers from '/controllers';
import { ClientError, ForbiddenError, NotFoundError, UnauthorizedError } from '/common/error';
import webhook from '/common/webhook';
import { execute } from '/common/util';

const app = express();
app.use(morgan('tiny'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
Object.keys(controllers).forEach(key => app.use(`/${key}`, controllers[key]));
app.use('/webhook', webhook);
app.use((req, res, next) => next(new NotFoundError()));
app.use((err, req, res, next) => {
  const statusMap = [
    [UnauthorizedError, 401],
    [ForbiddenError, 403],
    [NotFoundError, 404],
    [ClientError, 400],
    [Error, 500],
  ];
  const [, status] = statusMap.find(([Error]) => err instanceof Error);
  res.status(status);
  res.send(err.message);
  console.error(err);
});

const rootPath = path.resolve(__dirname, '..', '..');
webhook.on('algorithm-visualizer', event => {
  switch (event) {
    case 'push':
      execute([
        'git fetch',
        'git reset --hard origin/master',
        'npm install',
        'npm run build',
        'pm2 startOrRestart ./pm2.config.js',
      ].join(' && '), rootPath);
      break;
  }
});

export default app;
