define(["app",
    "tpl!/assets/js/apps/moonlander/landers/right_sidebar/jssnippets/templates/active_snippets_row.tpl"
    // "fancytree",
    // "bootstrap"
  ],
  function(Moonlander, ActiveSnippetRowTpl) {

    Moonlander.module("LandersApp.RightSidebar.JsSnippets.List", function(List, Moonlander, Backbone, Marionette, $, _) {

      List.ActiveSnippetRow = Marionette.ItemView.extend({
        template: ActiveSnippetRowTpl,
        tagName: "li",

        onRender: function(){

        }
      });
    });

    return Moonlander.LandersApp.RightSidebar.JsSnippets.List.ActiveSnippetRow;
  });