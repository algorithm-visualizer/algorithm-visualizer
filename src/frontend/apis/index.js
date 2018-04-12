import Promise from 'bluebird';
import axios from 'axios';

axios.interceptors.response.use(response => {
  return response.data;
}, error => {
  return Promise.reject(error.response.data);
});

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

const AlgorithmApi = {
  getCategories: GET('/algorithm/category.json'),
  getAlgorithm: GET('/algorithm/:category/:algorithm/desc.json'),
  getDataFile: GET('/algorithm/:category/:algorithm/:file/data.js'),
  getCodeFile: GET('/algorithm/:category/:algorithm/:file/code.js'),
};

const ScratchApi = {
  getScratch: GET('https://api.github.com/gists/:gist_id'),
};

const WikiApi = {
  getWiki: GET('/wiki/:wiki'),
};

export {
  AlgorithmApi,
  ScratchApi,
  WikiApi,
};