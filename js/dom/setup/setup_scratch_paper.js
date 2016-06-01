const app = require('../../app');
const Server = require('../../server');
const showAlgorithm = require('../show_algorithm');

module.exports = () => {
  $('#scratch-paper').click(function() {
    const category = 'scratch';
    const algorithm = app.getLoadedScratch();
    Server.loadAlgorithm(category, algorithm).then((data) => {
      showAlgorithm(category, algorithm, data);
    });
  });
};