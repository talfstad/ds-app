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
          
          DeployedRowBaseView.prototype.onBeforeRender.apply(this);

          var activeCampaignCollection = this.model.get("activeCampaigns");

          var hasActiveCampaigns = false;
          if (activeCampaignCollection.length > 0) {
            activeCampaignCollection.each(function(campaign) {

              var campaignDomains = campaign.get('domains');

              var domainId = me.model.get("domain_id");

              if (campaignDomains.find(function(m) {
                  var id = m.domain_id || m.id;
                  return id == domainId;
                })) {
                hasActiveCampaigns = true;
              }
            });
          }

          me.model.set("hasActiveCampaigns", hasActiveCampaigns);
        },

        onRender: function() {
          DeployedRowBaseView.prototype.onRender.apply(this);
        },

        showRemoveDomain: function(e) {
          e.preventDefault();

          this.trigger("showRemoveDomain", this.model);
        }
      });
    });
    return Landerds.LandersApp.Landers.List.Deployed.DeployedRowView;
  });
