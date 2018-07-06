const stepLimit = 1e6; // TODO: limit number of traces

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

export {
  stepLimit,
  languages,
  exts,
};
