define(["app",
    "tpl!/assets/js/apps/moonlander/landers/right_sidebar/templates/name_optimizations.tpl"
  ],
  function(Moonlander, NameOptimizationsTpl) {

    Moonlander.module("LandersApp.RightSidebar", function(RightSidebar, Moonlander, Backbone, Marionette, $, _) {
      RightSidebar.NameOptimizationsView = Marionette.ItemView.extend({

        template: NameOptimizationsTpl,

        modelEvents: {
          'change': 'render'
        }


      });
    });
    return Moonlander.LandersApp.RightSidebar.NameOptimizationsView;
  });