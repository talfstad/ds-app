define(["app",
    "tpl!/assets/js/apps/moonlander/campaigns/list/templates/loading.tpl"
  ],
  function(Moonlander, landersListLoadingTpl) {

    Moonlander.module("CampaignsApp.Campaigns.List", function(List, Moonlander, Backbone, Marionette, $, _) {
      List.LoadingView = Marionette.ItemView.extend({

        template: landersListLoadingTpl,

        onBeforeRender: function() {

        }

      });
    });
    return Moonlander.CampaignsApp.Campaigns.List.LoadingView;
  });