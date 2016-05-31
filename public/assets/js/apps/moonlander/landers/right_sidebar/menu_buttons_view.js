define(["app",
    "tpl!assets/js/apps/moonlander/landers/right_sidebar/templates/menu_buttons.tpl",
    "/assets/js/common/notification.js"
  ],
  function(Moonlander, MenuButtonsTpl, Notification) {

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

        updateOriginalValues: function() {
          this.model.set("originalValueDeployRoot", this.model.get("deploy_root"));
          this.model.set("originalValueDeploymentFolderName", this.model.get("deployment_folder_name"));
        },

        save: function() {
          //save if deployment folder is valid
          if (!this.model.get("deploymentFolderInvalid")) {
            this.model.set("modified", false);
            this.updateOriginalValues();
            this.trigger("save");
          }
        },

        redeploy: function(e) {
          var me = this;
          e.preventDefault();
          if (!this.model.get("deploymentFolderInvalid")) {
            this.model.set({
              "deploy_status": "redeploying",
              "modified": false
            });
            this.updateOriginalValues();
            Moonlander.trigger("landers:redeploy", this.model);
          } else {
            Notification("Invalid Deployment Folder", "Fix deployment folder name", "danger", "stack_top_right");
          }
        },

        onRender: function(){
          this.$el.find(".tool-tip").tooltip();
          
        }

      });
    });
    return Moonlander.LandersApp.RightSidebar.MenuButtonsView;
  });
