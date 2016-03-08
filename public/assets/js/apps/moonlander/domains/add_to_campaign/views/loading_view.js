define(["app",
    "tpl!assets/js/apps/moonlander/domains/add_to_campaign/templates/loading.tpl"
  ],
  function(Moonlander, campaignListLoadingTpl) {

    Moonlander.module("DomainsApp.AddToCampaign.List", function(List, Moonlander, Backbone, Marionette, $, _) {
      List.LoadingView = Marionette.ItemView.extend({

        template: campaignListLoadingTpl,

        onRender: function() {

        }

      });
    });
    return Moonlander.DomainsApp.AddToCampaign.List.LoadingView;
  });