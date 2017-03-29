'use strict';

(function(module) {
  // Refactored my constructor function
  function Project (opts) {
    Object.keys(opts).forEach(e => this[e] = opts[e]);
  }

  Project.all = [];

  Project.prototype.toHtml = function() {
    let template = Handlebars.compile($('#project-template').text());
    this.body = marked(this.body);

    return template(this);
  };

  // Rewrote this method by utilizing an array method to create the new Project instances
  Project.loadAll = rows => {
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
