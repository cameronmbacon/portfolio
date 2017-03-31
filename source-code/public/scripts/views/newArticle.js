'use strict';

(function() {
  const newProject = {};

  newProject.initNewProjectPage = function() {
    $('.tab-content').show();
    $('export-field').hide();
    $('#project-json').on('focus', function() {
      this.select();
    });
    $('new-form').on('change', newProject.create);
  };

  newProject.create = function() {
    $('#projects').empty();
    let formProject = new Project({
      title: $('#project-title').val(),
      projectUrl: $('#project-url').val(),
      projectImageUrl: $('#project-image-url').val(),
      category: $('#project-category').val(),
      body: $('#project-body').val(),
      lastUpdated: $('#project-updated:checked').length ? new Date() : null
    });
    $('#projects').append(formProject.toHtml('#project-template'));
    $('pre code').each((i, block) => hljs.highlightBlock(block));
    $('#export-field').show();
    $('#project-json').val(`${JSON.stringify(project)},`);
  };

  newProject.initNewProjectPage();
})();
