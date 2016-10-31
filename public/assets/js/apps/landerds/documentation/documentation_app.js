define(["app",
    "assets/js/apps/landerds/documentation/list/documentation_list_controller"
  ],
  function(Landerds, ListController) {

    var initializeEvents = function() {

      var documentationAppAPI = {
        showDocumentation: function() {
          ListController.showDocumentation();
        }
      };


      Landerds.on("documentation:show", function() {
        documentationAppAPI.showDocumentation();
      });
    };


    Landerds.documentation = {
      boot: function() {
        initializeEvents();
        ListController.boot();
      }
    };

    return Landerds.documentation;
  });
