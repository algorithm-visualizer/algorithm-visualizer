import Promise from 'bluebird';
import child_process from 'child_process';

const execute = (command, cwd, { stdout = process.stdout, stderr = process.stderr } = {}) => new Promise((resolve, reject) => {
  if (!cwd) return reject(new Error('CWD Not Specified'));
  const child = child_process.exec(command, { cwd }, (error, stdout, stderr) => {
    if (error) return reject(new Error(stderr));
    resolve(stdout);
  });
  if (stdout) child.stdout.pipe(stdout);
  if (stderr) child.stderr.pipe(stderr);
});

export {
  execute,
};