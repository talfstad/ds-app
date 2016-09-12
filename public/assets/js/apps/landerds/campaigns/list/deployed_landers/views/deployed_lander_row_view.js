define(["app",
    "tpl!assets/js/apps/landerds/campaigns/list/deployed_landers/templates/deployed_lander_row.tpl",
    "assets/js/common/notification",
    "assets/js/apps/landerds/base_classes/deployed_rows/views/deployed_row_base_view",
    "select2"
  ],
  function(Landerds, DeployedLanderRowTpl, Notification, DeployedRowBaseView) {

    Landerds.module("CampaignsApp.Campaigns.List.Deployed", function(Deployed, Landerds, Backbone, Marionette, $, _) {
      Deployed.DeployedRowView = DeployedRowBaseView.extend({

        template: DeployedLanderRowTpl,
        tagName: "tr",

        modelEvents: {
          "change:deploy_status": "render",
          "change:urlEndpoints": "render",
          "change:activeJobs": "render",
          "destroy:activeJobs": "render",
          "destroy:activeCampaigns": "render",
          "add:activeCampaigns": "render",
          "change:load_time_spinner_gui": "setLoadTimeSpinnerState"
        },

        events: {
          "click .undeploy": "showUndeployLander",
          "click .campaign-tab-link": "selectCampaignTab",
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
          var me = this;
          DeployedRowBaseView.prototype.onBeforeRender.apply(this);
        },

        onDestroy: function() {
          this.trigger("updateParentLayout", this.model);
        },

        onRender: function() {
          DeployedRowBaseView.prototype.onRender.apply(this);
        },

        showRemoveLander: function(e) {
          e.preventDefault();
          this.model.trigger("showRemoveLander", this.model);
        }
      });
    });
    return Landerds.CampaignsApp.Campaigns.List.Deployed.DeployedRowView;
  });
