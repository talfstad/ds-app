define(["app",
    "tpl!assets/js/apps/landerds/landers/edit/templates/js_snippet_totals.tpl"
  ],
  function(Landerds, TotalsTpl) {

    Landerds.module("LandersApp.Landers.JsSnippets.Totals", function(Totals, Landerds, Backbone, Marionette, $, _) {
      Totals.ItemView = Marionette.ItemView.extend({
        template: TotalsTpl,

        className: "snippet-list-title",

        snippetCollection: [],

        initialize: function(options) {
          var me = this;
          this.listenTo(this, "updateSnippetTotals", function() {
            me.render();
          });

          this.snippetCollection = options.snippet_collection;

        },

        serializeData: function() {
          // call the super method
          var data = Backbone.Marionette.ItemView.prototype.serializeData.apply(this, arguments);
          // augment the data the way you need
          data.totalNumJsSnippets = this.snippetCollection.length;
          // send back your custom data
          return data;
        }


      });
    });
    return Landerds.LandersApp.Landers.JsSnippets.Totals.ItemView;
  });
