import express from 'express';
import { AuthorizationError, NotFoundError, PermissionError } from '/common/error';
import auth from './auth';
import category from './category';
import compiler from './compiler';
import wiki from './wiki';

const router = new express.Router();

router.use('/auth', auth);
router.use('/category', category);
router.use('/compiler', compiler);
router.use('/wiki', wiki);
router.use((req, res, next) => next(new NotFoundError()));
router.use((err, req, res, next) => {
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

export default router;