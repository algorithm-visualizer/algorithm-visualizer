'use strict';

const isScratchPaper = (category, algorithm) => {
  return category == 'scratch';
};

const getAlgorithmDir = (category, algorithm) => {
  if (isScratchPaper(category)) return './algorithm/scratch_paper/';
  return `./algorithm/${category}/${algorithm}/`;
};

const getFileDir = (category, algorithm, file) => {
  if (isScratchPaper(category)) return './algorithm/scratch_paper/';
  return `./algorithm/${category}/${algorithm}/${file}/`;
};

const renderMathJax = () =>{
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
};

module.exports = {
  isScratchPaper,
  getAlgorithmDir,
  getFileDir,
  renderMathJax
};
