//append the div to body, create layout view that has that el and show button
define(["app",
    "assets/js/apps/landerds/documentation/list/views/documentation_layout_view",
    "assets/js/apps/landerds/documentation/list/views/documentation_button_view",
    "assets/js/apps/landerds/documentation/list/views/documentation_list_view"
  ],
  function(Landerds, DocumentationLayoutView, DocumentationButtonView, DocumentationListView) {
    Landerds.module("Documentation", function(Documentation, RipManager, Backbone, Marionette, $, _) {
      Documentation.Controller = {

        documentationLayoutView: null,
        documentationListView: null,

        toggle: function() {
          if (!this.documentationListView) {
            //load if first time
            var DocumentationModel = Backbone.Model.extend();
            this.documentationListView = new DocumentationListView({ model: new DocumentationModel });
            if (this.documentationLayoutView) this.documentationLayoutView.documentationContentRegion.show(this.documentationListView);
          }

          this.documentationListView.toggle();

        },

        boot: function() {
          var me = this;
          $("body").append('<div id="documentation-region"></div>');

          Landerds.addRegions({
            documentationRegion: "#documentation-region"
          });

          this.documentationLayoutView = new DocumentationLayoutView;

          Landerds.documentationRegion.show(this.documentationLayoutView);

          var documentationButtonView = new DocumentationButtonView;

          documentationButtonView.on("toggle", function() {
            me.toggle();
          });

          if (this.documentationLayoutView) this.documentationLayoutView.documentationButtonRegion.show(documentationButtonView);
        }
      }

    });

    return Landerds.Documentation.Controller;
  });
