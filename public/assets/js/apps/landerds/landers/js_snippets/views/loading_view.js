define(["app",
    "tpl!assets/js/apps/landerds/landers/js_snippets/templates/loading.tpl"
  ],
  function(Landerds, LoadingTpl) {

    Landerds.module("LandersApp.Landers.JsSnippets", function(JsSnippets, Landerds, Backbone, Marionette, $, _) {
      JsSnippets.LoadingView = Marionette.ItemView.extend({

        template: LoadingTpl,

        onRender: function() {

        }

      });
    });
    return Landerds.LandersApp.Landers.JsSnippets.LoadingView;
  });