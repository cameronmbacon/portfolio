'use strict';

(function(module) {
  // Refactored my constructor function
  function Project(opts) {
    Object.keys(opts).forEach(e => this[e] = opts[e]);
  }

  Project.all = [];

  Project.prototype.toHtml = function() {
    let template = Handlebars.compile($('#project-template').text());

    this.daysAgo = parseInt((new Date() - new Date(this.lastUpdated))/60/60/24/1000);
    this.updateStatus = this.lastUpdated ? `updated ${this.daysAgo} days ago` : '(NOT YET!)';
    this.body = marked(this.body);

    return template(this);
  };

  Project.loadAll = rows => {
    rows.sort((a, b) => (new Date(b.lastUpdated)) - (new Date(a.lastUpdated)));

    Project.all = rows.map(function(data) {
      return new Project(data);
    });
  };

  Project.fetchAll = callback => {
    $.get('/projects')
    .then(
      results => {
        Project.loadAll(results);
        callback();
      }
    )
  };

  // I chained together a .map() and .reduce() call like the one for Kilovolt Blog
  Project.numWordsAll = () => {
    return Project.all.map(data => data.body.split(' ').length).reduce((acc, val) => acc + val);
  };

  Project.truncateTable = callback => {
    $.ajax({
      url: '/projects',
      method: 'DELETE',
    })
    .then(console.log)
    .then(callback);
  };

  Project.prototype.insertRecord = function(callback) {
    $.post('/projects', {projectUrl: this.ProjectUrl, projectImageUrl: this.projectImageUrl, body: this.body, category: this.category, lastUpdated: this.lastUpdated, title: this.title})
    .then(console.log)
    .then(callback);
  };

  Project.prototype.deleteRecord = function(callback) {
    $.ajax({
      url: `/projects/${this.project_id}`,
      method: 'DELETE'
    })
    .then(console.log)
    .then(callback);
  };

  Project.prototype.updateRecord = function(callback) {
    $.ajax({
      url: `/projects/${this.project_id}`,
      method: 'PUT',
      data: {
        projectUrl: this.projectUrl,
        projectImageUrl: this.projectImageUrl,
        body: this.body,
        category: this.category,
        lastUpdated: this.lastUpdated,
        title: this.title,
        projectUrl_id: this.projectUrl_id
      }
    })
    .then(console.log)
    .then(callback);
  };

  module.Project = Project;
}(window));
