'use strict';

(function(module) {
  const projectView = {};

  projectView.populateFilters = function() {
    $('project').each(function() {
      if (!$(this).hasClass('template')) {
        let val = $(this).attr('data-category');
        let optionTag = `<option value="${val}">${val}</option>`;
        if ($(`#category-filter option[value="${val}"]`).length === 0) {
          $('#category-filter').append(optionTag);
        }
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

  projectView.setTeasers = function() {
    $('.project-body *:nth-of-type(n+2)').hide();

    $('projects').on('click', 'a.read-on', function(e) {
      e.preventDefault();
      $(this).parent.find('*').fadeIn();
      $(this).hide();
    });
  };

  projectView.initIndexPage = () => {
    $('#projects').empty();
    $('filters').fadeIn();
    Project.all.forEach(project => {
      $('#projects').append(project.toHtml('#project-template'));
      if ($(`#category-filter option:contains("${project.category}")`).length === 0) {
        $('#category-filter').append(project.toHtml('category-filter-template'));
      }
    });

    projectView.populateFilters();
    projectView.handleCategoryFilter();
    projectView.setTeasers();
  };

  Project.fetchAll(projectView.initIndexPage);
  module.projectView = projectView;
}(window));
