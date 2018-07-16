import Promise from 'bluebird';
import axios from 'axios';

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
  auth: (client_id, client_secret) => axios.defaults.params = { client_id, client_secret },
  listCommits: GET('/repos/:owner/:repo/commits'),
  getAccessToken: code => axios.post('https://github.com/login/oauth/access_token', { code }, { headers: { Accept: 'application/json' } }),
};

export {
  GitHubApi,
};