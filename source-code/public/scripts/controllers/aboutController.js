'use strict';

(function(module) {
  const aboutController = {};

  aboutController.index = () => {
    $('#about').show().siblings().hide();
    
    repos.requestRepos(repoView.index);
  };

  module.aboutController = aboutController;
})(window);
