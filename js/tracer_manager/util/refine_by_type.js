const refineByType = (item) => {
  switch (typeof(item)) {
    case 'number':
      return refineNumber(item);
    case 'boolean':
      return refineBoolean(item);
    default:
      return refineString(item);
  }
};

const refineString = (str) => {
  return str === '' ? ' ' : str;
};

const refineNumber = (num) => {
  return num === Infinity ? '∞' : num;
};

const refineBoolean = (bool) => {
  return bool ? 'T' : 'F';
};

module.exports = refineByType;