import { Hierarchy } from '/models';
import path from 'path';

const repoPath = path.resolve(__dirname, '..', 'public', 'algorithms');
const hierarchy = new Hierarchy(repoPath);

export default hierarchy;
