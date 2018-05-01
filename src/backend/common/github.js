import GitHub from 'github-api';
import { githubBotAuth, githubOrg, githubRepo } from '/environment';

const gh = new GitHub(githubBotAuth);
const repo = gh.getRepo(githubOrg, githubRepo);

export {
  repo,
};