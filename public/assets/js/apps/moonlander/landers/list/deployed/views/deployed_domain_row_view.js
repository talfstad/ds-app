define(["app",
    "tpl!/assets/js/apps/moonlander/landers/list/deployed/templates/deployed_domain_row.tpl"
  ],
  function(Moonlander, DeployedDomainRowTpl) {

    Moonlander.module("LandersApp.Landers.List.Deployed", function(Deployed, Moonlander, Backbone, Marionette, $, _) {
      Deployed.DeployedRowView = Marionette.ItemView.extend({
        
        template: DeployedDomainRowTpl,
        tagName: "tr",
        className: "success",

        initialize: function(){
          this.model.startActiveJobs();
        },

        modelEvents: {
          "change": "render"
        },

        events: {
          "click .undeploy": "showUndeployLander"
        },

        onRender: function() {
          this.trigger("updateParentLayout");

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
        },



      });
    });
    return Moonlander.LandersApp.Landers.List.Deployed.DeployedRowView;
  });
