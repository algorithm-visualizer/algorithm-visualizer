# Contributing

> #### Table of Contents
> - [Running Locally](#running-locally)
> - [Creating a Pull Request](#creating-a-pull-request)

## Running Locally

1. Fork the main repo.

2. Clone your forked repo to your machine.

    ```bash
    git clone https://github.com/<your-username>/algorithm-visualizer.git    
    ```

3. Install [Docker](https://docs.docker.com/install/), if not already installed.

4. Install dependencies, and run the server.

    ```bash
    cd algorithm-visualizer

    npm install
    
    npm run dev
    ```
    
5. Open [`http://localhost:8080/`](http://localhost:8080/) in a web browser.

## Creating a Pull Request
  
6. Create a branch addressing the issue/improvement you'd like to tackle.

    ```bash
    git checkout -b my-problem-fixer-branch
    ```

7. Write some awesome code.

8. Commit the changes, and push them to `my-problem-fixer-branch` branch on your forked repo.

    ```bash
    git add .
    
    git commit -m "Explain my awesome changes"

    git push origin my-problem-fixer-branch
    ```

9. Create a pull request from `my-problem-fixer-branch` branch on your forked repo to `master` branch on the main repo.
