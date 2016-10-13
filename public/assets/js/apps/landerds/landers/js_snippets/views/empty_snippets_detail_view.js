define(["app",
    "tpl!assets/js/apps/landerds/landers/js_snippets/templates/empty_snippets_detail.tpl"
  ],
  function(Landerds, EmptyTpl) {

    Landerds.module("LandersApp.Landers.JsSnippets.List.DetailView", function(DetailView, Landerds, Backbone, Marionette, $, _) {
      DetailView.EmptyView = Marionette.ItemView.extend({
        template: EmptyTpl,

        onRender: function() {
          var me = this;
          var modalWidth = parseInt($(".modal-dialog.snippets-modal").css("width"));

          var descriptionWidth = modalWidth - 229 - 4 //value is the width of the left nav - 3
          me.$el.find(".snippets-header").css("width", descriptionWidth);
          me.$el.find(".js-snippet-description").css("width", descriptionWidth);

        }

      });
    });
    return Landerds.LandersApp.Landers.JsSnippets.List.DetailView.EmptyView;
  });
