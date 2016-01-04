define(["app",
    "tpl!/assets/js/apps/moonlander/landers/right_sidebar/templates/menu_buttons.tpl"
  ],
  function(Moonlander, MenuButtonsTpl) {

    Moonlander.module("LandersApp.RightSidebar", function(RightSidebar, Moonlander, Backbone, Marionette, $, _) {
      RightSidebar.MenuButtonsView = Marionette.ItemView.extend({

        template: MenuButtonsTpl,
        
        className: "btn-group",

        modelEvents: {
          'change:deploy_status': 'render'
        }


      });
    });
    return Moonlander.LandersApp.RightSidebar.MenuButtonsView;
  });
