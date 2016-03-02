define(["app",
    "/assets/js/apps/moonlander/domains/list/active_campaigns/views/active_campaign_row_view.js",
    "/assets/js/apps/moonlander/domains/list/active_campaigns/views/active_campaign_empty_view.js"
  ],
  function(Moonlander, ActiveCampaignRowView, EmptyView) {

    Moonlander.module("DomainsApp.Domains.List.ActiveCampaigns", function(ActiveCampaigns, Moonlander, Backbone, Marionette, $, _) {
      ActiveCampaigns.ChildView = Marionette.CollectionView.extend({
        tagName: "table",
        className: "table",


        //pass the deployed list its rendered index for # column
        childViewOptions: function(model) {
          model.set('viewIndex', parseInt(this.collection.indexOf(model))+1);
          model.set("domain", this.collection.domain);
          model.set("deploy_status", this.collection.deploy_status);
        },

        childView: ActiveCampaignRowView,
        emptyView: EmptyView
                
      });
    });
    return Moonlander.DomainsApp.Domains.List.ActiveCampaigns.ChildView;
  });
