'use strict';

(function(module) {
  const projectController = {};

  projectController.index = () => {
    Project.fetchAll(projectView.initIndexPage);
    $('main > section').hide();
    $('#projects').show();
  }

  module.projectController = projectController;
})(window);
