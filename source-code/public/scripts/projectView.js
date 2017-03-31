'use strict';

(function(module) {
  const projectView = {};

  projectView.populateFilters = function() {
    $('project').each(function() {
      var val = $(this).attr('data-category');
      var optionTag = `<option value="${val}">${val}</option>`;
      if ($(`#category-filter option[value="${val}"]`).length === 0) {
        $('#category-filter').append(optionTag);
      }
    });
  };

  projectView.handleCategoryFilter = function() {
    $('#category-filter').on('change', function() {
      if($(this).val()) {
        $('project').hide();
        $(`project[data-category="${$(this).val()}"]`).fadeIn();
      } else {
        $('project').fadeIn();
        $('project.template').hide();
      }
    });
  };

  projectView.handleMainNav = function() {
    $('.main-nav').on('click', '.tab', function() {
      $('.tab-content').hide();
      $(`#${$(this).data('content')}`).fadeIn();
    });

    $('.main-nav .tab:first').click();
  };

  projectView.setTeasers = function() {
    $('.project-body *:nth-of-type(n+2)').hide();

    $('projects').on('click', 'a.read-on', function(e) {
      e.preventDefault();
      $(this).parent.find('*').fadeIn();
      $(this).hide();
    });
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
      projectUrl: $('#project-url').val(),
      projectImageUrl: $('#project-image-url').val(),
      category: $('#project-category').val(),
      body: $('#project-body').val(),
      lastUpdated: $('#project-updated:checked').length ? new Date() : null
    });

    $('#projects').append(project.toHtml());
    $('pre code').each((i, block) => hljs.highlightBlock(block));
    $('#export-field').show();
    $('#project-json').val(`${JSON.stringify(project)},`);
  };

  projectView.initIndexPage = function() {
    Project.all.forEach(a => $('#projects').append(a.toHtml()));

    projectView.populateFilters();
    projectView.handleCategoryFilter();
    projectView.handleMainNav();
    projectView.setTeasers();
  };

  projectView.initAdminPage = function() {
    let template = Handlebars.compile($('analytics-template').text());

    Project.numWordsAll();

    $('#portfolio-stats .projects').text(Project.all.length);
    $('#portfolio-stats .words').text(Project.numWordsAll());
  };

  module.projectView = projectView;
}(window));
