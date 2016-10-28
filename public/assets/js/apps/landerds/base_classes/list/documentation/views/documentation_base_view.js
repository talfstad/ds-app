define(["app",
    "tpl!assets/js/apps/landerds/base_classes/list/documentation/templates/documentation_base.tpl"
  ],
  function(Landerds, DocumentationTpl) {
    var DocumentationBaseView = Marionette.LayoutView.extend({

      id: "documentation",

      template: DocumentationTpl,

      onBeforeRender: function() {

      },

      onRender: function() {
        // list-group-accordion functionality
        var listAccordion = this.$el.find('.list-group-accordion');
        var accordionItems = listAccordion.find('.list-group-item');
        var accordionLink = listAccordion.find('.sign-toggle');

        accordionLink.on('click', function() {

          var accordionEl = $(this);
          var parent = accordionEl.parent();
          var children = parent.find("ul > li");

          if (!parent.hasClass("active")) {
            children.removeClass("active");
            children.first().addClass("active");
          }

        });
      }
    });
    return DocumentationBaseView;
  });
