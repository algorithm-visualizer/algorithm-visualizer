import express from 'express';
import fs from 'fs';
import path from 'path';
import { NotFoundError } from '/common/error';

const router = express.Router();

const getPath = (...args) => path.resolve(__dirname, '..', '..', '..', 'algorithm', ...args);

const readCategories = () => {
  const createKey = name => name.toLowerCase().replace(/ /g, '-');
  const list = dirPath => fs.readdirSync(dirPath).filter(filename => !filename.startsWith('.'));
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
    const files = list(algorithmPath);
    return {
      key: algorithmKey,
      name: algorithmName,
      files,
    }
  };
  return list(getPath()).map(getCategory);
};

const categories = readCategories();

const getCategories = (req, res, next) => {
  res.json({ categories });
};

const getFile = (req, res, next) => {
  const { categoryKey, algorithmKey, fileName } = req.params;

  const category = categories.find(category => category.key === categoryKey);
  if (!category) return next(new NotFoundError());
  const algorithm = category.algorithms.find(algorithm => algorithm.key === algorithmKey);
  if (!algorithm) return next(new NotFoundError());
  if (!algorithm.files.includes(fileName)) return next(new NotFoundError());

  const filePath = getPath(category.name, algorithm.name, fileName);
  res.sendFile(filePath);
};

router.route('/')
  .get(getCategories);

router.route('/:categoryKey/:algorithmKey/:fileName')
  .get(getFile);

export default router;