const app = require('../../app');

module.exports = () => {
  $(document).on('click', 'a', function (e) {
    e.preventDefault();
    if (!window.open($(this).attr('href'), '_blank')) {
      alert('Please allow popups for this site');
    }
  });

  $(document).mouseup(function (e) {
    app.getTracerManager().command('mouseup', e);
  });
};