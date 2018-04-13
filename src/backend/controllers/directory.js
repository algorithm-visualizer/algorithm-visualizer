import express from 'express';
import fs from 'fs';
import path from 'path';
import { NotFoundError } from '/common/error';

const router = express.Router();

const getPath = (...args) => path.resolve(__dirname, '..', '..', '..', 'algorithm', ...args);

const readCategories = () => {
  const createKey = name => name.toLowerCase().replace(/ /g, '-');
  const list = dirPath => fs.readdirSync(dirPath).filter(filename => !/\./.test(filename)); // visible directories only
  const getCategory = categoryName => {
    const categoryKey = createKey(categoryName);
    const categoryPath = getPath(categoryName);
    const algorithms = list(categoryPath).map(algorithmName => getAlgorithm(categoryName, algorithmName));
    return {
      key: categoryKey,
      name: categoryName,
      algorithms,
    };
  };
  const getAlgorithm = (categoryName, algorithmName) => {
    const algorithmKey = createKey(algorithmName);
    const algorithmPath = getPath(categoryName, algorithmName);
    const files = list(algorithmPath).map(fileName => getFile(categoryName, algorithmName, fileName));
    return {
      key: algorithmKey,
      name: algorithmName,
      files,
    }
  };
  const getFile = (categoryName, algorithmName, fileName) => {
    const fileKey = createKey(fileName);
    return {
      key: fileKey,
      name: fileName,
    };
  };
  return list(getPath()).map(getCategory);
};

const categories = readCategories();

const getCategories = (req, res, next) => {
  res.json({ categories });
};

const getFile = (req, res, next) => {
  const { categoryKey, algorithmKey, fileKey } = req.params;

  const category = categories.find(category => category.key === categoryKey);
  if (!category) return next(new NotFoundError());
  const algorithm = category.algorithms.find(algorithm => algorithm.key === algorithmKey);
  if (!algorithm) return next(new NotFoundError());
  const file = algorithm.files.find(file => file.key === fileKey);
  if (!file) return next(new NotFoundError());

  const dataPath = getPath(category.name, algorithm.name, file.name, 'data.js');
  const codePath = getPath(category.name, algorithm.name, file.name, 'code.js');
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) return next(err);
    fs.readFile(codePath, 'utf8', (err, code) => {
      if (err) return next(err);
      res.json({ data, code });
    });
  });
};

const getDescription = (req, res, next) => {
  const { categoryKey, algorithmKey } = req.params;

  const category = categories.find(category => category.key === categoryKey);
  if (!category) return next(new NotFoundError());
  const algorithm = category.algorithms.find(algorithm => algorithm.key === algorithmKey);
  if (!algorithm) return next(new NotFoundError());

  const descriptionPath = getPath(category.name, algorithm.name, 'desc.json');
  fs.readFile(descriptionPath, 'utf8', (err, raw) => {
    if (err) return next(err);
    const description = JSON.parse(raw);
    res.json({ description });
  });
};

router.route('/')
  .get(getCategories);

router.route('/description/:categoryKey/:algorithmKey')
  .get(getDescription);

router.route('/:categoryKey/:algorithmKey/:fileKey')
  .get(getFile);

export default router;