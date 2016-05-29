'use strict';

const showToast = (data, type) => {
  const $toast = $(`<div class="toast ${type}">`).append(data);

  $('.toast_container').append($toast);
  setTimeout(() => {
    $toast.fadeOut(() => {
      $toast.remove();
    });
  }, 3000);
};

const showErrorToast = (err) => {
  showToast(err, 'error');
};

const showInfoToast = (err) => {
  showToast(err, 'info');
};

module.exports = {
  showErrorToast,
  showInfoToast
};