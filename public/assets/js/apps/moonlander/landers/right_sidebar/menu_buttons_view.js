define(["app",
    "tpl!assets/js/apps/moonlander/landers/right_sidebar/templates/menu_buttons.tpl"
  ],
  function(Moonlander, MenuButtonsTpl) {

    Moonlander.module("LandersApp.RightSidebar", function(RightSidebar, Moonlander, Backbone, Marionette, $, _) {
      RightSidebar.MenuButtonsView = Marionette.ItemView.extend({

        template: MenuButtonsTpl,

        className: "btn-group",

        events: {
          'click .redeploy-all-locations': "redeploy",
          'click .save-button': "save"
        },

        modelEvents: {
          "change:deploy_status": "render",
          "change:modified": "render"
        },

        save: function() {
          this.trigger("save");
        },

        redeploy: function(e) {
          var me = this;
          e.preventDefault();

          Moonlander.trigger("landers:redeploy", this.model);
        }

      });
    });
    return Moonlander.LandersApp.RightSidebar.MenuButtonsView;
  });
