'use strict';

const execute = (tracerManager, code) => {
  // all modules available to eval are obtained from window
  try {
    tracerManager.deallocateAll();
    eval(code);
    tracerManager.visualize();
  } catch (err) {
    return err;
  } finally {
    tracerManager.removeUnallocated();
  }
};

const executeData = (tracerManager, algoData) => {
  return execute(tracerManager, algoData);
};

const executeDataAndCode = (tracerManager, algoData, algoCode) => {
  return execute(tracerManager, `${algoData};${algoCode}`);
};

module.exports = {
  executeData,
  executeDataAndCode
};