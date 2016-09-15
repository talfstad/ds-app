define(["app",
    "tpl!assets/js/apps/landerds/landers/list/active_groups/templates/active_group_row.tpl",
    "assets/js/apps/landerds/base_classes/deployed_rows/views/row_base_view"
  ],
  function(Landerds, ActiveGroupsRowTpl, RowBaseView) {

    Landerds.module("LandersApp.Landers.List.ActiveGroups", function(ActiveGroups, Landerds, Backbone, Marionette, $, _) {
      ActiveGroups.ActiveGroupsRowView = RowBaseView.extend({

        template: ActiveGroupsRowTpl,
        tagName: "tr",

        className: "group-name-row",

        events: {
          "click .remove-group": "showUndeployDomainFromGroupsDialog",
          "click .goto-edit-group": "gotoEditGroups",
        },

        modelEvents: {
          "change:viewIndex": "updateViewIndex",
          "change:deploy_status": "render"
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
    return Landerds.LandersApp.Landers.List.ActiveGroups.ActiveGroupsRowView;
  });
