define(["app",
    "tpl!assets/js/apps/landerds/groups/list/deployed_landers/templates/deployed_lander_row.tpl",
    "assets/js/apps/landerds/common/notification",
    "assets/js/apps/landerds/base_classes/deployed_rows/views/deployed_row_base_view",
    "select2"
  ],
  function(Landerds, DeployedLanderRowTpl, Notification, DeployedRowBaseView) {

    Landerds.module("GroupsApp.Groups.List.Deployed", function(Deployed, Landerds, Backbone, Marionette, $, _) {
      Deployed.DeployedRowView = DeployedRowBaseView.extend({

        template: DeployedLanderRowTpl,
        tagName: "tr",

        modelEvents: {
          "change:deploy_status": "render",
          "change:urlEndpoints": "render",
          "change:activeJobs": "render",
          "destroy:activeJobs": "render",
          "destroy:activeGroups": "render",
          "add:activeGroups": "render",
          "change:viewIndex": "updateViewIndex",
          "change:load_time_spinner_gui": "setLoadTimeSpinnerState"
        },

        events: {
          "click .undeploy": "showUndeployLander",
          "click .group-tab-link": "selectGroupsTab",
          "click .goto-edit-lander": "gotoEditLander",
          "click .copy-clipboard": function(e) {
            e.preventDefault();
            this.copyLinkToClipboard(this.getCurrentLink().link);
          }
        },

        gotoEditLander: function(e) {
          if (e) e.preventDefault();
          this.trigger("gotoEditLander");
        },

        onBeforeRender: function() {
          DeployedRowBaseView.prototype.onBeforeRender.apply(this);

        },

        onDestroy: function() {
          this.trigger("updateParentLayout", this.model);
        },

        onRender: function() {
          DeployedRowBaseView.prototype.onRender.apply(this);
        },

        showUndeployLander: function(e) {
          e.preventDefault();
          this.model.trigger("showUndeployLander", this.model);
        }
      });
    });
    return Landerds.GroupsApp.Groups.List.Deployed.DeployedRowView;
  });
