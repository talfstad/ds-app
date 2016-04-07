define(["app",
    "tpl!assets/js/apps/moonlander/landers/list/deployed_domains/templates/deployed_domain_row.tpl"
  ],
  function(Moonlander, DeployedDomainRowTpl) {

    Moonlander.module("LandersApp.Landers.List.Deployed", function(Deployed, Moonlander, Backbone, Marionette, $, _) {
      Deployed.DeployedRowView = Marionette.ItemView.extend({

        template: DeployedDomainRowTpl,
        tagName: "tr",

        events: {
          "click .remove-domain": "showRemoveDomain",
        },

        modelEvents: {
          "change": "render"
        },

        onDestroy: function() {
          this.trigger("updateParentLayout", this.model);
        },

        onBeforeRender: function() {

          var deployStatus = this.model.get("deploy_status");
          if (deployStatus === "deployed") {
            this.model.set("deploy_status_gui", "");
          } else if (deployStatus === "deploying") {
            this.model.set("deploy_status_gui", "<strong>DEPLOYING</strong>");
          } else if (deployStatus === "undeploying") {
            this.model.set("deploy_status_gui", "<strong>UNDEPLOYING</strong>");
          } else if(deployStatus === "modified"){
            this.model.set("deploy_status_gui", "<strong>MODIFIED</strong>");
          }

        },

        onRender: function() {
          var deployStatus = this.model.get("deploy_status");
          this.$el.removeClass("success alert warning");
          if (deployStatus === "deployed") {
            this.$el.addClass("success");
          } else if (deployStatus === "deploying" ||
            deployStatus === "undeploying") {
            this.$el.addClass("alert");
          } else if (deployStatus === "modified") {
            this.$el.addClass("warning");
          }

          this.trigger("updateParentLayout", this.model);

        },

        showRemoveDomain: function(e) {
          e.preventDefault();
          e.stopPropagation();

          this.model.trigger("showRemoveDomain", this.model);
        }
      });
    });
    return Moonlander.LandersApp.Landers.List.Deployed.DeployedRowView;
  });
