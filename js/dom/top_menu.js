'use strict';

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
};

module.exports = {
  enableFlowControl,
  disableFlowControl,
  resetTopMenuButtons
};
