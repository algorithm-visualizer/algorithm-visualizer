'use strict';

const setupDividers = require('./setup_dividers');
const setupDocument = require('./setup_document');
const setupFilesBar = require('./setup_files_bar');
const setupInterval = require('./setup_interval');
const setupModuleContainer = require('./setup_module_container');
const setupTabContainer = require('./setup_tab_container');
const setupSideMenu = require('./setup_side_menu');
const setupTopMenu = require('./setup_top_menu');
const setupWindow = require('./setup_window');

/**
 * Initializes elements once the app loads in the DOM.
 */
const setup = () => {

  $('.btn input').click((e) => {
    e.stopPropagation();
  });

  // dividers
  setupDividers();

  // document
  setupDocument();

  // files bar
  setupFilesBar();

  // interval
  setupInterval();

  // module container
  setupModuleContainer();

  // tab container
  setupTabContainer();

  // side menu
  setupSideMenu();

  // top menu
  setupTopMenu();

  // window
  setupWindow();

};

module.exports = {
  setup
};
