define(["app",
    "tpl!assets/js/apps/landerds/groups/list/domains/templates/domain_row.tpl",
    "assets/js/apps/landerds/base_classes/deployed_rows/views/deployed_row_base_view"
  ],
  function(Landerds, DeployedDomainRowTpl, DeployedRowBaseView) {

    Landerds.module("GroupsApp.Groups.List.Domain", function(Domain, Landerds, Backbone, Marionette, $, _) {
      Domain.DeployedDomainRowView = DeployedRowBaseView.extend({

        template: DeployedDomainRowTpl,
        tagName: "tr",

        events: {
          "click .undeploy-domain": "showUndeployDomain",
          "click .goto-edit-domain": "gotoEditDomain",
        },

        modelEvents: {
          "change:viewIndex": "updateViewIndex",
          "change:deploy_status": "render"
        },

        gotoEditDomain: function(e) {
          if (e) e.preventDefault();
          this.trigger("gotoEditDomain");
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
          }

          if (this.model.get("modified")) {
            this.$el.removeClass("success alert warning");
            this.$el.addClass("warning");
          }

          this.trigger("updateParentLayout", this.model);

        },

        showUndeployDomain: function(e) {
          e.preventDefault();
          e.stopPropagation();

          this.model.trigger("showUndeployDomain", this.model);
        }

      });
    });
    return Landerds.GroupsApp.Groups.List.Domain.DeployedDomainRowView;
  });
