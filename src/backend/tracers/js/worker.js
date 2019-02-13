const process = { env: { ALGORITHM_VISUALIZER: '1' } };
importScripts('/api/tracers/js');

const sandbox = code => {
  const require = name => ({ 'algorithm-visualizer': AlgorithmVisualizer }[name]); // fake require
  eval(code);
};

onmessage = e => {
  const lines = e.data.split('\n').map((line, i) => line.replace(/(\.\s*delay\s*)\(\s*\)/g, `$1(${i})`));
  const code = lines.join('\n');
  sandbox(code);
  postMessage(AlgorithmVisualizer.Commander.commands);
};
