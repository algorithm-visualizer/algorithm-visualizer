const createProjectFile = filePath => ({
  name: filePath.split('/').pop(),
  content: require('raw-loader!./' + filePath),
  contributors: [{
    login: 'algorithm-visualizer',
    avatar_url: 'https://github.com/algorithm-visualizer.png',
  }],
});

const createUserFile = filePath => ({
  name: filePath.split('/').pop(),
  content: require('raw-loader!./' + filePath),
  contributors: undefined,
});

export const CODE_CPP = createUserFile('skeletons/code.cpp');
export const CODE_JAVA = createUserFile('skeletons/code.java');
export const CODE_JS = createUserFile('skeletons/code.js');
export const README_MD = createProjectFile('algorithm-visualizer/README.md');
export const CONTRIBUTING_MD = createProjectFile('scratch-paper/CONTRIBUTING.md');
