'use strict';

(function(module) {
  const aboutController = {};

  aboutController.init = function() {
    $('.tab-content').hide();
    $('#about').fadeIn('fast');
  }

  module.aboutController = aboutController;
})(window);
