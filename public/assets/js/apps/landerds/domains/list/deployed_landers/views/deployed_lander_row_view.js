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
          "click .open-link": "openLanderLink",
          "click .goto-edit-lander": "gotoEditLander",
          "change .lander-links-select": "updateLoadTime",
          "click .get-load-time": "getLoadTime",
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
          DeployedRowBaseView.prototype.onRender.apply(this);
        },

        showUndeployLander: function(e) {
          e.preventDefault();
          
          this.trigger("undeployLander", this.model);
        }
      });
    });
    return Landerds.DomainsApp.Domains.List.Deployed.DeployedRowView;
  });
