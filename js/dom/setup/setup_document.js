const appInstance = require('../../app');

module.exports = () => {
  $(document).on('click', 'a', (e) => {
    e.preventDefault();

    if (!window.open($(this).attr('href'), '_blank')) {
      alert('Please allow popups for this site');
    }
  });

  $(document).mouseup(function(e) {
    appInstance.getTracerManager().command('mouseup', e);
  });
};