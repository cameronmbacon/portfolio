'use strict';

function Project (opts) {
  this.title = opts.title;
  this.category = opts.category;
  this.projectUrl = opts.projectUrl;
  this.projectImageUrl = opts.projectImageUrl;
  this.body = opts.body;
}

Project.all = [];

Project.prototype.toHtml = function() {
  let template = Handlebars.compile($('#project-template').text());
  this.body = marked(this.body);

  return template(this);
};

Project.loadAll = function(rawData) {
  rawData.forEach(function(ele) {
    Project.all.push(new Project(ele));
  })
}

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
}
