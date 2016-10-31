//append the div to body, create layout view that has that el and show button
define(["app",
    "assets/js/apps/landerds/documentation/list/views/documentation_layout_view",
    "assets/js/apps/landerds/documentation/list/views/documentation_button_view",
    "assets/js/apps/landerds/documentation/list/views/documentation_list_view"
  ],
  function(Landerds, DocumentationLayoutView, DocumentationButtonView, DocumentationListView) {
    Landerds.module("Documentation", function(Documentation, RipManager, Backbone, Marionette, $, _) {
      Documentation.Controller = {

        layout: null,

        showDocumentation: function() {
          var DocumentationModel = Backbone.Model.extend();

          var documentationListView = new DocumentationListView({
            model: new DocumentationModel
          });

          if (this.layout) this.layout.documentationContentRegion.show(documentationListView);

        },

        boot: function() {

          $("body").append('<div id="documentation-region"></div>');

          Landerds.addRegions({
            documentationRegion: "#documentation-region"
          });

          this.layout = new DocumentationLayoutView;

          Landerds.documentationRegion.show(this.layout);

          var documentationButtonView = new DocumentationButtonView;
          
          if (this.layout) this.layout.documentationButtonRegion.show(documentationButtonView);

        }
      }

    });

    return Landerds.Documentation.Controller;
  });
