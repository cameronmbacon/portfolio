'use strict';

(function() {
  const adminView = {
    initAdminPage : () => {
      $('#portfolio-stats .projects').text(Project.all.length);
      $('#portfolio-stats .words').text(Project.numWordsAll());
    }
  };

  Project.fetchAll(adminView.initAdminPage);
})();
