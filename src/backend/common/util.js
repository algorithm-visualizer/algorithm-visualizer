import Promise from 'bluebird';
import child_process from 'child_process';
import path from 'path';
import fs from 'fs-extra';
import removeMarkdown from 'remove-markdown';

const execute = (command, cwd, { stdout = process.stdout, stderr = process.stderr } = {}) => new Promise((resolve, reject) => {
  const child = child_process.exec(command, { cwd }, (error, stdout, stderr) => {
    if (error) return reject(error.code ? new Error(stderr) : error);
    resolve(stdout);
  });
  if (stdout) child.stdout.pipe(stdout);
  if (stderr) child.stderr.pipe(stderr);
});

const createKey = name => name.toLowerCase().trim().replace(/[^\w \-]/g, '').replace(/ /g, '-');

const isDirectory = dirPath => fs.lstatSync(dirPath).isDirectory();

const listFiles = dirPath => fs.readdirSync(dirPath).filter(fileName => !fileName.startsWith('.'));

const listDirectories = dirPath => listFiles(dirPath).filter(fileName => isDirectory(path.resolve(dirPath, fileName)));

const getDescription = files => {
  const readmeFile = files.find(file => file.name === 'README.md');
  if (!readmeFile) return '';
  const lines = readmeFile.content.split('\n');
  lines.shift();
  while (lines.length && !lines[0].trim()) lines.shift();
  let descriptionLines = [];
  while (lines.length && lines[0].trim()) descriptionLines.push(lines.shift());
  return removeMarkdown(descriptionLines.join(' '));
};

export {
  execute,
  createKey,
  isDirectory,
  listFiles,
  listDirectories,
  getDescription,
};
