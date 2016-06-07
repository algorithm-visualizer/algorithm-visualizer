'use strict';

const app = require('../app');
const createEditor = require('./create');
const Executor = require('./executor');
const TopMenu = require('../dom/top_menu');

function Editor(tracerManager) {
  if (!tracerManager) {
    throw 'Cannot create Editor. Missing the tracerManager';
  }

  ace.require('ace/ext/language_tools');
  const Range = ace.require("ace/range").Range;

  this.dataEditor = createEditor('data');
  this.codeEditor = createEditor('code');

  // Setting data

  this.setData = (data) => {
    this.dataEditor.setValue(data, -1);
  };

  this.setCode = (code) => {
    this.codeEditor.setValue(code, -1);
  };

  this.setContent = (({
    data,
    code
  }) => {
    this.setData(data);
    this.setCode(code);
  });

  // Clearing data

  this.clearData = () => {
    this.dataEditor.setValue('');
  };

  this.clearCode = () => {
    this.codeEditor.setValue('');
  };

  this.clearContent = () => {
    this.clearData();
    this.clearCode();
  };

  this.execute = () => {
    const data = this.dataEditor.getValue();
    const code = this.codeEditor.getValue();
    return Executor.executeDataAndCode(tracerManager, data, code);
  };

  this.highlightLine = (lineNumber) => {
    const session = this.codeEditor.getSession();
    if (this.marker) session.removeMarker(this.marker);
    this.marker = session.addMarker(new Range(lineNumber, 0, lineNumber, Infinity), "executing", "line", true);
  };

  this.unhighlightLine = () => {
    const session = this.codeEditor.getSession();
    if (this.marker) session.removeMarker(this.marker);
  };

  // listeners

  this.dataEditor.on('change', () => {
    const data = this.dataEditor.getValue();
    const lastFileUsed = app.getLastFileUsed();
    if (lastFileUsed) {
      app.updateCachedFile(lastFileUsed, {
        data
      });
    }
    Executor.executeData(tracerManager, data);
  });

  this.codeEditor.on('change', () => {
    const code = this.codeEditor.getValue();
    const lastFileUsed = app.getLastFileUsed();
    if (lastFileUsed) {
      app.updateCachedFile(lastFileUsed, {
        code
      });
    }
    tracerManager.reset();
    TopMenu.resetTopMenuButtons();
  });
}

module.exports = Editor;