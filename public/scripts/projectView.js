'use strict';
//TODO: To be honset this is a nit-pick since I need to say something. To go with best practice and to make things easier to find you should consider refactoring the init functions into seperate files. 
(function(module) {
  const projectView = {};

  projectView.handleMainNav = function() {
    $('.main-nav').on('click', '.tab', function() {
      $('.tab-content').hide();
      $(`#${$(this).data('content')}`).fadeIn();
    });

    $('.main-nav .tab:first').click();
  };

  projectView.initNewProjectPage = function() {
    $('.tab-content').show();
    $('export-field').hide();
    $('#project-json').on('focus', function() {
      this.select();
    });

    $('new-form').on('change', 'input, textarea', projectView.create);
  };

  projectView.create = function() {
    let project;
    $('#projects').empty();

    project = new Project({
      title: $('#project-title').val(),
      category: $('#project-category').val(),
      projectUrl: $('#project-url').val(),
      projectImageUrl: $('#project-image-url').val(),
      body: $('#project-body').val()
    });

    $('#projects').append(project.toHtml());
    $('pre code').each(function(i, block) {
      hljs.highlightBlock(block);
    });

    $('#export-field').show();
    $('#project-json').val(`${JSON.stringify(project)}`);
  };

  projectView.initIndexPage = function() {
    Project.all.forEach(function(a) {
      $('#projects').append(a.toHtml())
    });

    projectView.handleMainNav();
  };

  module.projectView = projectView;
}(window));
