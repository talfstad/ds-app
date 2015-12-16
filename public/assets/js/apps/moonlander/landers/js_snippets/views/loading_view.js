define(["app",
    "tpl!/assets/js/apps/moonlander/landers/js_snippets/templates/loading.tpl"
  ],
  function(Moonlander, LoadingTpl) {

    Moonlander.module("LandersApp.JsSnippets", function(JsSnippets, Moonlander, Backbone, Marionette, $, _) {
      JsSnippets.LoadingView = Marionette.ItemView.extend({

        template: LoadingTpl,

        onRender: function() {

        }

      });
    });
    return Moonlander.LandersApp.JsSnippets.LoadingView;
  });