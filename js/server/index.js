'use strict';

const loadAlgorithm = require('./load_algorithm');
const loadCategories = require('./load_categories');
const loadFile = require('./load_file');
const loadScratchPaper = require('./load_scratch_paper');
const shareScratchPaper = require('./share_scratch_paper');

module.exports = {
  loadAlgorithm,
  loadCategories,
  loadFile,
  loadScratchPaper,
  shareScratchPaper
};