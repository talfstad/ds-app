define(["app",
    "tpl!assets/js/apps/landerds/landers/right_sidebar/templates/lander_modified.tpl"
  ],
  function(Landerds, LanderModifiedTpl) {

    Landerds.module("LandersApp.RightSidebar", function(RightSidebar, Landerds, Backbone, Marionette, $, _) {
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
    return Landerds.LandersApp.RightSidebar.LanderModifiedView;
  });
