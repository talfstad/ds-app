define(["app",
    "tpl!/assets/js/apps/moonlander/domains/list/deployed_landers/templates/empty.tpl"
  ],
  function(Moonlander, EmptyTpl) {

    Moonlander.module("DomainsApp.Domains.List.Deployed", function(List, Moonlander, Backbone, Marionette, $, _) {
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
    return Moonlander.DomainsApp.Domains.List.Deployed.EmptyView;
  });
