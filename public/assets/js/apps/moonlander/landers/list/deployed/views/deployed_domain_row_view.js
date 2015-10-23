define(["app",
    "tpl!/assets/js/apps/moonlander/landers/list/deployed/templates/deployed_domain_row.tpl"
  ],
  function(Moonlander, DeployedDomainRowTpl) {

    Moonlander.module("LandersApp.Landers.List.Deployed", function(Deployed, Moonlander, Backbone, Marionette, $, _) {
      Deployed.DeployedRowView = Marionette.ItemView.extend({
        
        template: DeployedDomainRowTpl,
        tagName: "tr",
        className: "success",

        
        modelEvents: {
          "change": "updateDeployStatus"
        },

        events: {
          "click .undeploy": "showUndeployLander"
        },

        updateDeployStatus: function(){
          this.trigger("updateDeployStatus");          
        },

        onRender: function() {
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
