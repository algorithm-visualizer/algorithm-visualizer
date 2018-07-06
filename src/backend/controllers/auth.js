import express from 'express';
import axios from 'axios';
import { githubClientId, githubClientSecret } from '/environment';

const router = express.Router();

const request = (req, res, next) => {
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${githubClientId}&scope=user,gist`);
};

const response = (req, res, next) => {
  const { code } = req.query;

  axios.post('https://github.com/login/oauth/access_token', {
    client_id: githubClientId,
    client_secret: githubClientSecret,
    code,
  }, {
    headers: { Accept: 'application/json' }
  }).then(response => {
    const { access_token } = response.data;
    res.cookie('access_token', access_token);
    res.redirect('/');
  }).catch(next);
};

const destroy = (req, res, next) => {
  res.clearCookie('access_token');
  res.redirect('/');
};

router.route('/request')
  .get(request);

router.route('/response')
  .get(response);

router.route('/destroy')
  .get(destroy);

export default router;