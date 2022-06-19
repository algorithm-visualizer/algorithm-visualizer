import axios from "axios";

axios.interceptors.response.use((response) => response.data);

const request = (url, process) => {
  const tokens = url.split("/");
  const baseURL = /^https?:\/\//i.test(url) ? "" : "/api";
  return (...args) => {
    const mappedURL =
      baseURL +
      tokens
        .map((token, i) => (token.startsWith(":") ? args.shift() : token))
        .join("/");
    return Promise.resolve(process(mappedURL, args));
  };
};

const GET = (URL) => {
  return request(URL, (mappedURL, args) => {
    const [params, cancelToken] = args;
    return axios.get(mappedURL, { params, cancelToken });
  });
};

const DELETE = (URL) => {
  return request(URL, (mappedURL, args) => {
    const [params, cancelToken] = args;
    return axios.delete(mappedURL, { params, cancelToken });
  });
};

const POST = (URL) => {
  return request(URL, (mappedURL, args) => {
    const [body, params, cancelToken] = args;
    return axios.post(mappedURL, body, { params, cancelToken });
  });
};

const PATCH = (URL) => {
  return request(URL, (mappedURL, args) => {
    const [body, params, cancelToken] = args;
    return axios.patch(mappedURL, body, { params, cancelToken });
  });
};

const AlgorithmApi = {
  getAlgorithm: async (categoryKey, algorithmKey, files) => {
    const alg = {
      categoryKey: categoryKey,
      categoryName: categoryKey,
      algorithmKey: algorithmKey,
      algorithmName: algorithmKey,
      description: "",
      files: [],
    };
    for (const file of files) {
      const site = await fetch(
        `/algorithms/${categoryKey}/${algorithmKey}/${file}`
      );
      if (site.status !== 200) {
        throw new Error("Network Error");
      } else {
        alg.files.push({ name: file, content: await site.text() });
      }
    }
    return { algorithm: alg };
  },
};

const VisualizationApi = {
  getVisualization: GET("/visualizations/:visualizationId"),
};

const GitHubApi = {
  auth: (token) =>
    Promise.resolve(
      (axios.defaults.headers.common["Authorization"] =
        token && `token ${token}`)
    ),
  getUser: GET("https://api.github.com/user"),
  listGists: GET("https://api.github.com/gists"),
  createGist: POST("https://api.github.com/gists"),
  editGist: PATCH("https://api.github.com/gists/:id"),
  getGist: GET("https://api.github.com/gists/:id"),
  deleteGist: DELETE("https://api.github.com/gists/:id"),
  forkGist: POST("https://api.github.com/gists/:id/forks"),
};

export { AlgorithmApi, VisualizationApi, GitHubApi };
