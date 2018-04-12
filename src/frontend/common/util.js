const classes = (...arr) => arr.filter(v => v).join(' ');

const calculatePercentageWidth = (element, x) => {
  const { offsetWidth, offsetLeft } = element;
  return ((x - offsetLeft) / offsetWidth * 100).toFixed(1) + '%';
};

const calculatePercentageHeight = (element, y) => {
  const { offsetHeight, offsetTop } = element;
  return ((y - offsetTop) / offsetHeight * 100).toFixed(1) + '%';
};

const serialize = object => JSON.parse(JSON.stringify(object));

const distance = (a, b) => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export {
  classes,
  calculatePercentageWidth,
  calculatePercentageHeight,
  serialize,
  distance,
};