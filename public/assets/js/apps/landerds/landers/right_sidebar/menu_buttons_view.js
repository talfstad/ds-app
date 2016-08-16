define(["app",
    "tpl!assets/js/apps/landerds/landers/right_sidebar/templates/menu_buttons.tpl",
    "assets/js/common/notification"
  ],
  function(Landerds, MenuButtonsTpl, Notification) {

    Landerds.module("LandersApp.RightSidebar", function(RightSidebar, Landerds, Backbone, Marionette, $, _) {
      RightSidebar.MenuButtonsView = Marionette.ItemView.extend({

        template: MenuButtonsTpl,

        className: "btn-group",

        events: {
          'click .redeploy-all-locations': "redeploy",
          'click .save-button': "save"
        },

        modelEvents: {
          "change:deploy_status": "render",
          "change:modified": "render",
          "change:deploymentFolderInvalid": "render",
          "change:saving_lander": "render"
        },

        updateOriginalValues: function() {
          this.model.set("originalValueDeployRoot", this.model.get("deploy_root"));
          this.model.set("originalValueDeploymentFolderName", this.model.get("deployment_folder_name"));
        },

        save: function() {
          //save if deployment folder is valid
          if (!this.model.get("deploymentFolderInvalid")) {
            this.model.set("saving_lander", true);
            this.updateOriginalValues();
            this.trigger("save");
          }
        },

        redeploy: function(e) {
          var me = this;
          e.preventDefault();
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
