**NOTE**: Check out [**Project Details**](Project-Details) before running it locally!

To add changes and improvements or resolve issues, these are the usual steps:

1. Fork the project on Github then clone it to your machine:
  
  ```bash
  git clone https://github.com/<your-username>/AlgorithmVisualizer # clone your forked repo
  cd AlgorithmVisualizer                                           # navigate inside the created directory
  git submodule init                                               # initialize wiki submodule
  git submodule update                                             # setup wiki submodule updates
  ```
2. Your fork's remote repository should be named `origin` by default, so add the main repository as a remote as well and give it a name to distinguish it from your fork (something like `main` would work):

  ```bash
  git remote add main https://github.com/parkjs814/AlgorithmVisualizer
  ```

3. Create a branch addressing the issue/improvement you'd like to tackle.

  ```bash
  git checkout -b my-problem-fixer-branch
  ```

4. Make your changes and push to `my-problem-fixer-branch` on your repo

  ```bash
  # write some awesome code and then ...
  git add .
  git commit -m "Explain my awesome changes"
  git push origin my-problem-fixer-branch
  ```

5. Next create a pull request from `my-problem-fixer-branch` branch on `origin` to `master` branch on `main`.

6. Once approved, just delete `my-problem-fixer-branch` both locally and remotely because it's not needed anymore.

7. Finally, checkout `master` locally, pull the approved changes from the `main` repo, and push them to your `origin` repo:

  ```bash
  git checkout master  # checkout master locally
  git pull main master # pull new changes from main repository
  git push main master # push the changes to your fork
  ```

That's it, everything should be in sync now.

If you run into problems, feel free to [ask us for help on gitter](https://gitter.im/parkjs814/AlgorithmVisualizer?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

As mentioned, check out [**Project Details**](Project-Details) for more information on how to run the project.