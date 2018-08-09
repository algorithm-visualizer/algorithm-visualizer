import { CODE_JS, CODE_JAVA, CODE_CPP } from '/skeletons';

const languages = [{
  name: 'JavaScript',
  ext: 'js',
  mode: 'javascript',
  skeleton: CODE_JS,
}, {
  name: 'C++',
  ext: 'cpp',
  mode: 'c_cpp',
  skeleton: CODE_CPP,
}, {
  name: 'Java',
  ext: 'java',
  mode: 'java',
  skeleton: CODE_JAVA,
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
