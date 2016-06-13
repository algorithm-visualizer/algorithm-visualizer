'use strict';

const execute = (tracerManager, code, dataLines) => {
  // all modules available to eval are obtained from window
  try {
    tracerManager.deallocateAll();
    const lines = code.split('\n');
    const newLines = [];
    lines.forEach((line, i) => {
      newLines.push(line.replace(/(.+\. *_wait *)(\( *\))/g, `$1(${i - dataLines})`));
    });
    eval(Babel.transform(newLines.join('\n'), {presets: ['es2015']}).code);
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
  const dataLines = algoData.split('\n').length;
  return execute(tracerManager, `${algoData}\n${algoCode}`, dataLines);
};

module.exports = {
  executeData,
  executeDataAndCode
};