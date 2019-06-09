const fs = require('fs');
const path = require('path');

const componentsDir = path.resolve(__dirname, 'src', 'core', 'renderers');

const components = fs.readdirSync(componentsDir);
for (const component of components) {
  if (!fs.statSync(path.resolve(componentsDir, component)).isDirectory()) continue;
  const newJs = path.resolve(componentsDir, component, 'index.js');
  fs.renameSync(path.resolve(componentsDir, component, 'index.jsx'), newJs);
  const content = fs.readFileSync(newJs, { encoding: 'utf8' });
  fs.writeFileSync(newJs, content.replace('stylesheet.module.scss', `${component}.module.scss`), { encoding: 'utf8' });
  if (fs.existsSync(path.resolve(componentsDir, component, 'stylesheet.module.scss'))) fs.renameSync(path.resolve(componentsDir, component, 'stylesheet.module.scss'), path.resolve(componentsDir, component, `${component}.module.scss`));
}
console.log(components);
