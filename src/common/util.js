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
  return { login, gistId, title, files };
};

const createFile = (name, content, contributors) => ({ name, content, contributors });

const createProjectFile = (name, content) => createFile(name, content, [{
  login: 'algorithm-visualizer',
  avatar_url: 'https://github.com/algorithm-visualizer.png',
}]);

const createUserFile = (name, content) => createFile(name, content, undefined);

const isSaved = ({ titles, files, lastTitles, lastFiles }) => {
  const serialize = (titles, files) => JSON.stringify({
    titles,
    files: files.map(({ name, content }) => ({ name, content })),
  });
  return serialize(titles, files) === serialize(lastTitles, lastFiles);
};

export {
  classes,
  distance,
  extension,
  refineGist,
  createFile,
  createProjectFile,
  createUserFile,
  isSaved,
};
