define(["app",
    "tpl!/assets/js/apps/moonlander/landers/right_sidebar/templates/menu_buttons.tpl"
  ],
  function(Moonlander, MenuButtonsTpl) {

    Moonlander.module("LandersApp.RightSidebar", function(RightSidebar, Moonlander, Backbone, Marionette, $, _) {
      RightSidebar.MenuButtonsView = Marionette.ItemView.extend({

        template: MenuButtonsTpl,

        className: "btn-group",

        events: {
          'click .redeploy-all-locations': "redeploy"
        },

        redeploy: function(e) {
          var me = this;
          e.preventDefault();

          var attr = {
            landersArray: [this.model],
            successCallback: function(){
              me.model.set("modified", false);
              me.model.save({});
            }
          }

          Moonlander.trigger("landers:redeploy", attr);
        },

          modelEvents: {
          'change:deploy_status': 'render'
        }


      });
    });
    return Moonlander.LandersApp.RightSidebar.MenuButtonsView;
  });
