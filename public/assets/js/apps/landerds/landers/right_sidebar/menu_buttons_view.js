define(["app",
    "tpl!assets/js/apps/landerds/landers/right_sidebar/templates/menu_buttons.tpl",
    "assets/js/apps/landerds/common/notification"
  ],
  function(Landerds, MenuButtonsTpl, Notification) {

    Landerds.module("LandersApp.RightSidebar", function(RightSidebar, Landerds, Backbone, Marionette, $, _) {
      RightSidebar.MenuButtonsView = Marionette.ItemView.extend({

        template: MenuButtonsTpl,

        className: "btn-group",

        events: {
          'click .redeploy-all-locations': "redeploy",
          'click .save-button': "save"
          // 'click .edit-button': "edit"
        },

        modelEvents: {
          "change:deploy_status": "render",
          "change:modified": "render",
          "change:deploymentFolderInvalid": "render",
          "change:saving_lander": "render",
          "sidebar:renderMenuButtons": "render"
        },

        updateOriginalValues: function() {
          this.model.set("originalValueDeployRoot", this.model.get("deploy_root"));
          this.model.set("originalValueDeploymentFolderName", this.model.get("deployment_folder_name"));
        },

        edit: function(e) {
          var me = this;
          if (e) e.preventDefault();
          
          Landerds.trigger("landers:showEdit", this.model);
        },

        save: function(e) {
          var me = this;
          if (e) e.preventDefault();
          if (!this.model.get("deploymentFolderInvalid")) {

            this.model.set({
              saving_lander: true
            });

            this.updateOriginalValues();
            Landerds.trigger("landers:save", this.model);
          } else {
            Notification("Invalid Deployment Folder", "Fix deployment folder name", "danger", "stack_top_right");
          }
        },

        redeploy: function(e) {
          var me = this;
          if (e) e.preventDefault();
          if (!this.model.get("deploymentFolderInvalid")) {

            this.model.set({
              saving_lander: true
            });

            this.updateOriginalValues();
            Landerds.trigger("landers:redeploy", this.model);
          } else {
            Notification("Invalid Deployment Folder", "Fix deployment folder name", "danger", "stack_top_right");
          }
        },

        onBeforeRender: function() {
          //if at least one and it isnt undeploying showSaveButton is false            
          var showSaveButtonGui = true,
            allUndeploying = true;

          //show save button if there are no deployed domains OR if they are ALL undeploying

          //all not undeploying = !allUndeploying

          var deployedDomains = this.model.get("deployedDomains");
          deployedDomains.each(function(deployedDomain) {
            var activeJobs = deployedDomain.get("activeJobs");

            if (activeJobs.length > 0) {
              activeJobs.each(function(activeJob) {
                if (activeJob.get("action") != "undeployLanderFromDomain") {
                  allUndeploying = false;
                }
              });
            } else {
              allUndeploying = false;
            }
          });

          //if at least one isnt undeploying then show deploy, otherwise show save
          if (allUndeploying || deployedDomains.length <= 0) {
            showSaveButtonGui = true;
          } else {
            showSaveButtonGui = false;
          }
          this.model.set("showSaveButtonGui", showSaveButtonGui);



          var saveDeployEnabledGui = false;

          //allow save/deploy if modified AND not saving_lander AND not invalid deployment folder
          var savingLander = this.model.get("saving_lander");
          var modified = this.model.get("modified");
          var deploymentFolderInvalid = this.model.get("deploymentFolderInvalid");

          if (modified && !deploymentFolderInvalid && !savingLander) {
            saveDeployEnabledGui = true;
          }

          this.model.set("saveDeployEnabledGui", saveDeployEnabledGui);
        },

        onRender: function() {
          this.$el.find(".tool-tip").tooltip();

        }

      });
    });
    return Landerds.LandersApp.RightSidebar.MenuButtonsView;
  });
