# Algorithm Visualizer

> Algorithm Visualizer is an interactive online platform that visualizes algorithms from code.

[![GitHub contributors](https://img.shields.io/github/contributors/algorithm-visualizer/algorithm-visualizer.svg?style=flat-square)](https://github.com/algorithm-visualizer/algorithm-visualizer/graphs/contributors)
[![GitHub license](https://img.shields.io/github/license/algorithm-visualizer/algorithm-visualizer.svg?style=flat-square)](https://github.com/algorithm-visualizer/algorithm-visualizer/blob/master/LICENSE)

Learning an algorithm gets much easier with visualizing it. Don't get what we mean? Check it out:

[**algorithm-visualizer.org**![Screenshot](https://raw.githubusercontent.com/algorithm-visualizer/algorithm-visualizer/master/branding/screenshot.png)](https://algorithm-visualizer.org/)

## Contributing

We have multiple repositories under the hood that comprise the website. Take a look at the contributing guidelines in the repository you want to contribute to.

- [**`algorithm-visualizer`**](https://github.com/algorithm-visualizer/algorithm-visualizer) is a web app written in React. It not only contains UI components but also interprets visualizing commands into actual visualizations.

- [**`server`**](https://github.com/algorithm-visualizer/server) serves the web app and provides APIs that it needs on the fly. (e.g., GitHub sign in, compiling/running code, etc.)

- [**`algorithms`**](https://github.com/algorithm-visualizer/algorithms) contains public algorithms shown on the side menu of the website.

- [**`tracers.*`**](https://github.com/search?q=org%3Aalgorithm-visualizer+tracers.&type=Repositories) are visualization libaries written in each supported language. The only thing they do is to extract visualizing commands from code.
