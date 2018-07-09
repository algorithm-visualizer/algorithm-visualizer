const classes = (...arr) => arr.filter(v => v).join(' ');

const distance = (a, b) => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const extension = fileName => /(?:\.([^.]+))?$/.exec(fileName)[1];

export {
  classes,
  distance,
  extension,
};