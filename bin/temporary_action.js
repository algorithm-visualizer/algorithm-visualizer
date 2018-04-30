const path = require('path');
const fs = require('fs');

const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);
const latex = v => {
  return v.replace(/\$([^$]+)\$/g, (m, m1) => `<img src="https://latex.codecogs.com/svg.latex?${m1.replace(/ /g, '')}"/>`)
};

const categories = fs.readdirSync(path.resolve(__dirname, '..', 'algorithm'));
for (const category of categories) {
  if (category.startsWith('.')) continue;
  const algorithms = fs.readdirSync(path.resolve(__dirname, '..', 'algorithm', category));
  for (const algorithm of algorithms) {
    if (algorithm.startsWith('.')) continue;
    const dir = path.resolve(__dirname, '..', 'algorithm', category, algorithm);
    try {
      fs.renameSync(path.resolve(dir, 'desc.md'), path.resolve(dir, 'desc.json'));
//      fs.unlinkSync(path.resolve(dir, 'desc.json'));
    } catch (e) {
    }
  }
}