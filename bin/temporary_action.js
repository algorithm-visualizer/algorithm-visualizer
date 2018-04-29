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
    const tracers = [
      'Array1DTracer',
      'Array2DTracer',
      'ChartTracer',
      'GraphTracer',
      'LogTracer',
      'Randomize',
      'Tracer',
    ];
    const used = tracers.filter(tracer => code.includes(tracer));
    const importLine = `import { ${used.join(', ')} } from 'algorithm-visualizer';\n\n`;
    const newCode = importLine + code;
    fs.writeFileSync(filepath, newCode, 'utf-8');
  }
}