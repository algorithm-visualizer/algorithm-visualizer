const stepLimit = 1e6; // TODO: limit number of traces

const languages = [{
  name: 'JavaScript',
  ext: 'js',
}, {
  name: 'C++',
  ext: 'cpp',
}, {
  name: 'Java',
  ext: 'java',
}, {
  name: 'Python',
  ext: 'py',
}];
const exts = languages.map(language => language.ext);

export {
  stepLimit,
  languages,
  exts,
};
