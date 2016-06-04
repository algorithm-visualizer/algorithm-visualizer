'use strict';

const app = require('../../app');
const Server = require('../../server');
const Toast = require('../toast');
const TopMenu = require('../top_menu');

module.exports = () => {

  // shared
  $('#shared').mouseup(function() {
    $(this).select();
  });

  $('#btn_share').click(function() {

    const $icon = $(this).find('.fa-share');
    $icon.addClass('fa-spin fa-spin-faster');

    Server.shareScratchPaper().then((url) => {
      $icon.removeClass('fa-spin fa-spin-faster');
      $('#shared').removeClass('collapse');
      $('#shared').val(url);
      Toast.showInfoToast('Shareable link is created.');
    });
  });

  // control

  const $btnRun   = $('#btn_run');
  const $btnTrace = $('#btn_trace');
  const $btnPause = $('#btn_pause');
  const $btnPrev  = $('#btn_prev');
  const $btnNext  = $('#btn_next');
  const $btnDesc  = $('#btn_desc');

  // initially, control buttons are disabled
  TopMenu.disableFlowControl();

  $btnRun.click(() => {
    $btnTrace.click();
    $btnPause.removeClass('active');
    $btnRun.addClass('active');
    TopMenu.enableFlowControl();
    var err = app.getEditor().execute();
    if (err) {
      console.error(err);
      Toast.showErrorToast(err);
    }
  });

  $btnPause.click(() => {
    $btnRun.toggleClass('active');
    $btnPause.toggleClass('active');
    if (app.getTracerManager().isPause()) {
      app.getTracerManager().resumeStep();
    } else {
      app.getTracerManager().pauseStep();
    }
  });

  $btnPrev.click(() => {
    $btnRun.removeClass('active');
    $btnPause.addClass('active');
    app.getTracerManager().pauseStep();
    app.getTracerManager().prevStep();
  });

  $btnNext.click(() => {
    $btnRun.removeClass('active');
    $btnPause.addClass('active');
    app.getTracerManager().pauseStep();
    app.getTracerManager().nextStep();
  });

  // description & trace

  $btnDesc.click(() => {
    $('.tab_container > .tab').removeClass('active');
    $('#tab_desc').addClass('active');
    $('.tab_bar > button').removeClass('active');
    $btnDesc.addClass('active');
  });

  $btnTrace.click(() => {
    $('.tab_container > .tab').removeClass('active');
    $('#tab_module').addClass('active');
    $('.tab_bar > button').removeClass('active');
    $btnTrace.addClass('active');
  });

};
