const refineByType = (item) => {
  return typeof(item) === 'number' ? refineNumber(item) : refineString(item);
};

const refineString = (str) => {
  return str === '' ? ' ' : str;
};

const refineNumber = (num) => {
  return num === Infinity ? '∞' : num;
};

module.exports = refineByType;