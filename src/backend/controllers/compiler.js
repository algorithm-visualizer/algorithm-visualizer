import express from 'express';
import path from 'path';

const router = express.Router();

const getJsWorker = (req, res, next) => {
  res.sendFile(path.resolve(__dirname, '..', 'tracers', 'js', 'built', 'index.js'));
};

const compileJava = (req, res, next) => {
  /* TODO:
  1. Write into a source file
  2. Execute in Docker
  3. Read the output file
   */
};

router.route('/js')
  .get(getJsWorker);

router.route('/java')
  .post(compileJava);

export default router;