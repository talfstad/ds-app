define(["app",
    "tpl!/assets/js/apps/moonlander/landers/list/deployed/templates/empty.tpl"
  ],
  function(Moonlander, DeployedDomainRowEmptyTpl) {

    Moonlander.module("LandersApp.Landers.List.Deployed", function(Deployed, Moonlander, Backbone, Marionette, $, _) {
      Deployed.DeployedRowEmptyView = Marionette.ItemView.extend({
        
        template: DeployedDomainRowEmptyTpl
        tagName: "tr",
        className: "warning",

        
     

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
        }

      });
    });
    return Moonlander.LandersApp.Landers.List.Deployed.DeployedRowEmptyView;
  });
