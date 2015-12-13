define(["app",
    "tpl!/assets/js/apps/moonlander/landers/js_snippets/templates/js_snippets_list_item.tpl"
  ],
  function(Moonlander, JsSnippetItemView) {

    Moonlander.module("LandersApp.Landers.JsSnippets.List", function(List, Moonlander, Backbone, Marionette, $, _) {
      List.ItemView = Marionette.ItemView.extend({
        tagName: "li",
        template: JsSnippetItemView,

        onRender: function(){
          
        }




      });
    });
    return Moonlander.LandersApp.Landers.JsSnippets.List.ItemView;
  });
