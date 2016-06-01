
const showLoadingSlider = () => {
  $('#loading-slider').removeClass('loaded');
};

const hideLoadingSlider = () => {
  $('#loading-slider').addClass('loaded');
};

module.exports = {
  showLoadingSlider,
  hideLoadingSlider
};
