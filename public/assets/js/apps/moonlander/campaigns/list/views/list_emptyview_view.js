define(["app",
    "tpl!assets/js/apps/moonlander/campaigns/list/templates/list_domains_empty.tpl"
  ],
  function(Moonlander, landersListEmptyItemsTpl) {

    Moonlander.module("CampaignsApp.Campaigns.List.CollectionView", function(CollectionView, Moonlander, Backbone, Marionette, $, _) {
      CollectionView.EmptyView = Marionette.ItemView.extend({

        template: landersListEmptyItemsTpl,

        onBeforeRender: function() {
          this.model.set('filterVal', $('.lander-search').val());
        }

      });
    });
    return Moonlander.CampaignsApp.Campaigns.List.CollectionView.EmptyView;
  });
