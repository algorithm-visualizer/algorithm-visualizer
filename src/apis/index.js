import Promise from "bluebird";
import axios from "axios";
import * as AlgorithmVisualizer from "../common/AlgorithmVisualizer";

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

const PUT = (URL) => {
  return request(URL, (mappedURL, args) => {
    const [body, params, cancelToken] = args;
    return axios.put(mappedURL, body, { params, cancelToken });
  });
};

const PATCH = (URL) => {
  return request(URL, (mappedURL, args) => {
    const [body, params, cancelToken] = args;
    return axios.patch(mappedURL, body, { params, cancelToken });
  });
};

const AlgorithmApi = {
  getCategories: GET("/algorithms"),
  getAlgorithm: GET("/algorithms/:categoryKey/:algorithmKey"),
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

const TracerApi = {
  md: ({ code }) =>
    Promise.resolve([
      {
        key: "markdown",
        method: "MarkdownTracer",
        args: ["Markdown"],
      },
      {
        key: "markdown",
        method: "set",
        args: [code],
      },
      {
        key: null,
        method: "setRoot",
        args: ["markdown"],
      },
    ]),
  json: ({ code }) => new Promise((resolve) => resolve(JSON.parse(code))),
  js: ({ code }, params, cancelToken) =>
    new Promise((resolve, reject) => {
      const lines = code
        .split("\n")
        .map((line, i) => line.replace(/(\.\s*delay\s*)\(\s*\)/g, `$1(${i})`));
      code = lines.join("\n");
      const process = { env: { ALGORITHM_VISUALIZER: "1" } };
      const require = (name) =>
        ({ "algorithm-visualizer": AlgorithmVisualizer }[name]); // fake require
      eval(code);
      resolve(AlgorithmVisualizer.Commander.commands);
    }),
  cpp: POST("/tracers/cpp"),
  java: POST("/tracers/java"),
};

export { AlgorithmApi, VisualizationApi, GitHubApi, TracerApi };
