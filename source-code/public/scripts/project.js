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

  Project.fetchAll = function() {
    if (localStorage.rawData) {
      Project.loadAll(JSON.parse(localStorage.rawData));
      projectView.initIndexPage();
    } else {
      $.getJSON('data/sourceData.json')
      .then(function(data) {
        localStorage.rawData = JSON.stringify(data);
        Project.loadAll(data);
        projectView.initIndexPage();
      }, function(err) {
        console.error(err.message);
      });
    }
  };

  module.Project = Project;
}(window));
