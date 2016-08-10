define(["app",
    "tpl!assets/js/apps/landerds/domains/list/deployed_landers/templates/deployed_lander_row.tpl",
    "assets/js/apps/landerds/base_classes/deployed_rows/views/deployed_row_base_view",
    "assets/js/common/notification",
    "select2"
  ],
  function(Landerds, DeployedDomainRowTpl, DeployedRowBaseView, Notification) {

    Landerds.module("DomainsApp.Domains.List.Deployed", function(Deployed, Landerds, Backbone, Marionette, $, _) {
      Deployed.DeployedRowView = DeployedRowBaseView.extend({

        template: DeployedDomainRowTpl,
        tagName: "tr",

        modelEvents: {
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
          "click .open-link": "openLanderLink",
          "change .lander-links-select": "updateLoadTime",
          "click .get-load-time": "getLoadTime",
          "click .copy-clipboard": function(e) {
            e.preventDefault();
            this.copyLinkToClipboard(this.getCurrentLink().link);
          }
        },

        
        onBeforeRender: function() {
          var me = this;
          var deployStatus = this.model.get("deploy_status");
          if (deployStatus === "deployed") {
            this.model.set("deploy_status_gui", "");
          } else if (deployStatus === "deploying") {
            this.model.set("deploy_status_gui", "<strong>DEPLOYING</strong>");
          } else if (deployStatus === "undeploying") {
            this.model.set("deploy_status_gui", "<strong>UNDEPLOYING</strong>");
          } else if (deployStatus === "invalidating_delete") {
            this.model.set("deploy_status_gui", "<strong>REMOVING FROM EDGE LOCATIONS</strong>");
          } else if (deployStatus === "invalidating") {
            this.model.set("deploy_status_gui", "<strong>PUSHING TO EDGE LOCATIONS</strong>");
          } else if (deployStatus === "optimizing") {
            this.model.set("deploy_status_gui", "<strong>OPTIMIZING</strong>");
          }

          var activeCampaignCollection = this.model.get("activeCampaignCollection");

          activeCampaignCollection.each(function(campaign) {

            var deployedLanders = campaign.get('deployedLanders');

            var landerId = me.model.get("lander_id");

            if (deployedLanders.find(function(m) {
                var id = m.lander_id || m.id;
                return id == landerId
              })) {
              me.model.set("hasActiveCampaigns", true);
            }
          });
        },

        onRender: function() {
          this.baseClassOnRender();
        },

        showUndeployLander: function(e) {
          e.preventDefault();
          e.stopPropagation();

          Landerds.trigger("domains:showUndeployLander", this.model);
        }
      });
    });
    return Landerds.DomainsApp.Domains.List.Deployed.DeployedRowView;
  });
