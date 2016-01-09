define(["app",
    "tpl!/assets/js/apps/moonlander/domains/list/active_campaigns/templates/empty.tpl"
  ],
  function(Moonlander, EmptyTpl) {

    Moonlander.module("DomainsApp.Domains.List.ActiveCampaigns", function(ActiveCampaigns, Moonlander, Backbone, Marionette, $, _) {
      ActiveCampaigns.EmptyView = Marionette.ItemView.extend({
        template: EmptyTpl,
        tagName: "tr",
        className: "primary",


        onRender: function() {
          if (this.model.get("deploy_status") === "initializing") {
            this.$el.removeClass("primary").addClass("alert");
          }
        }

      });
    });
    return Moonlander.DomainsApp.Domains.List.ActiveCampaigns.EmptyView;
  });
