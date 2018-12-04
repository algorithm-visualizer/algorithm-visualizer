import express from 'express';
import Promise from 'bluebird';
import fs from 'fs-extra';
import path from 'path';
import { NotFoundError } from '/common/error';
import { GitHubApi } from '/apis';
import { createKey, execute, listFiles } from '/common/util';
import webhook from '/common/webhook';

const router = express.Router();

const repoPath = path.resolve(__dirname, '..', 'public', 'algorithms');
const getPath = (...args) => path.resolve(repoPath, ...args);

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

const cacheAlgorithm = (categoryName, algorithmName) => {
  const algorithmKey = createKey(algorithmName);
  const algorithmPath = getPath(categoryName, algorithmName);
  const files = listFiles(algorithmPath).map(fileName => cacheFile(categoryName, algorithmName, fileName));
  return {
    key: algorithmKey,
    name: algorithmName,
    files,
  };
};

const cacheCategory = categoryName => {
  const categoryKey = createKey(categoryName);
  const categoryPath = getPath(categoryName);
  const algorithms = listFiles(categoryPath).map(algorithmName => cacheAlgorithm(categoryName, algorithmName));
  return {
    key: categoryKey,
    name: categoryName,
    algorithms,
  };
};

const cacheCommitAuthors = (page = 1, commitAuthors = {}) => {
  const per_page = 100;
  return GitHubApi.listCommits('algorithm-visualizer', 'algorithms', {
    per_page,
    page,
  }).then(commits => {
    commits.forEach(({ sha, commit, author }) => {
      if (!author) return;
      const { login, avatar_url } = author;
      commitAuthors[sha] = { login, avatar_url };
    });
    if (commits.length < per_page) {
      return commitAuthors;
    } else {
      return cacheCommitAuthors(page + 1, commitAuthors);
    }
  });
};

const cacheContributors = (files, commitAuthors) => Promise.each(files, file => {
  return execute(`git --no-pager log --follow --no-merges --format="%H" "${file.path}"`, getPath(), { stdout: null })
    .then(stdout => {
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
    });
});

const cacheCategories = () => {
  const categories = listFiles(getPath()).map(cacheCategory);

  const files = [];
  categories.forEach(category => category.algorithms.forEach(algorithm => files.push(...algorithm.files)));
  cacheCommitAuthors().then(commitAuthors => cacheContributors(files, commitAuthors));

  return categories;
};

const downloadCategories = () => (
  fs.pathExistsSync(repoPath) ?
    execute(`git fetch && git reset --hard origin/master`, repoPath) :
    execute(`git clone https://github.com/algorithm-visualizer/algorithms.git ${repoPath}`, __dirname)
);

let categories = [];
downloadCategories().then(() => categories = cacheCategories());

webhook.on('algorithms', event => {
  switch (event) {
    case 'push':
      downloadCategories().then(() => categories = cacheCategories());
      break;
  }
});

router.route('/')
  .get((req, res, next) => {
    res.json({ categories });
  });

router.route('/:categoryKey/:algorithmKey')
  .get((req, res, next) => {
    const { categoryKey, algorithmKey } = req.params;

    const category = categories.find(category => category.key === categoryKey);
    if (!category) return next(new NotFoundError());
    const algorithm = category.algorithms.find(algorithm => algorithm.key === algorithmKey);
    if (!algorithm) return next(new NotFoundError());

    const categoryName = category.name;
    const algorithmName = algorithm.name;
    const files = algorithm.files.map(({ name, content, contributors }) => ({ name, content, contributors }));
    res.json({ algorithm: { categoryKey, categoryName, algorithmKey, algorithmName, files } });
  });

export default router;
