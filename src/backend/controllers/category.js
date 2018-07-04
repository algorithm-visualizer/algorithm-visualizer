import express from 'express';
import fs from 'fs';
import path from 'path';
import { NotFoundError } from '/common/error';
import { exec } from 'child_process';
import { repo } from '/common/github';

const router = express.Router();

const getPath = (...args) => path.resolve(__dirname, '..', 'public', 'algorithms', ...args);
const createKey = name => name.toLowerCase().replace(/ /g, '-');
const list = dirPath => fs.readdirSync(dirPath).filter(filename => !filename.startsWith('.'));

const cacheCategories = () => {
  const allFiles = [];
  const cacheCategory = categoryName => {
    const categoryKey = createKey(categoryName);
    const categoryPath = getPath(categoryName);
    const algorithms = list(categoryPath).map(algorithmName => cacheAlgorithm(categoryName, algorithmName));
    return {
      key: categoryKey,
      name: categoryName,
      algorithms,
    };
  };
  const cacheAlgorithm = (categoryName, algorithmName) => {
    const algorithmKey = createKey(algorithmName);
    const algorithmPath = getPath(categoryName, algorithmName);
    const files = list(algorithmPath).map(fileName => cacheFile(categoryName, algorithmName, fileName));
    allFiles.push(...files);
    return {
      key: algorithmKey,
      name: algorithmName,
      files,
    };
  };
  const cacheFile = (categoryName, algorithmName, fileName) => {
    const filePath = getPath(categoryName, algorithmName, fileName);
    const content = fs.readFileSync(filePath, 'utf-8');
    return {
      name: fileName,
      path: filePath,
      content,
      contributors: [],
      toJSON: () => fileName,
    };
  };

  const categories = list(getPath()).map(cacheCategory);

  const commitAuthors = {};
  const cacheCommitAuthors = (page, done) => {
    repo.listCommits({ per_page: 100, page }).then(({ data }) => {
      if (data.length) {
        data.forEach(({ sha, commit, author }) => {
          if (!author) return;
          const { login, avatar_url } = author;
          commitAuthors[sha] = { login, avatar_url };
        });
        cacheCommitAuthors(page + 1, done);
      } else done && done();
    }).catch(console.error);
  };
  const cacheContributors = (fileIndex, done) => {
    const file = allFiles[fileIndex];
    if (file) {
      const cwd = getPath();
      exec(`git --no-pager log --follow --no-merges --format="%H" "${file.path}"`, { cwd }, (error, stdout, stderr) => {
        if (!error && !stderr) {
          const output = stdout.toString().replace(/\n$/, '');
          const shas = output.split('\n').reverse();
          const contributors = [];
          for (const sha of shas) {
            const author = commitAuthors[sha];
            if (author && !contributors.find(contributor => contributor.login === author.login)) {
              contributors.push(author);
            }
          }
          file.contributors = contributors;
        }
        cacheContributors(fileIndex + 1, done);
      });
    } else done && done();
  };
  cacheCommitAuthors(1, () => cacheContributors(0));

  return categories;
};
const cachedCategories = cacheCategories(); // TODO: cache again when webhooked

const getCategories = (req, res, next) => {
  res.json({ categories: cachedCategories });
};

const getAlgorithm = (req, res, next) => {
  const { categoryKey, algorithmKey } = req.params;

  const category = cachedCategories.find(category => category.key === categoryKey);
  if (!category) return next(new NotFoundError());
  const algorithm = category.algorithms.find(algorithm => algorithm.key === algorithmKey);
  if (!algorithm) return next(new NotFoundError());

  const files = algorithm.files.map(({ name, content, contributors }) => ({ name, content, contributors }));
  res.json({ algorithm: { ...algorithm, files, titles: [category.name, algorithm.name] } });
};

router.route('/')
  .get(getCategories);

router.route('/:categoryKey/:algorithmKey')
  .get(getAlgorithm);

export default router;