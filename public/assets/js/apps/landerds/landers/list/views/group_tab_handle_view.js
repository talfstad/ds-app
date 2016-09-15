define(["app",
    "tpl!assets/js/apps/landerds/landers/list/templates/group_tab_handle.tpl"
  ],
  function(Landerds, groupTabHandleTpl) {

    Landerds.module("LandersApp.Landers.List", function(List, Landerds, Backbone, Marionette, $, _) {
      List.DeployStatus = Marionette.ItemView.extend({
        className: "group-status-tab-handle",
        tagName: "a",
        attributes: function() {
          return {
            "href": "#groups-tab-id-" + this.model.get("id"),
            "data-toggle": "tab"
          }
        },

        template: groupTabHandleTpl,

        modelEvents: {
          "change:active_groups_count": "render",
        },

        events: {
          "click .add-link-plus": "addNewGroups"
        },

        addNewGroups: function() {
          Landerds.trigger("landers:showAddNewGroups", this.model);
        },

        onRender: function() {
          var me = this;

          //on render show the plus if tab is active
          if (this.$el.parent().hasClass("active")) {
            me.$el.find(".add-link-plus").css("display", "inline");
          }

          //remove tab capability if deleting
          var deployStatus = this.model.get("deploy_status");
          var rootDeployStatus = deployStatus.split(":")[0];
          if (rootDeployStatus === "deleting" || rootDeployStatus == "initializing") {
            this.$el.removeAttr("data-toggle");
          }

          this.$el.click(function(e) {
            e.preventDefault();
          });

          this.$el.on("hide.bs.tab", function(e) {
            me.$el.find(".add-link-plus").hide();
          });

          this.$el.on("show.bs.tab", function(e) {
            me.$el.find(".add-link-plus").css("display", "inline");
          });

        }
      });
    });
    return Landerds.LandersApp.Landers.List.DeployStatus;
  });
