define(["app",
    "tpl!assets/js/apps/landerds/landers/list/deployed_domains/templates/deployed_domain_row.tpl",
    "assets/js/apps/landerds/base_classes/deployed_rows/views/deployed_row_base_view"
  ],
  function(Landerds, DeployedDomainRowTpl, DeployedRowBaseView) {

    Landerds.module("LandersApp.Landers.List.Deployed", function(Deployed, Landerds, Backbone, Marionette, $, _) {
      Deployed.DeployedRowView = DeployedRowBaseView.extend({

        template: DeployedDomainRowTpl,
        tagName: "tr",

        events: {
          "click .undeploy": "showRemoveDomain",
          "click .campaign-tab-link": "selectCampaignTab",
          "click .open-link": "openLanderLink",
          "change .lander-links-select": "updateLoadTime",
          "click .get-load-time": "getLoadTime",
          "click .goto-edit-domain": "gotoEditDomain",
          "click .copy-clipboard": function(e) {
            e.preventDefault();
            this.copyLinkToClipboard(this.getCurrentLink().link);
          }
        },

        modelEvents: {
          "change:deploy_status": "render",
          "change:load_time_spinner_gui": "setLoadTimeSpinnerState"
        },

        gotoEditDomain: function(e) {
          if (e) e.preventDefault();
          this.trigger("gotoEditDomain");
        },

        onBeforeRender: function() {
          var me = this;

          urlEndpoints = this.model.get("urlEndpoints");
          var urlEndpointsJSON;
          if (urlEndpoints) {
            urlEndpointsJSON = urlEndpoints.toJSON();
          } else {
            urlEndpointsJSON = [];
          }
          this.model.set("urlEndpointsJSON", urlEndpointsJSON);

          var deployStatus = this.model.get("deploy_status");
          if (deployStatus === "deployed") {
            this.model.set("deploy_status_gui", "");
          } else if (deployStatus === "deploying") {
            this.model.set("deploy_status_gui", "<strong>DEPLOYING</strong>");
          } else if (deployStatus === "undeploying") {
            this.model.set("deploy_status_gui", "<strong>UNDEPLOYING</strong>");
          } else if (deployStatus === "invalidating") {
            this.model.set("deploy_status_gui", "<strong>PUSHING TO EDGE LOCATIONS</strong>");
          } else if (deployStatus === "invalidating_delete") {
            this.model.set("deploy_status_gui", "<strong>REMOVING FROM EDGE LOCATIONS</strong>");
          } else if (deployStatus === "optimizing") {
            this.model.set("deploy_status_gui", "<strong>OPTIMIZING</strong>");
          } else if (deployStatus === "redeploying") {
            this.model.set("deploy_status_gui", "<strong>REDEPLOYING</strong>");
          }

          var activeCampaignCollection = this.model.get("activeCampaignCollection");

          activeCampaignCollection.each(function(campaign) {

            var deployedDomains = campaign.get('deployedDomains');

            var domainId = me.model.get("domain_id");

            if (deployedDomains.find(function(m) {
                var id = m.domain_id || m.id;
                return id == domainId
              })) {
              me.model.set("hasActiveCampaigns", true);
            }
          });
        },

        onRender: function() {
          this.baseClassOnRender();
        },

        showRemoveDomain: function(e) {
          e.preventDefault();
          e.stopPropagation();

          this.model.trigger("showRemoveDomain", this.model);
        }
      });
    });
    return Landerds.LandersApp.Landers.List.Deployed.DeployedRowView;
  });
