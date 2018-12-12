import Promise from 'bluebird';
import path from 'path';
import { execute, listDirectories } from '/common/util';
import { GitHubApi } from '/apis';
import { Category } from '/models';

class Hierarchy {
  constructor(path) {
    this.path = path;
    this.refresh();
  }

  refresh() {
    this.categories = listDirectories(this.path)
      .map(categoryName => new Category(path.resolve(this.path, categoryName), categoryName));

    const files = [];
    this.categories.forEach(category => category.algorithms.forEach(algorithm => files.push(...algorithm.files)));
    this.cacheCommitAuthors().then(commitAuthors => this.cacheContributors(files, commitAuthors));
  }

  cacheCommitAuthors(page = 1, commitAuthors = {}) {
    const per_page = 100;
    return GitHubApi.listCommits('algorithm-visualizer', 'algorithms', {
      per_page,
      page,
    }).then(commits => {
      commits.forEach(({ sha, commit, author }) => {
        if (!author) return;
        const { login, avatar_url } = author;
        commitAuthors[sha] = { login, avatar_url };
      });
      if (commits.length < per_page) {
        return commitAuthors;
      } else {
        return this.cacheCommitAuthors(page + 1, commitAuthors);
      }
    });
  }

  cacheContributors(files, commitAuthors) {
    return Promise.each(files, file => {
      return execute(`git --no-pager log --follow --no-merges --format="%H" "${file.path}"`, this.path, { stdout: null })
        .then(stdout => {
          const output = stdout.toString().replace(/\n$/, '');
          const shas = output.split('\n').reverse();
          const contributors = [];
          for (const sha of shas) {
            const author = commitAuthors[sha];
            if (author && !contributors.find(contributor => contributor.login === author.login)) {
              contributors.push(author);
            }
          }
          file.contributors = contributors;
        });
    });
  }

  find(categoryKey, algorithmKey) {
    const category = this.categories.find(category => category.key === categoryKey);
    if (!category) return;
    const algorithm = category.algorithms.find(algorithm => algorithm.key === algorithmKey);
    if (!algorithm) return;

    const categoryName = category.name;
    const algorithmName = algorithm.name;
    const files = algorithm.files;
    const description = algorithm.description;

    return { categoryKey, categoryName, algorithmKey, algorithmName, files, description };
  }

  iterate(callback) {
    this.categories.forEach(category => category.algorithms.forEach(algorithm => callback(category, algorithm)));
  }

  toJSON() {
    const { categories } = this;
    return { categories };
  }
}

export default Hierarchy;
