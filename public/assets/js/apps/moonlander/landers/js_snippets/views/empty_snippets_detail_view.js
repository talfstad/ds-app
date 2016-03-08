define(["app",
    "tpl!assets/js/apps/moonlander/landers/js_snippets/templates/empty_snippets_detail.tpl"
  ],
  function(Moonlander, EmptyTpl) {

    Moonlander.module("LandersApp.Landers.JsSnippets.List.DetailView", function(DetailView, Moonlander, Backbone, Marionette, $, _) {
      DetailView.EmptyView = Marionette.ItemView.extend({
        template: EmptyTpl,

        onRender: function() {
          var me = this;
          var modalWidth = parseInt($(".modal-dialog").css("width"));

          var descriptionWidth = modalWidth - 229 - 3 //value is the width of the left nav - 3
          me.$el.find(".snippets-header").css("width", descriptionWidth);
          me.$el.find(".js-snippet-description").css("width", descriptionWidth);

        }

      });
    });
    return Moonlander.LandersApp.Landers.JsSnippets.List.DetailView.EmptyView;
  });
