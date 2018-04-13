const path = require('path');
const fs = require('fs');

const getPath = (...args) => path.resolve(__dirname, '..', 'algorithm', ...args);

const readCategories = () => {
  const createKey = name => name.toLowerCase().replace(/ /g, '-');
  const subdirectories = dirPath => fs.readdirSync(dirPath).filter(subdir => !subdir.startsWith('.'));
  const getCategory = categoryName => {
    const categoryPath = getPath(categoryName);
    const categoryKey = createKey(categoryName);
    const algorithms = subdirectories(categoryPath).map(algorithmName => getAlgorithm(categoryName, algorithmName));
    return {
      key: categoryKey,
      name: categoryName,
      algorithms,
    };
  };
  const getAlgorithm = (categoryName, algorithmName) => {
    const algorithmPath = getPath(categoryName, algorithmName);
    const algorithmKey = createKey(algorithmName);
    const files = subdirectories(algorithmPath).filter(fileName => fileName !== 'desc.json');
    return {
      key: algorithmKey,
      name: algorithmName,
      files,
    }
  };
  return subdirectories(getPath()).map(getCategory);
};

const categories = readCategories();

categories.forEach(category => {
  category.algorithms.forEach(algorithm => {
    algorithm.files.forEach(fileKey => {
      const fileName = ['basic', 'normal'].includes(fileKey) ? algorithm.name : fileKey.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
      const oldPath = getPath(category.name, algorithm.name, fileKey);
      const newPath = getPath(category.name, algorithm.name, fileName);
      //fs.renameSync(oldPath, newPath);
      console.log(oldPath + '->', newPath);
    })
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