const path = require('path');
const fs = require('fs');
const lebab = require('lebab');

const categories = fs.readdirSync(path.resolve(__dirname, '..', 'algorithm'));
for (const category of categories) {
  if (category.startsWith('.')) continue;
  const algorithms = fs.readdirSync(path.resolve(__dirname, '..', 'algorithm', category));
  for (const algorithm of algorithms) {
    if (algorithm.startsWith('.')) continue;
    const filepath = path.resolve(__dirname, '..', 'algorithm', category, algorithm, 'code.js');
    const oldCode = fs.readFileSync(filepath, 'utf-8');
    try {
      const { code: newCode, warnings } = lebab.transform(oldCode, ['let', 'arrow', 'multi-var', 'template', 'default-param', 'includes']);
//      fs.writeFileSync(filepath, newCode, 'utf-8');
    } catch (e) {
      console.log(filepath);
      console.error(e);
    }
  }
}