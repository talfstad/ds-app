define(["app",
    "tpl!/assets/js/apps/moonlander/campaigns/list/deployed_landers/templates/deployed_lander_row.tpl"
  ],
  function(Moonlander, DeployedDomainRowTpl) {

    Moonlander.module("CampaignsApp.Campaigns.List.Deployed", function(Deployed, Moonlander, Backbone, Marionette, $, _) {
      Deployed.DeployedRowView = Marionette.ItemView.extend({

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

          //render on attached campaigns change/destroy. needs to be rendered because
          //changes the text
          var attachedCampaigns = this.model.get("attachedCampaigns");
          this.listenTo(attachedCampaigns, "destroy", function() {
            me.render();
          });
          this.listenTo(attachedCampaigns, "add", function() {
            me.render();
          });

        },

        template: DeployedDomainRowTpl,
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

          //add attached campaigns to template
          var attachedCampaignNamesArray = [];
          this.model.get("attachedCampaigns").each(function(campaign) {
            attachedCampaignNamesArray.push(campaign.get("name"));
          });
          this.model.set("attached_campaigns_gui", attachedCampaignNamesArray);
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
    return Moonlander.CampaignsApp.Campaigns.List.Deployed.DeployedRowView;
  });
