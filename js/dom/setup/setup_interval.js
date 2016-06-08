'use strict';

const app = require('../../app');
const Toast = require('../toast');

const {
  parseFloat
} = Number;

const minInterval = 0.1;
const maxInterval = 10;
const startInterval = 0.5;
const stepInterval = 0.1;

const normalize = (sec) => {


  let interval;
  let message;
  if (sec < minInterval) {
    interval = minInterval;
    message = `Interval of ${sec} seconds is too low. Setting to min allowed interval of ${minInterval} second(s).`;
  } else if (sec > maxInterval) {
    interval = maxInterval;
    message = `Interval of ${sec} seconds is too high. Setting to max allowed interval of ${maxInterval} second(s).`;
  } else {
    interval = sec;
    message = `Interval has been set to ${sec} second(s).`
  }

  return [interval, message];
};

module.exports = () => {

  const $interval = $('#interval');
  $interval.val(startInterval);
  $interval.attr({
    max: maxInterval,
    min: minInterval,
    step: stepInterval
  });

  $('#interval').on('change', function() {
    const tracerManager = app.getTracerManager();
    const [seconds, message] = normalize(parseFloat($(this).val()));

    $(this).val(seconds);
    tracerManager.interval = seconds * 1000;
    Toast.showInfoToast(message);
  });
};
