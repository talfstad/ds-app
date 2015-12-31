define(["app",
    "tpl!/assets/js/apps/moonlander/landers/js_snippets/templates/new_snippet.tpl"
  ],
  function(Moonlander, NewSnippetTpl) {

    Moonlander.module("LandersApp.Landers.JsSnippets.List.DetailView", function(DetailView, Moonlander, Backbone, Marionette, $, _) {
      DetailView.NewSnippet = Marionette.ItemView.extend({
        template: NewSnippetTpl,

        events: {
          "click .cancel-new-snippet-button": "cancelNewSnippet"
        },

        cancelNewSnippet: function(){
          this.trigger("cancelNewSnippet");
        },

        onRender: function() {
          var me = this;
          var modalWidth = parseInt($(".modal-dialog").css("width"));

          var descriptionWidth = modalWidth - 229 - 3 //value is the width of the left nav - 3
          me.$el.find(".snippets-header").css("width", descriptionWidth);
          me.$el.find(".js-snippet-description").css("width", descriptionWidth);
          me.$el.find(".alert").css("width", descriptionWidth);
        },

        onDomRefresh: function(){
          $(".new-snippet-name").focus();
        }

      });
    });
    return Moonlander.LandersApp.Landers.JsSnippets.List.DetailView.NewSnippet;
  });
