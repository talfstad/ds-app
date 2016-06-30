define(["app",
    "tpl!assets/js/apps/landerds/domains/right_sidebar/templates/nameservers.tpl",
    "select2",
    "syphon"
  ],
  function(Landerds, NameOptimizationsTpl) {

    Landerds.module("DomainsApp.RightSidebar", function(RightSidebar, Landerds, Backbone, Marionette, $, _) {
      RightSidebar.NameOptimizationsView = Marionette.ItemView.extend({

        template: NameOptimizationsTpl


      });
    });
    return Landerds.DomainsApp.RightSidebar.NameOptimizationsView;
  });
