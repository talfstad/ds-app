define(["app",
    "tpl!assets/js/apps/landerds/campaigns/list/templates/loading.tpl"
  ],
  function(Landerds, landersListLoadingTpl) {

    Landerds.module("CampaignsApp.Campaigns.List", function(List, Landerds, Backbone, Marionette, $, _) {
      List.LoadingView = Marionette.ItemView.extend({

        template: landersListLoadingTpl,

        onBeforeRender: function() {

        }

      });
    });
    return Landerds.CampaignsApp.Campaigns.List.LoadingView;
  });