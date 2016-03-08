define(["app",
    "tpl!assets/js/apps/moonlander/landers/list/deployed/templates/empty.tpl"
  ],
  function(Moonlander, EmptyTpl) {

    Moonlander.module("LandersApp.Landers.List.Deployed", function(List, Moonlander, Backbone, Marionette, $, _) {
      List.EmptyView = Marionette.ItemView.extend({
        template: EmptyTpl,
        tagName: "tr",
        className: "primary",

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
    return Moonlander.LandersApp.Landers.List.Deployed.EmptyView;
  });
