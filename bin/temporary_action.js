const path = require('path');
const fs = require('fs');

const categories = fs.readdirSync(path.resolve(__dirname, '..', 'src', 'backend', 'public', 'algorithms'));
for (const category of categories) {
  if (category.startsWith('.')) continue;
  const algorithms = fs.readdirSync(path.resolve(__dirname, '..', 'src', 'backend', 'public', 'algorithms', category));
  for (const algorithm of algorithms) {
    if (algorithm.startsWith('.')) continue;
    const dir = path.resolve(__dirname, '..', 'src', 'backend', 'public', 'algorithms', category, algorithm);
    try {
      fs.renameSync(path.resolve(dir, 'desc.md'), path.resolve(dir, 'README.md'));
    } catch (e) {
    }
  }
}