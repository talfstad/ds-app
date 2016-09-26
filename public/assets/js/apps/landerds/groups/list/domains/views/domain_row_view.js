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
          DeployedRowBaseView.prototype.onBeforeRender.apply(this);
        },

        onRender: function() {
          DeployedRowBaseView.prototype.onRender.apply(this);
        },

        showUndeployDomain: function(e) {
          e.preventDefault();
          this.model.trigger("showUndeployDomain", this.model);
        }

      });
    });
    return Landerds.GroupsApp.Groups.List.Domain.DeployedDomainRowView;
  });
