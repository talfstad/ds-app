define(["app",
    "tpl!assets/js/apps/landerds/documentation/list/templates/documentation_button.tpl",
  ],
  function(Landerds, DocumentationButtonTpl) {
    var DocumentationButtonView = Marionette.ItemView.extend({

      id: "documentation-button",

      template: DocumentationButtonTpl,

      onRender: function() {

      }

    });
    return DocumentationButtonView;
  });
