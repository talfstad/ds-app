define(["app",
    "tpl!/assets/js/apps/moonlander/landers/list/deployed/templates/deployed_domain_row.tpl"
  ],
  function(Moonlander, DeployedDomainRowTpl) {

    Moonlander.module("LandersApp.Landers.List.Deployed", function(Deployed, Moonlander, Backbone, Marionette, $, _) {
      Deployed.DeployedRowView = Marionette.ItemView.extend({
        
        initialize: function(){
          var me = this;

          //listen for destroy/change events to active jobs
          var activeJobsCollection = this.model.get("activeJobs");
          this.listenTo(activeJobsCollection, "change", function(){
            me.render();
          });
          this.listenTo(activeJobsCollection, "destroy", function(){
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
          "click .undeploy": "showUndeployLander"
        },

        onBeforeRender: function(){
          //if we have active jobs we are deploying
          if(this.model.get("activeJobs").length > 0 ) {
            this.model.set("deploy_status", "deploying");
          } else {
            this.model.set("deploy_status", "deployed");
          }
        },

        onRender: function() {
          this.trigger("updateParentLayout", this.model);

          var me = this;
          //add correct classname
          var deployStatus = this.model.get("deploy_status");
          this.$el.removeClass("success warning");
          if (deployStatus === "deployed") {
            this.$el.addClass("success");
          } else if (deployStatus === "deploying" ||
            deployStatus === "undeploying") {
            this.$el.addClass("warning");
          }
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
