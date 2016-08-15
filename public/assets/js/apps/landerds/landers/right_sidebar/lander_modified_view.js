define(["app",
    "tpl!assets/js/apps/landerds/landers/right_sidebar/templates/lander_modified.tpl"
  ],
  function(Landerds, LanderModifiedTpl) {

    Landerds.module("LandersApp.RightSidebar", function(RightSidebar, Landerds, Backbone, Marionette, $, _) {
      RightSidebar.LanderModifiedView = Marionette.ItemView.extend({

        template: LanderModifiedTpl,

        className: "js-snippet-alert alert alert-warning lander-modified-alert",

        modelEvents: {
          'change:modified': 'render',
          'change:saving_lander': 'render',
          'change:saving_snippet': 'render'
        },

        display: function() {
          var modified = this.model.get("modified");
          var saving_lander = this.model.get("saving_lander");
          var saving_snippet = this.model.get("saving_snippet");


          //always show modified if its modified
          if (modified) {
            this.$el.removeClass("alert-primary").addClass("alert-warning");
          } else {
            this.$el.removeClass("alert-warning");
          }

          if (saving_lander || saving_snippet) {
            this.$el.removeClass("alert-warning").addClass("alert-primary");
          } else {
            this.$el.removeClass("alert-primary");
          }
        
          if (modified || saving_lander || saving_snippet) {
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
