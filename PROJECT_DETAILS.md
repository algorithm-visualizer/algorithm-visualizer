# Project Details

> #### Table of Contents
> - [Project Structure](#project-structure)
> - [Directory Structures](#directory-structures)
>   - [algorithms](#algorithms)
>   - [tracers](#tracers)
>   - [algorithm-visualizer](#algorithm-visualizer)

## Project Structure

The project [Algorithm Visualizer](https://github.com/algorithm-visualizer) consists of the following three repositories.

- [`algorithms`](https://github.com/algorithm-visualizer/algorithms) contains public algorithms shown on the sidebar.

- [`tracers`](https://github.com/algorithm-visualizer/tracers) builds visualization libraries for each supported language based on the specifications, and executes users' codes to extract visualization data.

- [`algorithm-visualizer`](https://github.com/algorithm-visualizer/algorithm-visualizer) contains the frontend server written in React and the backend server written in Node.

## Directory Structures

### algorithms

- **Category A/** is the name of the category.
    - **Algorithm A/** is the name of the algorithm.
        - **code.cpp** is the implementation of the algorithm in C++.
        - **code.java** is the implementation of the algorithm in Java.
        - **code.js** is the implementation of the algorithm in ECMAScript.
        - **README.md** is the description of the algorithm.
    - **Algorithm B/**
    - **Algorithm C/**
    - ...
- **Category B/**
- **Category C/**
- ...

### tracers

- **bin/** is where executables are written to.
- **docs/** is where library documentations are written to.
- **src/** contains source codes.
    - **common/** contains commonly used files.
    - **executables/** contains the source codes of executables.
    - **languages/** builds visualization libraries and defines how to execute users' codes for ...
        - **cpp/** ... C++.
            - **builder/** builds a visualization library based on the specifications.
                - **skeleton/** provides the skeleton of the visualization library.
            - **executor/** defines how to execute users' codes.
        - **java/** ... Java.
        - **js/** ... ECMAScript.
    - **specs/** defines the specifications.
        - **randomizers/** contains the specifications of randomizers.
        - **tracers/** contains the specifications of tracers.
        
**NOTE** that for ECMAScript, it builds a web worker rather than a visualization library. Once browsers fetch the web worker, they will submit users' codes to the web worker locally, instead of submitting to the remote backend server, to extract visualization data. It not only enables browsers to visualize ECMAScript codes quickly, but also significantly reduces the load on the backend server.

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
        - **public/** is where the backend server writes to.
            - **algorithms/** is cloned [`algorithms`](https://github.com/algorithm-visualizer/algorithms) repo.
            - **codes/** is where users' codes are uploaded to
            - **tracers/** is cloned [`tracers`](https://github.com/algorithm-visualizer/tracers) repo.
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
