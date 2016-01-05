define(["app",
    "tpl!/assets/js/apps/moonlander/landers/right_sidebar/templates/lander_modified.tpl"
  ],
  function(Moonlander, MenuButtonsTpl) {

    Moonlander.module("LandersApp.RightSidebar", function(RightSidebar, Moonlander, Backbone, Marionette, $, _) {
      RightSidebar.LanderModifiedView = Marionette.ItemView.extend({

        template: MenuButtonsTpl,

        className: "js-snippet-alert alert alert-warning lander-modified-alert",

        modelEvents: {
          'change:deploy_status': 'render'
        },

        onRender: function() {
          if (this.model.get("deploy_status") != "modified") {
            this.$el.hide();
          } else {
            this.$el.fadeIn();
          }
        }


      });
    });
    return Moonlander.LandersApp.RightSidebar.LanderModifiedView;
  });
