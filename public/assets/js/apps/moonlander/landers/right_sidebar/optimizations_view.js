define(["app",
    "tpl!/assets/js/apps/moonlander/landers/right_sidebar/templates/optimizations.tpl",
    "select2"
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
