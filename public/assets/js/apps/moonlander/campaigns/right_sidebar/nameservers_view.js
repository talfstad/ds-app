define(["app",
    "tpl!/assets/js/apps/moonlander/campaigns/right_sidebar/templates/nameservers.tpl",
    "select2",
    "syphon"
  ],
  function(Moonlander, NameOptimizationsTpl) {

    Moonlander.module("CampaignsApp.RightSidebar", function(RightSidebar, Moonlander, Backbone, Marionette, $, _) {
      RightSidebar.NameOptimizationsView = Marionette.ItemView.extend({

        template: NameOptimizationsTpl


      });
    });
    return Moonlander.CampaignsApp.RightSidebar.NameOptimizationsView;
  });
