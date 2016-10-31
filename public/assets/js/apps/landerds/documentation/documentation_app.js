define(["app",
    "assets/js/apps/landerds/documentation/list/documentation_list_controller"
  ],
  function(Landerds, ListController) {
    Landerds.module("DocumentationApp", function(DocumentationApp, Landerds, Backbone, Marionette, $, _) {

      var documentationAppAPI = {
        showDocumentation: function() {
          ListController.showDocumentation();
        }
      };

      Landerds.on("documentation:show", function() {
        documentationAppAPI.showDocumentation();
      });
    });

    return Landerds.DocumentationApp;
  });
