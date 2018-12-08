import Promise from 'bluebird';
import child_process from 'child_process';
import path from 'path';
import fs from 'fs-extra';

const execute = (command, cwd, { stdout = process.stdout, stderr = process.stderr } = {}) => new Promise((resolve, reject) => {
  if (!cwd) return reject(new Error('CWD Not Specified'));
  const child = child_process.exec(command, { cwd }, (error, stdout, stderr) => {
    if (error) return reject(error.code ? new Error(stderr) : error);
    resolve(stdout);
  });
  if (stdout) child.stdout.pipe(stdout);
  if (stderr) child.stderr.pipe(stderr);
});

const spawn = (command, args, cwd, { stdout = process.stdout, stderr = process.stderr } = {}) => new Promise((resolve, reject) => {
  if (!cwd) return reject(new Error('CWD Not Specified'));
  const child = child_process.spawn(command, args, { cwd });
  child.on('close', code => code ? reject(new Error(`Process exited with code: ${code}`)) : resolve());
  if (stdout) child.stdout.pipe(stdout);
  if (stderr) child.stderr.pipe(stderr);
});

const createKey = name => name.toLowerCase().replace(/ /g, '-');

const isDirectory = dirPath => fs.lstatSync(dirPath).isDirectory();

const listFiles = dirPath => fs.readdirSync(dirPath).filter(fileName => !fileName.startsWith('.'));

const listDirectories = dirPath => listFiles(dirPath).filter(fileName => isDirectory(path.resolve(dirPath, fileName)));

export {
  execute,
  spawn,
  createKey,
  isDirectory,
  listFiles,
  listDirectories,
};
