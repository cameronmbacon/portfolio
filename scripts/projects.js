'use strict';

var projects = [];

function Project (projectObject) {
  this.title = projectObject.title;
  this.projectUrl = projectObject.projectUrl;
  this.projectImage = projectObject.projectImage;
  this.body = projectObject.body;
}

Project.prototype.toHtml = function() {
  var $newProject = $('article.template').clone();
  $newProject.removeClass('template');
  $newProject.find('.project-title a').html(this.title);
  $newProject.find('.project-title a').attr('href', this.projectUrl);
  $newProject.find('.image-container').html(this.projectImage);
  $newProject.find('.project-body').html(this.body);

  return $newProject;
};

//method for creating each new Project object stored in rawData
rawData.forEach(function(projectObject) {
  projects.push(new Project(projectObject));
});

projects.forEach(function(p) {
  $('#projects').append(p.toHtml());
});
