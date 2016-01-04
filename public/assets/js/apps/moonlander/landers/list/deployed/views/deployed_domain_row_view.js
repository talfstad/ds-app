define(["app",
    "tpl!/assets/js/apps/moonlander/landers/list/deployed/templates/deployed_domain_row.tpl"
  ],
  function(Moonlander, DeployedDomainRowTpl) {

    Moonlander.module("LandersApp.Landers.List.Deployed", function(Deployed, Moonlander, Backbone, Marionette, $, _) {
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
        className: "success",

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
          //if we have active jobs we are deploying
          // if (this.model.get("activeJobs").length > 0) {
          //   var deployStatus = "deploying";
          //   this.model.get("activeJobs").each(function(job) {
          //     if (job.get("action") === "undeployLanderFromDomain") {
          //       deployStatus = "undeploying";
          //     }
          //   });

          //   this.model.set("deploy_status", deployStatus);
          // } else {
          //   this.model.set("deploy_status", "deployed");
          // }

          //set deploystatus for gui
          var deployStatus = this.model.get("deploy_status");
          if (deployStatus === "deployed") {
            this.model.set("deploy_status_gui", "");
          } else if (deployStatus === "deploying") {
            this.model.set("deploy_status_gui", "<strong>DEPLOYING</strong> &mdash;");
          } else if (deployStatus === "undeploying") {
            this.model.set("deploy_status_gui", "<strong>UNDEPLOYING</strong> &mdash;");
          } else if (deployStatus === "modified") {
            this.model.set("deploy_status_gui", "<strong>MODIFIED</strong> &mdash;");
          }

          //add attached campaigns to template
          var attachedCampaignNamesArray = [];
          this.model.get("attachedCampaigns").each(function(campaign) {
            attachedCampaignNamesArray.push(campaign.get("name"));
          });
          this.model.set("attached_campaigns_gui", attachedCampaignNamesArray);
        },

        onRender: function() {
          var me = this;
          //add correct classname
          var deployStatus = this.model.get("deploy_status");
          this.$el.removeClass("success alert warning");
          if (deployStatus === "deployed") {
            this.$el.addClass("success");
          } else if (deployStatus === "deploying" ||
            deployStatus === "undeploying") {
            this.$el.addClass("alert");
          } else if(deployStatus === "modified") {
            this.$el.addClass("warning");
          }

          this.$el.find(".domain-link").click(function(e) {
            //get the val from select box
            var domainEndpointSelectValue = $(e.currentTarget).parent().find("select").val();
            var domainLinkHref = $(e.currentTarget).text();
            //go to the full page
            $(e.currentTarget).attr("href", "http://" + domainLinkHref + domainEndpointSelectValue);
          });

          this.$el.find(".domain-link").hover(function(e) {
            //get next select
            var domainEndpointSelect = $(e.currentTarget).parent().find("select");

            //underline it or undo underline if already applied
            if (domainEndpointSelect.hasClass("domain-link-hover")) {
              domainEndpointSelect.removeClass("domain-link-hover");
            } else {
              domainEndpointSelect.addClass("domain-link-hover");
            }
          });
        },

        showUndeployLander: function(e) {
          e.preventDefault();
          e.stopPropagation();

          Moonlander.trigger("landers:showUndeploy", this.model);
        }
      });
    });
    return Moonlander.LandersApp.Landers.List.Deployed.DeployedRowView;
  });
