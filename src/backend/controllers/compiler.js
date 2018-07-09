import express from 'express';
import path from 'path';
import { backendBuiltPath as builtPath } from '/environment';

const router = express.Router();

const getJsWorker = (req, res, next) => {
  res.sendFile(path.resolve(builtPath, 'jsWorker.js'));
};

router.route('/js')
  .get(getJsWorker);

export default router;