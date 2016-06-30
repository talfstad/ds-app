define(["app",
    "tpl!assets/js/apps/landerds/campaigns/list/deployed_landers/templates/deployed_lander_row.tpl",
    "select2"
  ],
  function(Landerds, DeployedLanderRowTpl) {

    Landerds.module("CampaignsApp.Campaigns.List.CollectionView.RowView.DeployedLandersCollectionView", function(DeployedLandersCollectionView, Landerds, Backbone, Marionette, $, _) {
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

          var deployedDomainsCollection = this.model.get("deployedDomains");
          deployedDomainsCollection.on("add remove", function() {
            if (!me.isDestroyed) {
              me.render();
            }
          });

        },

        template: DeployedLanderRowTpl,
        tagName: "tr",

        modelEvents: {
          "change": "renderUnlessDeployStatusDeleting"
        },

        renderUnlessDeployStatusDeleting: function() {
          var deployStatus = this.model.get("deploy_status");
          if (deployStatus === "deleting") {
            this.disableAccordionPermanently();
          } else {
            this.render();
          }
        },

        events: {
          "click .remove-lander": "showRemoveLander",
          "click .open-link": "openLanderLink",
          "click .copy-clipboard": function() {
            this.copyLinkToClipboard(this.getCurrentLink());
          }
        },

        getCurrentLink: function() {
          //return the combination of selects
          var linkVal = this.$el.find(".domain-select").val();
          var endpointVal = this.$el.find(".lander-endpoint-select").val();
          return "http://" + linkVal;
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
          }

          this.model.set("deployed_domains_gui", this.model.attributes.deployedDomains.toJSON());

        },

        onDestroy: function() {
          this.trigger("updateParentLayout", this.model);
        },

        onRender: function() {
          var me = this;
          var deployStatus = this.model.get("deploy_status");
          this.$el.removeClass("success alert warning");
          if (deployStatus === "deployed") {
            this.$el.addClass("success");
          } else if (deployStatus === "deploying" ||
            deployStatus === "undeploying" ||
            deployStatus === "invalidating_delete" ||
            deployStatus === "invalidating" ||
            deployStatus === "optimizing") {
            this.$el.addClass("alert");
          }

          if (this.model.get("modified")) {
            this.$el.addClass("warning");
          }

          this.$el.find(".domain-select").select2();
          this.$el.find(".lander-endpoint-select").select2();

          this.trigger("updateParentLayout", this.model);

        },

        showRemoveLander: function(e) {
          e.preventDefault();
          e.stopPropagation();

          this.model.trigger("showRemoveLander", this.model);
        }
      });
    });
    return Landerds.CampaignsApp.Campaigns.List.CollectionView.RowView.DeployedLandersCollectionView.DeployedLanderRowView;
  });
