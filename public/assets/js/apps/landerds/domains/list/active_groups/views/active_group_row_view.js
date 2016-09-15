define(["app",
    "tpl!assets/js/apps/landerds/domains/list/active_groups/templates/active_group_row.tpl",
    "assets/js/apps/landerds/base_classes/deployed_rows/views/row_base_view"
  ],
  function(Landerds, ActiveGroupsRowTpl, RowBaseView) {

    Landerds.module("DomainsApp.Domains.List.ActiveGroups", function(ActiveGroups, Landerds, Backbone, Marionette, $, _) {
      ActiveGroups.ActiveGroupsRowView = RowBaseView.extend({

        template: ActiveGroupsRowTpl,
        tagName: "tr",

        className: "group-name-row",

        events: {
          "click .remove-group": "showUndeployDomainFromGroupsDialog",
          "click .goto-edit-group": "gotoEditGroups",
        },

        modelEvents: {
          "change:deploy_status": "render",
          "change:viewIndex": "updateViewIndex"
        },

        gotoEditGroups: function(e) {
          if (e) e.preventDefault();
          this.trigger("gotoEditGroups");
        },

        showUndeployDomainFromGroupsDialog: function(e) {
          e.preventDefault();
          this.model.trigger("showUndeployDomainFromGroupsDialog", this.model);
        },

        onBeforeRender: function() {

        },

        onRender: function() {
          RowBaseView.prototype.onRender.apply(this);
        }

      });
    });
    return Landerds.DomainsApp.Domains.List.ActiveGroups.ActiveGroupsRowView;
  });
