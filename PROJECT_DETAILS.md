# Project Details

> #### Table of Contents
> - [Project Structure](#project-structure)
> - [Directory Structures](#directory-structures)
>   - [algorithm-visualizer](#algorithm-visualizer)
>   - [algorithms](#algorithms)

## Project Structure

The project [Algorithm Visualizer](https://github.com/algorithm-visualizer) consists of the following repositories.

- [`algorithm-visualizer`](https://github.com/algorithm-visualizer/algorithm-visualizer) contains the frontend server written in React and the backend server written in Node.

- [`algorithms`](https://github.com/algorithm-visualizer/algorithms) contains public algorithms shown on the sidebar.

- [`tracers.js`](https://github.com/algorithm-visualizer/tracers.js) is a visualization library for JavaScript.

- [`tracers.cpp`](https://github.com/algorithm-visualizer/tracers.cpp) is a visualization library for C++.

- [`tracers.java`](https://github.com/algorithm-visualizer/tracers.java) is a visualization library for Java.

## Directory Structures

### algorithms

- **Category A/** is the name of the category.
    - **Algorithm A/** is the name of the algorithm.
        - **code.js** is the implementation of the algorithm in JavaScript.
        - **code.cpp** is the implementation of the algorithm in C++.
        - **code.java** is the implementation of the algorithm in Java.
        - **README.md** is the description of the algorithm.
    - **Algorithm B/**
    - **Algorithm C/**
    - ...
- **Category B/**
- **Category C/**
- ...

### algorithm-visualizer

- **app/** wraps the backend and frontend servers.
- **bin/** contains executables.
- **branding/** contains representative image files.
- **build/** is where compiled files are written to.
    - **backend/** contains the compiled backend server.
    - **frontend/** contains the compiled frontend server.
- **src/** contains source codes.
    - **backend/** contains the source code of the backend server.
        - **apis/** defines outgoing API requests.
        - **common/** contains commonly used files.
        - **controllers/** routes and processes incoming requests.
        - **models/** manages the algorithm data.
        - **public/** is where the backend server writes to.
            - **algorithms/** is a cloned [`algorithms`](https://github.com/algorithm-visualizer/algorithms) repo.
            - **codes/** is where users' codes are uploaded to.
        - **tracers/** builds a web worker and docker images that compile and run users' codes. 
    - **frontend/** contains the source code of the frontend server.
        - **apis/** defines outgoing API requests.
        - **common/** contains commonly used files.
        - **components/** defines React components.
        - **core/** is in charge of visualization.
            - **datas/** manages visualization data.
            - **renderers/** renders visualization data.
        - **reducers/** contains Redux reducers.
        - **skeletons/** contains skeleton files to be shown in the code editor.
        - **static/** contains static files to be served.

**NOTE** that for JavaScript, it builds a web worker rather than a docker image. Once browsers fetch the web worker, they will submit users' codes to the web worker locally, instead of submitting to the remote backend server, to extract visualization data. It not only enables browsers to visualize JavaScript codes quickly, but also reduces the load on the backend server.
