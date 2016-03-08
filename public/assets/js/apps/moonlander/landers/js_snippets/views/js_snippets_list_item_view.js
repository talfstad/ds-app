define(["app",
    "tpl!assets/js/apps/moonlander/landers/js_snippets/templates/js_snippets_list_item.tpl"
  ],
  function(Moonlander, JsSnippetItemView) {

    Moonlander.module("LandersApp.Landers.JsSnippets.List", function(List, Moonlander, Backbone, Marionette, $, _) {
      List.ItemView = Marionette.ItemView.extend({
        tagName: "li",
        template: JsSnippetItemView,

        modelEvents: {
          "change:name": "render",
          "change:active": "render"
        },

        events: {
          "click .snippet-link": "showSnippet"
        },

        showSnippet: function() {
          this.model.set("editing", false);
          this.trigger("showSnippet", this.model);
        },

        onRender: function() {
          if (this.model.get("active")) {
            this.$el.addClass("active")
          } else {
            this.$el.removeClass("active")
          }
        }


      });
    });
    return Moonlander.LandersApp.Landers.JsSnippets.List.ItemView;
  });
