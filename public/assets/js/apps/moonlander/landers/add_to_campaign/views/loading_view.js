define(["app",
    "tpl!/assets/js/apps/moonlander/landers/add_to_campaign/templates/loading.tpl"
  ],
  function(Moonlander, campaignListLoadingTpl) {

    Moonlander.module("LandersApp.AddToCampaign.List", function(List, Moonlander, Backbone, Marionette, $, _) {
      List.LoadingView = Marionette.ItemView.extend({

        template: campaignListLoadingTpl,

        onRender: function() {

        }

      });
    });
    return Moonlander.LandersApp.AddToCampaign.List.LoadingView;
  });