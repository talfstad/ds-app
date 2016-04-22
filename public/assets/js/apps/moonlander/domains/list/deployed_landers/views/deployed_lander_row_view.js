define(["app",
    "tpl!assets/js/apps/moonlander/domains/list/deployed_landers/templates/deployed_lander_row.tpl",
    "select2"
  ],
  function(Moonlander, DeployedDomainRowTpl) {

    Moonlander.module("DomainsApp.Domains.List.Deployed", function(Deployed, Moonlander, Backbone, Marionette, $, _) {
      Deployed.DeployedRowView = Marionette.ItemView.extend({

        template: DeployedDomainRowTpl,
        tagName: "tr",

        modelEvents: {
          "change": "render",
          "change:activeJobs": "render",
          "destroy:activeJobs": "render",
          "destroy:activeCampaigns": "render",
          "add:activeCampaigns": "render"
        },

        events: {
          "click .undeploy": "showUndeployLander",
          "click .campaign-tab-link": "selectCampaignTab",
          "click .open-link": "openLanderLink",
          "click .copy-clipboard": function(e) {
            e.preventDefault();
            this.copyLinkToClipboard(this.getCurrentLink());
          }
        },

        getCurrentLink: function() {
          //return the combination of selects
          var endpointVal = this.$el.find(".lander-links-select").val();
          return "http://" + endpointVal;
        },

        openLanderLink: function() {
          window.open(this.getCurrentLink(), '_blank');
          return false;
        },

        copyLinkToClipboard: function(text) {

          var textArea = $("<textarea></textarea>");

          // Place in top-left corner of screen regardless of scroll position.
          textArea.css("position", "fixed");
          textArea.css("top", "0");
          textArea.css("left", "0");

          // Ensure it has a small width and height. Setting to 1px / 1em
          // doesn't work as this gives a negative w/h on some browsers.
          textArea.css("width", "2em");
          textArea.css("height", "2em");

          // We don't need padding, reducing the size if it does flash render.
          textArea.css("padding", "0");

          // Clean up any borders.
          textArea.css("border", "none");
          textArea.css("outline", "none");
          textArea.css("boxShadow", "none");

          // Avoid flash of white box if rendered for any reason.
          textArea.css("background", "transparent");
          textArea.text(text);

          $("body").append(textArea);

          textArea.select();

          try {
            var successful = document.execCommand('copy');
          } catch (err) {}

          textArea.remove();
          return false;
        },

        selectCampaignTab: function(e) {
          e.preventDefault();
          this.trigger("selectCampaignTab");
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

        onDestroy: function() {
          this.trigger("updateParentLayout", this.model);
        },

        onRender: function() {

          this.$el.find(".lander-links-select").select2();


          var deployStatus = this.model.get("deploy_status");
          this.$el.removeClass("success alert warning");
          if (deployStatus === "deployed") {
            this.$el.addClass("success");
          } else if (deployStatus === "deploying" ||
            deployStatus === "undeploying" ||
            deployStatus === "invalidating_delete" ||
            deployStatus === "optimizing" ||
            deployStatus === "invalidating") {
            this.$el.addClass("alert");
          }

          if (this.model.get("modified")) {
            this.$el.removeClass("success alert warning");
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
    return Moonlander.DomainsApp.Domains.List.Deployed.DeployedRowView;
  });
