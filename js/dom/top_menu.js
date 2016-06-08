'use strict';

const app = require('../app');

const flowControlBtns = [ $('#btn_pause'), $('#btn_prev'), $('#btn_next') ];
const setFlowControlState = (isDisabled) => {
  flowControlBtns.forEach($btn => $btn.attr('disabled', isDisabled));
};

const enableFlowControl = () => {
  setFlowControlState(false);
};

const disableFlowControl = () => {
  setFlowControlState(true);
};

const resetTopMenuButtons = () => {
  $('.top-menu-buttons button').removeClass('active');
  disableFlowControl();
  app.getEditor().unhighlightLine();
};

const setInterval = (val) => {
  $('#interval').val(interval);
};

const activateBtnPause = () => {
  $('#btn_pause').addClass('active');
};

const deactivateBtnPause = () => {
  $('#btn_pause').removeClass('active');
};

module.exports = {
  enableFlowControl,
  disableFlowControl,
  resetTopMenuButtons,
  setInterval,
  activateBtnPause,
  deactivateBtnPause
};
