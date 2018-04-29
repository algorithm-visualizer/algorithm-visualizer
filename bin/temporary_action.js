const path = require('path');
const fs = require('fs');

const categories = fs.readdirSync(path.resolve(__dirname, '..', 'algorithm'));
for (const category of categories) {
  if (category.startsWith('.')) continue;
  const algorithms = fs.readdirSync(path.resolve(__dirname, '..', 'algorithm', category));
  for (const algorithm of algorithms) {
    if (algorithm.startsWith('.')) continue;
    const filepath = path.resolve(__dirname, '..', 'algorithm', category, algorithm, 'code.js');
    const code = fs.readFileSync(filepath, 'utf-8');
    const newCode = code.replace(/([a-z])_([a-z])/g, (m, m1, m2) => m1 + m2.toUpperCase());
    fs.writeFileSync(filepath, newCode, 'utf-8');
  }
}