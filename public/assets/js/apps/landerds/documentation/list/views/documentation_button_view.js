define(["app",
    "tpl!assets/js/apps/landerds/documentation/list/templates/documentation_button.tpl",
  ],
  function(Landerds, DocumentationButtonTpl) {
    var DocumentationButtonView = Marionette.ItemView.extend({

      id: "documentation-button-container",

      template: DocumentationButtonTpl,

      events: {
        "click .documentation-button": "toggle"
      },

      toggle: function() {
        this.trigger("toggle");
      },

      onRender: function() {

      }

    });
    return DocumentationButtonView;
  });
