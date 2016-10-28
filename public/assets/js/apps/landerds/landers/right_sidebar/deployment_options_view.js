define(["app",
    "tpl!assets/js/apps/landerds/landers/right_sidebar/templates/deployment_options.tpl",
    "select2",
    "syphon"
  ],
  function(Landerds, DeploymentOptionsTpl) {

    Landerds.module("LandersApp.RightSidebar", function(RightSidebar, Landerds, Backbone, Marionette, $, _) {
      RightSidebar.DeploymentOptionsView = Marionette.ItemView.extend({

        initialize: function() {
          //on load set noOptimize on save to false if modified from server
          if (this.model.get("modified")) {
            this.model.set("no_optimize_on_save", false);
          }
        },

        template: DeploymentOptionsTpl,

        modelEvents: {
          "reset_deployment_name_text": "updateDeploymentFolderValue"
        },

        events: {
          "click .deployment-folder-help": "showDeploymentFolderHelp",
          "keyup #deploy-folder-edit": "deploymentFolderNameChanged"
        },

        validateDeploymentFolderName: function() {
          var deploymentFolderVal = this.$el.find("#deploy-folder-edit").val();
          if (deploymentFolderVal.match(/^[a-z0-9\-]+$/i)) {
            return true;
          } else {
            return false;
          }
        },

        showDeploymentFolderHelp: function() {
          this.trigger("showDeploymentFolderHelp");
        },

        updateDeploymentFolderValue: function() {
          this.$el.find("#deploy-folder-edit").val(this.model.get("deployment_folder_name"));
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


        deploymentFolderNameChanged: function() {

          //deployment folder last thing changed true unless its set to false

          //set new vals to model
          this.model.set(Backbone.Syphon.serialize(this));

          //validate the deploymentfoldername
          this.validateDeploymentFolderName();

          var noOptimizeOnSave = this.model.get("no_optimize_on_save");
          var deploymentFolderHasChanged = (this.model.get("deployment_folder_name") != this.model.get("originalValueDeploymentFolderName"));

          if (noOptimizeOnSave) {
            if (deploymentFolderHasChanged) {
              this.trigger("modified", true);
            } else {
              this.trigger("modified", false);
            }
          }

        }

      });
    });
    return Landerds.LandersApp.RightSidebar.DeploymentOptionsView;
  });
