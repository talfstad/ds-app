define(["app",
    "tpl!assets/js/apps/landerds/landers/right_sidebar/templates/deployment_options.tpl",
    "select2",
    "syphon"
  ],
  function(Landerds, DeploymentOptionsTpl) {

    Landerds.module("LandersApp.RightSidebar", function(RightSidebar, Landerds, Backbone, Marionette, $, _) {
      RightSidebar.DeploymentOptionsView = Marionette.ItemView.extend({

        initialize: function() {

        },

        template: DeploymentOptionsTpl,

        events: {
          "change #optimized": "landerIsModified",
          "change #deploy-root": "landerIsModified",
          "keyup #deploy-folder-edit": "landerIsModified"
        },

        validateDeploymentFolderName: function() {
          var deploymentFolderVal = this.$el.find("#deploy-folder-edit").val();
          if (deploymentFolderVal.match(/^[a-z0-9\-]+$/i)) {
            return true;
          } else {
            return false;
          }
        },

        onRender: function() {
          var me = this;
          this.$el.find(".tool-tip").tooltip();
          var input = this.$el.find("#deploy-folder-edit")
          input.keyup(function() {
            if (!me.validateDeploymentFolderName()) {
              //set error
              input.parent().addClass("has-error");
              me.model.set("deploymentFolderInvalid", true);
            } else {
              input.parent().removeClass("has-error");
              me.model.set("deploymentFolderInvalid", false);
            }
          });
        },

        landerIsModified: function() {
          //set new vals to model
          this.model.set(Backbone.Syphon.serialize(this));

          if (this.model.get("deployment_folder_name") == this.model.get("originalValueDeploymentFolderName") &&
            this.model.get("originalValueDeployRoot") == this.model.get("deploy_root")) {

            this.trigger("modified", false);

          } else {

            //if not currently modified then set no_optimize_on_save = true
            if (!this.model.get("modified")) {
              this.model.set("no_optimize_on_save", true);
            }

            this.trigger("modified", true);
          }
        }

      });
    });
    return Landerds.LandersApp.RightSidebar.DeploymentOptionsView;
  });
