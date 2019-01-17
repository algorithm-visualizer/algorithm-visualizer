const process = { env: { ALGORITHM_VISUALIZER: '1' } };
importScripts('https://unpkg.com/algorithm-visualizer/dist/algorithm-visualizer.js');
importScripts('https://unpkg.com/babel-standalone@6/babel.min.js');

const sandbox = code => {
  const require = name => ({ 'algorithm-visualizer': AlgorithmVisualizer }[name]); // fake require
  eval(code);
};

onmessage = e => { // TODO: stop after the first delay() on the initial run
  const lines = e.data.split('\n').map((line, i) => line.replace(/(.+\. *delay *)(\( *\))/g, `$1(${i})`));
  const { code } = Babel.transform(lines.join('\n'), { presets: ['es2015'] });
  sandbox(code);
  postMessage(AlgorithmVisualizer.Tracer.traces);
};
