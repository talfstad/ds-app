define(["app",
    "tpl!assets/js/apps/landerds/landers/list/deployed_domains/templates/empty.tpl"
  ],
  function(Landerds, EmptyTpl) {

    Landerds.module("LandersApp.Landers.List.Deployed", function(List, Landerds, Backbone, Marionette, $, _) {
      List.EmptyView = Marionette.ItemView.extend({
        template: EmptyTpl,
        tagName: "tr",
        className: "dark",

        isInitializing: false,

        initialize: function(options){
          this.isInitializing = options.isInitializing || false;
        },

        onRender: function() {
          if (this.isInitializing) {
            this.$el.removeClass("primary").addClass("alert");
          }
        },

        serializeData: function() {
          return {
            isInitializing: this.isInitializing
          };
        }

      });
    });
    return Landerds.LandersApp.Landers.List.Deployed.EmptyView;
  });
