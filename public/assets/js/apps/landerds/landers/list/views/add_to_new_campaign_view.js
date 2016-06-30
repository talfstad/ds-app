define(["app",
    "tpl!assets/js/apps/landerds/landers/list/templates/add_new_campaign.tpl"
  ],
  function(Landerds, AddNewCampaignTpl) {

    Landerds.module("LandersApp.Landers.List", function(List, Landerds, Backbone, Marionette, $, _) {
      List.AddNewCampaign = Marionette.ItemView.extend({

        template: AddNewCampaignTpl,

        modelEvents: {
          'change': 'render'
        },

        className: "bs-component btn-group ml15",

        onBeforeRender: function() {

        }

      });
    });
    return Landerds.LandersApp.Landers.List.AddNewCampaign;
  });