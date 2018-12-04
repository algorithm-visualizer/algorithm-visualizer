import GithubWebHook from 'express-github-webhook';
import { githubWebhookSecret } from '/environment';

const webhook = GithubWebHook({ path: '/', secret: githubWebhookSecret });

export default webhook;
