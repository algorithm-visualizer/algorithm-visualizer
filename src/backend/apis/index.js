import Promise from 'bluebird';
import axios from 'axios';
import fs from 'fs-extra';
import { githubClientId, githubClientSecret } from '/environment';

axios.interceptors.request.use(request => {
  request.params = { client_id: githubClientId, client_secret: githubClientSecret, ...request.params };
  return request;
});

axios.interceptors.response.use(response => {
  return response.data;
}, error => {
  return Promise.reject(error.response.data);
});

const request = (url, process) => {
  const tokens = url.split('/');
  const baseURL = /^https?:\/\//i.test(url) ? '' : 'https://api.github.com';
  return (...args) => {
    return new Promise((resolve, reject) => {
      const mappedURL = baseURL + tokens.map((token, i) => token.startsWith(':') ? args.shift() : token).join('/');
      return resolve(process(mappedURL, args));
    });
  };
};

const GET = URL => {
  return request(URL, (mappedURL, args) => {
    const [params] = args;
    return axios.get(mappedURL, { params });
  });
};

const DELETE = URL => {
  return request(URL, (mappedURL, args) => {
    const [params] = args;
    return axios.delete(mappedURL, { params });
  });
};

const POST = URL => {
  return request(URL, (mappedURL, args) => {
    const [body, params] = args;
    return axios.post(mappedURL, body, { params });
  });
};

const PUT = URL => {
  return request(URL, (mappedURL, args) => {
    const [body, params] = args;
    return axios.put(mappedURL, body, { params });
  });
};

const PATCH = URL => {
  return request(URL, (mappedURL, args) => {
    const [body, params] = args;
    return axios.patch(mappedURL, body, { params });
  });
};

const GitHubApi = {
  listCommits: GET('/repos/:owner/:repo/commits'),
  getAccessToken: code => axios.post('https://github.com/login/oauth/access_token', { code }, { headers: { Accept: 'application/json' } }),
  getLatestRelease: GET('/repos/:owner/:repo/releases/latest'),
  download: (url, path) => axios({
    method: 'get',
    url,
    responseType: 'stream',
  }).then(data => new Promise((resolve, reject) => {
    data.pipe(fs.createWriteStream(path));
    data.on('end', resolve);
    data.on('error', reject);
  })),
};

export {
  GitHubApi,
};