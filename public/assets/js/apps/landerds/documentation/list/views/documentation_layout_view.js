define(["app",
    "tpl!assets/js/apps/landerds/documentation/list/templates/documentation_layout.tpl",
  ],
  function(Landerds, DocumentationTpl) {

    var DocumentationLayoutView = Marionette.LayoutView.extend({

      id: "container",

      template: DocumentationTpl,

      regions: {
        documentationContentRegion: "#docs",
        documentationButtonRegion: "#docs-button"
      }

    });
    return DocumentationLayoutView;
  });
