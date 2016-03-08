define(["app",
    "tpl!assets/js/apps/moonlander/landers/list/templates/add_new_campaign.tpl"
  ],
  function(Moonlander, AddNewCampaignTpl) {

    Moonlander.module("LandersApp.Landers.List", function(List, Moonlander, Backbone, Marionette, $, _) {
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
    return Moonlander.LandersApp.Landers.List.AddNewCampaign;
  });