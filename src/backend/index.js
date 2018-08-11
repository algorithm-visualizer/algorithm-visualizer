import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import * as controllers from '/controllers';
import {
  ClientError,
  CompileError,
  ForbiddenError,
  NotFoundError,
  RuntimeError,
  UnauthorizedError,
} from '/common/error';

const app = express();
app.use(morgan('tiny'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
Object.keys(controllers).forEach(key => app.use(`/${key}`, controllers[key]));
app.use((req, res, next) => next(new NotFoundError()));
app.use((err, req, res, next) => {
  const statusMap = [
    [UnauthorizedError, 401],
    [ForbiddenError, 403],
    [NotFoundError, 404],
    [CompileError, 422],
    [RuntimeError, 422],
    [ClientError, 400],
    [Error, 500],
  ];
  const [, status] = statusMap.find(([Error]) => err instanceof Error);
  res.status(status);
  res.send(err.message);
  console.error(err);
});

export default app;
