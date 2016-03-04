define(["app",
    "tpl!/assets/js/apps/moonlander/campaigns/list/deployed_landers/templates/deployed_lander_row.tpl"
  ],
  function(Moonlander, DeployedLanderRowTpl) {

    Moonlander.module("CampaignsApp.Campaigns.List.CollectionView.RowView.DeployedLandersCollectionView", function(DeployedLandersCollectionView, Moonlander, Backbone, Marionette, $, _) {
      DeployedLandersCollectionView.DeployedLanderRowView = Marionette.ItemView.extend({

        initialize: function() {
          var me = this;

          //listen for destroy/change events to active jobs
          var activeJobsCollection = this.model.get("activeJobs");
          this.listenTo(activeJobsCollection, "change", function() {
            me.render();
          });
          this.listenTo(activeJobsCollection, "destroy", function() {
            me.render();
          });

        },

        template: DeployedLanderRowTpl,
        tagName: "tr",

        modelEvents: {
          "change": "render"
        },

        events: {
          "click .undeploy": "showUndeployLander",
          "click .campaign-tab-link": "selectCampaignTab"
        },

        selectCampaignTab: function(e) {
          e.preventDefault();
          this.trigger("selectCampaignTab");
        },

        onBeforeRender: function() {

          var deployStatus = this.model.get("deploy_status");
          if (deployStatus === "deployed") {
            this.model.set("deploy_status_gui", "");
          } else if (deployStatus === "deploying") {
            this.model.set("deploy_status_gui", "<strong>DEPLOYING</strong>");
          } else if (deployStatus === "undeploying") {
            this.model.set("deploy_status_gui", "<strong>UNDEPLOYING</strong>");
          }

        },

        onDestroy: function() {
          this.trigger("updateParentLayout", this.model);
        },

        onRender: function() {
          var deployStatus = this.model.get("deploy_status");
          this.$el.removeClass("success alert warning");
          if (deployStatus === "deployed") {
            this.$el.addClass("success");
          } else if (deployStatus === "deploying" ||
            deployStatus === "undeploying") {
            this.$el.addClass("alert");
          } else if (deployStatus === "modified") {
            this.$el.addClass("warning");
          }

          this.trigger("updateParentLayout", this.model);

        },

        showUndeployLander: function(e) {
          e.preventDefault();
          e.stopPropagation();

          Moonlander.trigger("domains:showUndeployLander", this.model);
        }
      });
    });
    return Moonlander.CampaignsApp.Campaigns.List.CollectionView.RowView.DeployedLandersCollectionView.DeployedLanderRowView;
  });
