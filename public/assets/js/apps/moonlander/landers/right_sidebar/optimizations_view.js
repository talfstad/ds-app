define(["app",
    "tpl!assets/js/apps/moonlander/landers/right_sidebar/templates/optimizations.tpl",
    "select2",
    "syphon"
  ],
  function(Moonlander, NameOptimizationsTpl) {

    Moonlander.module("LandersApp.RightSidebar", function(RightSidebar, Moonlander, Backbone, Marionette, $, _) {
      RightSidebar.NameOptimizationsView = Marionette.ItemView.extend({

        initialize: function() {

        },

        template: NameOptimizationsTpl,

        events: {
          "change #optimized": "landerIsModified",
          "change #deploy-root": "landerIsModified",
          "keyup #deploy-folder-edit": "landerIsModified"
        },

        onRender: function() {
          this.$el.find(".tool-tip").tooltip();          
        },

        landerIsModified: function() {
          //set new vals to model
          this.model.set(Backbone.Syphon.serialize(this));

          if (this.model.get("deployment_folder_name") == this.model.get("originalValueDeploymentFolderName") &&
            this.model.get("originalValueDeployRoot") == this.model.get("deploy_root")) {

            this.trigger("modified", false);

          } else {

            this.trigger("modified", true);
          }
        }

      });
    });
    return Moonlander.LandersApp.RightSidebar.NameOptimizationsView;
  });
