const classes = (...arr) => arr.filter(v => v).join(' ');

const distance = (a, b) => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const extension = fileName => /(?:\.([^.]+))?$/.exec(fileName)[1];

const refineGist = gist => {
  const gistId = gist.id;
  const titles = ['Scratch Paper', gist.description];
  delete gist.files['algorithm-visualizer'];
  const { login, avatar_url } = gist.owner;
  const files = Object.values(gist.files).map(file => ({
    name: file.filename,
    content: file.content,
    contributors: [{ login, avatar_url }],
  }));
  return { gistId, titles, files };
};

export {
  classes,
  distance,
  extension,
  refineGist,
};