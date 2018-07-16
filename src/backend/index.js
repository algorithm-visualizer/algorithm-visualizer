import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import * as controllers from '/controllers';
import { AuthorizationError, NotFoundError, PermissionError } from '/common/error';

const app = express();
app.use(morgan('tiny'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
Object.keys(controllers).forEach(key => app.use(`/${key}`, controllers[key]));
app.use((req, res, next) => next(new NotFoundError()));
app.use((err, req, res, next) => {
  const statusMap = [
    [AuthorizationError, 401],
    [PermissionError, 403],
    [NotFoundError, 404],
    [Error, 500],
  ];
  const [, status] = statusMap.find(([Error]) => err instanceof Error);
  res.status(status);
  res.json({
    status,
    err,
  });
  console.error(err);
});

export default app;