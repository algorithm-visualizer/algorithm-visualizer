import express from 'express';
import fs from 'fs';
import path from 'path';
import { NotFoundError } from '/common/error';

const router = express.Router();

const getPath = (...args) => path.resolve(__dirname, '..', '..', '..', 'wiki', ...args);

const readWikis = () => {
  const createKey = name => name.slice(0, -3);
  const list = dirPath => fs.readdirSync(dirPath).filter(filename => /(\.md)$/.test(filename));
  return list(getPath()).map(wikiName => ({
    key: createKey(wikiName),
    name: wikiName,
  }));
};

const wikis = readWikis();

const getWikis = (req, res, next) => {
  res.json({ wikis });
};

const getWiki = (req, res, next) => {
  const { wikiKey } = req.params;

  const wiki = wikis.find(wiki => wiki.key === wikiKey);
  if (!wiki) return next(new NotFoundError());

  const wikiPath = getPath(wiki.name);
  fs.readFile(wikiPath, 'utf8', (err, wiki) => {
    if (err) return next(err);
    res.json({ wiki });
  });
};

router.route('/')
  .get(getWikis);

router.route('/:wikiKey')
  .get(getWiki);

export default router;