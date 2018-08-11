import Promise from 'bluebird';
import axios from 'axios';

axios.interceptors.response.use(
  response => response.data,
  error => {
    const { data } = error.response;
    const message = typeof data === 'string' ? data : JSON.stringify(data);
    return Promise.reject(new Error(message));
  },
);

const request = (url, process) => {
  const tokens = url.split('/');
  const baseURL = /^https?:\/\//i.test(url) ? '' : '/api';
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

const CategoryApi = {
  getCategories: GET('/categories'),
  getAlgorithm: GET('/categories/:categoryKey/:algorithmKey'),
};

const GitHubApi = {
  auth: token => Promise.resolve(axios.defaults.headers.common['Authorization'] = token && `token ${token}`),
  getUser: GET('https://api.github.com/user'),
  listGists: GET('https://api.github.com/gists'),
  createGist: POST('https://api.github.com/gists'),
  editGist: PATCH('https://api.github.com/gists/:id'),
  getGist: GET('https://api.github.com/gists/:id'),
  deleteGist: DELETE('https://api.github.com/gists/:id'),
  forkGist: POST('https://api.github.com/gists/:id/forks'),
};

let jsWorker = null;
const TracerApi = {
  md: ({ code }) => Promise.resolve([{
    tracerKey: '0-MarkdownTracer-Markdown',
    method: 'construct',
    args: ['MarkdownTracer', 'Markdown'],
  }, {
    tracerKey: '0-MarkdownTracer-Markdown',
    method: 'set',
    args: [code],
  }]),
  js: ({ code }) => new Promise((resolve, reject) => {
    if (jsWorker) jsWorker.terminate();
    jsWorker = new Worker('/api/tracers/js');
    jsWorker.onmessage = e => resolve(e.data);
    jsWorker.onerror = reject;
    jsWorker.postMessage(code);
  }),
  cpp: POST('/tracers/cpp'),
  java: POST('/tracers/java'),
};

export {
  CategoryApi,
  GitHubApi,
  TracerApi,
};
