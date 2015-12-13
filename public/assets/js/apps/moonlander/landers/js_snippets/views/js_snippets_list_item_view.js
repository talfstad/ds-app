define(["app",
    "tpl!/assets/js/apps/moonlander/landers/js_snippets/templates/js_snippets_list_item.tpl"
  ],
  function(Moonlander, JsSnippetItemView) {

    Moonlander.module("LandersApp.JsSnippets.LeftNavList", function(LeftNavList, Moonlander, Backbone, Marionette, $, _) {
      LeftNavList.ItemView = Marionette.ItemView.extend({

        template: JsSnippetItemView,

        onBeforeRender: function() {

        }

      });
    });
    return Moonlander.LandersApp.JsSnippets.LeftNavList.ItemView;
  });