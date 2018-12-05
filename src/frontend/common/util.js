import { README_MD } from '/skeletons';

const classes = (...arr) => arr.filter(v => v).join(' ');

const distance = (a, b) => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const extension = fileName => /(?:\.([^.]+))?$/.exec(fileName)[1];

const refineGist = gist => {
  const gistId = gist.id;
  const title = gist.description;
  delete gist.files['algorithm-visualizer'];
  const { login, avatar_url } = gist.owner;
  const files = Object.values(gist.files).map(file => ({
    name: file.filename,
    content: file.content,
    contributors: [{ login, avatar_url }],
  }));
  return { gistId, title, files, gist };
};

const getFiles = current => {
  const { algorithm, scratchPaper } = current;
  if (algorithm) return algorithm.files;
  if (scratchPaper) return scratchPaper.files;
  return [{
    name: 'README.md',
    content: README_MD,
    contributors: [{
      login: 'algorithm-visualizer',
      avatar_url: 'https://github.com/algorithm-visualizer.png',
    }],
  }];
};

const getTitleArray = current => {
  const { algorithm, scratchPaper } = current;
  if (algorithm) return [algorithm.categoryName, algorithm.algorithmName];
  if (scratchPaper) return ['Scratch Paper', scratchPaper.title];
  return ['Algorithm Visualizer'];
};

const handleError = function (error) {
  console.error(error);
  this.props.showErrorToast(error.message);
};

export {
  classes,
  distance,
  extension,
  refineGist,
  getFiles,
  getTitleArray,
  handleError,
};
