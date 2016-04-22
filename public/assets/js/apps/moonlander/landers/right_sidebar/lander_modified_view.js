define(["app",
    "tpl!assets/js/apps/moonlander/landers/right_sidebar/templates/lander_modified.tpl"
  ],
  function(Moonlander, LanderModifiedTpl) {

    Moonlander.module("LandersApp.RightSidebar", function(RightSidebar, Moonlander, Backbone, Marionette, $, _) {
      RightSidebar.LanderModifiedView = Marionette.ItemView.extend({

        template: LanderModifiedTpl,

        className: "js-snippet-alert alert alert-warning lander-modified-alert",

        modelEvents: {
          'change:modified': 'display'
        },

        display: function() {
          if (this.model.get("modified")) {
            this.$el.fadeIn();
          } else {
            this.$el.hide();
          }
        },

        onRender: function() {
          this.display();
        }


      });
    });
    return Moonlander.LandersApp.RightSidebar.LanderModifiedView;
  });
