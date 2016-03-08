define(["app",
    "tpl!assets/js/apps/moonlander/domains/right_sidebar/templates/nameservers.tpl",
    "select2",
    "syphon"
  ],
  function(Moonlander, NameOptimizationsTpl) {

    Moonlander.module("DomainsApp.RightSidebar", function(RightSidebar, Moonlander, Backbone, Marionette, $, _) {
      RightSidebar.NameOptimizationsView = Marionette.ItemView.extend({

        template: NameOptimizationsTpl


      });
    });
    return Moonlander.DomainsApp.RightSidebar.NameOptimizationsView;
  });
