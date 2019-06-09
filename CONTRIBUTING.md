# Contributing

> #### Table of Contents
> - [Running Locally](#running-locally)
> - [Directory Structure](#directory-structure)

Are you a first-timer in contributing to open source? [These guidelines](https://opensource.guide/how-to-contribute/#how-to-submit-a-contribution) from GitHub might help!

## Running Locally

1. Fork this repository.

2. Clone your forked repo to your machine.

    ```bash
    git clone https://github.com/<your-username>/algorithm-visualizer.git    
    ```

3. Install dependencies, and run the web app.

    ```bash
    cd algorithm-visualizer

    npm install
    
    npm start
    ```
    
4. Open [`http://localhost:3000/`](http://localhost:3000/) in a web browser.

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
