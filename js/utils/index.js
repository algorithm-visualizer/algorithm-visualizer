'use strict';

const isScratchPaper = (category, algorithm) => {
  return category === null && algorithm === 'scratch_paper';
};

const getAlgorithmDir = (category, algorithm) => {
  if (isScratchPaper(category, algorithm)) {
    return './algorithm/scratch_paper/';
  }
  return `./algorithm/${category}/${algorithm}/`;
};

const getFileDir = (category, algorithm, file) => {
  if (isScratchPaper(category, algorithm)) {
    return './algorithm/scratch_paper/';
  }

  return `./algorithm/${category}/${algorithm}/${file}/`;
};

module.exports = {
  isScratchPaper,
  getAlgorithmDir,
  getFileDir
};