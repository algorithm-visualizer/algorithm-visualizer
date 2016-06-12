'use strict';

module.exports = () => {
  let reqFunc = null;
  let extFunc = null;
  let reqFuncs = [
    'requestFullscreen',
    'webkitRequestFullscreen',
    'mozRequestFullScreen',
    'msRequestFullscreen',
  ];
  let extFuncs = [
    'exitFullscreen',
    'webkitExitFullscreen',
    'mozCancelFullScreen',
    'msExitFullscreen'
  ];

  for (let tmpReqFunc of reqFuncs) {
    if (document.body[tmpReqFunc]) {
      reqFunc = tmpReqFunc;
    }
  }

  for (let tmpExtFunc of extFuncs) {
    if (document[tmpExtFunc]) {
      extFunc = tmpExtFunc;
    }
  }

  const $btnFullscreen = $('#btn_fullscreen');

  $btnFullscreen.click(function () {
    if (document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen) {
      if (extFunc) document[extFunc]();
    } else {
      if (reqFunc) document.body[reqFunc]();
    }
  });
};