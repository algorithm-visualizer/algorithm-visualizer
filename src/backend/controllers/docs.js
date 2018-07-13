import express from 'express';
import fs from 'fs';
import path from 'path';
import { NotFoundError } from '/common/error';

const router = express.Router();

const getPath = (...args) => path.resolve(__dirname, '..', 'public', 'docs', ...args);

const readDocs = () => {
  const createKey = name => name.slice(0, -3);
  const list = dirPath => fs.readdirSync(dirPath).filter(filename => /(\.md)$/.test(filename));
  return list(getPath()).map(docName => ({
    key: createKey(docName),
    name: docName,
  }));
};

const docs = readDocs();

const getDocs = (req, res, next) => {
  res.json({ docs: docs });
};

const getDoc = (req, res, next) => {
  const { docKey } = req.params;

  const doc = docs.find(doc => doc.key === docKey);
  if (!doc) return next(new NotFoundError());

  const docPath = getPath(doc.name);
  res.sendFile(docPath);
};

router.route('/')
  .get(getDocs);

router.route('/:docKey')
  .get(getDoc);

export default router;