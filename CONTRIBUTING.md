# Contributing

> #### Table of Contents
> - [Running Locally](#running-locally)
> - [Running in Gitpod](#running-in-gitpod)
> - [Directory Structure](#directory-structure)

Are you a first-timer in contributing to open source? [These guidelines](https://opensource.guide/how-to-contribute/#how-to-submit-a-contribution) from GitHub might help!

## Running Locally

1. Fork this repository.

2. Clone your forked repo to your machine.

    ```bash
    git clone https://github.com/<your-username>/algorithm-visualizer.git    
    ```
    
3. Choose whether to run [`server`](https://github.com/algorithm-visualizer/server) on your machine or to use the remote server.
    - If you choose to run the server locally as well, follow the instructions [here](https://github.com/algorithm-visualizer/server/blob/master/CONTRIBUTING.md#running-locally).

    - If you choose to use the remote server, **temporarily** (i.e., don't commit this change) modify `package.json` as follows:
        ```diff
        - "proxy": "http://localhost:8080",
        + "proxy": "https://algorithm-visualizer.org",
        ```

4. Install dependencies, and run the web app.

    ```bash
    cd algorithm-visualizer

    npm install
    
    npm start
    ```
    
5. Open [`http://localhost:3000/`](http://localhost:3000/) in a web browser.

## Running in Gitpod

You can also run `algorithm-visualizer` in Gitpod, a free online dev environment for GitHub.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/algorithm-visualizer/algorithm-visualizer)

## Directory Structure

- [**branding/**](branding) contains representative image files.
- [**public/**](public) contains static files to be served.
- [**src/**](src) contains source code. 
    - [**apis/**](src/apis) defines outgoing API requests.
    - [**common/**](src/common) contains commonly used files.
    - [**components/**](src/components) contains UI components.
    - [**core/**](src/core) processes visualization.
        - [**layouts/**](src/core/layouts) layout tracers.
        - [**renderers/**](src/core/renderers) renders visualization data.
        - [**tracers/**](src/core/tracers) interprets visualizing commands into visualization data.
    - [**files/**](src/files) contains markdown or skeleton files to be shown in the code editor.
    - [**reducers/**](src/reducers) contains Redux reducers.
