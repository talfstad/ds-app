define(["app",
    "tpl!/assets/js/apps/moonlander/landers/list/deployed/templates/child.tpl"
  ],
 function(Moonlander, ChildTpl, DomainModel) {

  Moonlander.module("LandersApp.Landers.List.Deployed", function(List, Moonlander, Backbone, Marionette, $, _) {
    List.ChildView = Marionette.ItemView.extend({
      template: ChildTpl,
      tagName: "tr",
      className: "success",

      modelEvents: {
        "change": "render"
      },

      events: {
        "click .undeploy": "showUndeployLander"
      },

      onRender: function() {
        //add correct classname
        var deployedStatus = this.model.get("deploy_status");
        this.$el.removeClass("success warning");
        if(deployedStatus === "deployed") {
          this.$el.addClass("success");
        } 
        else if(deployedStatus === "deploying" ||
                deployedStatus === "undeploying") {
          this.$el.addClass("warning");
        }
      },

      showUndeployLander: function(e){
        e.preventDefault();
        e.stopPropagation();

        Moonlander.trigger("landers:showUndeploy", this.model);
      },



    });
  });
  return Moonlander.LandersApp.Landers.List.Deployed.ChildView;
});
