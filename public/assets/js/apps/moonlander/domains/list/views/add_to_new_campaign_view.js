define(["app",
    "tpl!/assets/js/apps/moonlander/domains/list/templates/add_new_campaign.tpl"
  ],
  function(Moonlander, AddNewCampaignTpl) {

    Moonlander.module("DomainsApp.Domains.List", function(List, Moonlander, Backbone, Marionette, $, _) {
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
    return Moonlander.DomainsApp.Domains.List.AddNewCampaign;
  });