'use strict';

(function(module) {
  const repos = {};

  repos.all = [];

  repos.requestRepos = function(callback) {
    $.ajax({
      url: 'https://api.github.com/user/repos?typw=owner',
      method: 'GET',
      headers: {
        Authorization: `token ${githubToken}`
      }
    })
    .then(
      data => data.forEach(function(ele) {
        repos.all.push(ele);
      }))
      .then(callback);
  }

  repos.with = attr => repos.all.filter(repo => repo[attr]);

  module.repos = repos;
})(window);
