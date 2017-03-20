'use strict';

var projects = [];

function Project (projectObject) {
  this.title = projectObject.title;
  this.category = projectObject.category;
  this.projectUrl = projectObject.projectUrl;
  this.projectImage = projectObject.projectImage;
  this.body = projectObject.body;
}

Project.prototype.toHtml = function() {
  var templateRender = Handlebars.compile($('#projects-template').html());
  return templateRender(this);
};

//method for creating each new Project object stored in rawData
rawData.forEach(function(projectObject) {
  projects.push(new Project(projectObject));
});

projects.forEach(function(p) {
  $('#projects').append(p.toHtml());
});
