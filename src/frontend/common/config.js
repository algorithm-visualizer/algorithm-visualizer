const languages = [{
  name: 'JavaScript',
  ext: 'js',
  mode: 'javascript',
}, {
  name: 'C++',
  ext: 'cpp',
  mode: 'c_cpp',
}, {
  name: 'Java',
  ext: 'java',
  mode: 'java',
}, {
  name: 'Python',
  ext: 'py',
  mode: 'python',
}];

const exts = languages.map(language => language.ext);

const us = {
  login: 'algorithm-visualizer',
  avatar_url: 'https://github.com/algorithm-visualizer.png',
};

export {
  languages,
  exts,
  us,
};
