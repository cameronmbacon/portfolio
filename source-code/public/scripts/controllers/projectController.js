'use strict';

(function(module) {
  const projectController = {};

  projectController.init = function() {
    Project.fetchAll(projectView.initIndexPage);
    $('.tab-content').hide();
    $('#projects').show();
  }

  module.projectController = projectController;
})(window);
