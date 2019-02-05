const process = { env: { ALGORITHM_VISUALIZER: '1' } };
importScripts('https://unpkg.com/algorithm-visualizer@latest/dist/algorithm-visualizer.js');

const sandbox = code => {
  const require = name => ({ 'algorithm-visualizer': AlgorithmVisualizer }[name]); // fake require
  eval(code);
};

onmessage = e => {
  const lines = e.data.split('\n').map((line, i) => line.replace(/(.+\. *delay *)(\( *\))/g, `$1(${i})`));
  const code = lines.join('\n');
  sandbox(code);
  postMessage(AlgorithmVisualizer.Tracer.traces);
};
