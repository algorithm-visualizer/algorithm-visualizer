const Server = require('../../server');
const showAlgorithm = require('../show_algorithm');

module.exports = () => {
  $('#scratch-paper').click(function() {
    const category = null;
    const algorithm = 'scratch_paper';
    Server.loadAlgorithm(category, algorithm).then((data) => {
      showAlgorithm(category, algorithm, data);
    });
  });
};