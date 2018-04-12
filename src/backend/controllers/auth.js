import express from 'express';

const router = express.Router();

const createAuth = (req, res, next) => {
  res.json({});
};

const destroyAuth = (req, res, next) => {
  res.json({});
};

router.route('/')
  .post(createAuth)
  .delete(destroyAuth);

export default router;