define(["app",
    "tpl!assets/js/apps/landerds/landers/list/templates/campaign_tab_handle.tpl"
  ],
  function(Landerds, campaignTabHandleTpl) {

    Landerds.module("LandersApp.Landers.List", function(List, Landerds, Backbone, Marionette, $, _) {
      List.DeployStatus = Marionette.ItemView.extend({
        className: "campaign-status-tab-handle",
        tagName: "a",
        attributes: function() {
          return {
            "href": "#campaigns-tab-id-" + this.model.get("id"),
            "data-toggle": "tab"
          }
        },

        template: campaignTabHandleTpl,

        modelEvents: {
          "change:active_campaigns_count": "render",
        },

        events: {
          "click .add-link-plus": "addNewCampaign"
        },

        addNewCampaign: function() {
          Landerds.trigger("landers:showAddNewCampaign", this.model);
        },

        onRender: function() {
          var me = this;

          //on render show the plus if tab is active
          if (this.$el.parent().hasClass("active")) {
            me.$el.find(".add-link-plus").css("display", "inline");
          }

          //remove tab capability if deleting
          if (this.model.get("deploy_status") === "deleting") {
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