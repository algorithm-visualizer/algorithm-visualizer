import express from 'express';
import { githubClientId } from '/environment';
import { GitHubApi } from '/apis';

const router = express.Router();

const request = (req, res, next) => {
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${githubClientId}&scope=user,gist`);
};

const response = (req, res, next) => {
  const { code } = req.query;

  GitHubApi.getAccessToken(code).then(({ access_token }) => {
    res.send(`<script>window.opener.signIn('${access_token}');window.close();</script>`);
  }).catch(next);
};

const destroy = (req, res, next) => {
  res.send(`<script>window.opener.signOut();window.close();</script>`);
};

router.route('/request')
  .get(request);

router.route('/response')
  .get(response);

router.route('/destroy')
  .get(destroy);

export default router;