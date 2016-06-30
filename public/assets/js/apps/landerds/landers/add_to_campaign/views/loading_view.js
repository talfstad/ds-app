define(["app",
    "tpl!assets/js/apps/landerds/landers/add_to_campaign/templates/loading.tpl"
  ],
  function(Landerds, campaignListLoadingTpl) {

    Landerds.module("LandersApp.AddToCampaign.List", function(List, Landerds, Backbone, Marionette, $, _) {
      List.LoadingView = Marionette.ItemView.extend({

        template: campaignListLoadingTpl,

        onRender: function() {

        }

      });
    });
    return Landerds.LandersApp.AddToCampaign.List.LoadingView;
  });