define(["app",
    "tpl!assets/js/apps/landerds/domains/add_to_campaign/templates/loading.tpl"
  ],
  function(Landerds, campaignListLoadingTpl) {

    Landerds.module("DomainsApp.AddToCampaign.List", function(List, Landerds, Backbone, Marionette, $, _) {
      List.LoadingView = Marionette.ItemView.extend({

        template: campaignListLoadingTpl,

        onRender: function() {

        }

      });
    });
    return Landerds.DomainsApp.AddToCampaign.List.LoadingView;
  });