const path = require('path');
const fs = require('fs');

const getPath = (...args) => path.resolve(__dirname, '..', 'algorithm', ...args);

const readCategories = () => {
  const createKey = name => name.toLowerCase().replace(/ /g, '-');
  const list = dirPath => fs.readdirSync(dirPath).filter(filename => !filename.startsWith('.'));
  const getCategory = categoryName => {
    const categoryKey = createKey(categoryName);
    const categoryPath = getPath(categoryName);
    const algorithms = list(categoryPath).map(algorithmName => getAlgorithm(categoryName, algorithmName));
    return {
      key: categoryKey,
      name: categoryName,
      algorithms,
    };
  };
  const getAlgorithm = (categoryName, algorithmName) => {
    const algorithmKey = createKey(algorithmName);
    const algorithmPath = getPath(categoryName, algorithmName);
    const files = list(algorithmPath);
    return {
      key: algorithmKey,
      name: algorithmName,
      files,
    }
  };
  return list(getPath()).map(getCategory);
};

const categories = readCategories();

categories.forEach(category => {
  console.error('===', category.name, '===');
  category.algorithms.forEach(algorithm => {
    const fileName = algorithm.files.find(file => file !== 'desc.json');
    const oldFilePath = getPath(category.name, algorithm.name, fileName);
    const oldCodePath = getPath(category.name, algorithm.name, fileName, 'code.js');
    const newCodePath = getPath(category.name, algorithm.name, 'code.js');
    //console.log(oldCodePath, ' ==> ', newCodePath);
    //fs.renameSync(oldCodePath, newCodePath);
    //fs.rmdirSync(oldFilePath);
  })
});

/*Object.values(hierarchy).forEach(({ name: categoryName, list }) => {
  Object.values(list).forEach(algorithmName => {
    const desc = require(path.resolve(algorithmPath, categoryName, algorithmName, 'desc.json'));
    Object.keys(desc.files).forEach(fileKey => {
      const fileName = fileKey.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
      const oldPath = path.resolve(algorithmPath, categoryName, algorithmName, fileKey);
      const newPath = path.resolve(algorithmPath, categoryName, algorithmName, fileName);
      //fs.renameSync(newPath, oldPath);
      console.log(oldPath, newPath);
    });
  });
});*/