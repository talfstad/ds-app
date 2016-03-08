define(["app",
    "tpl!assets/js/apps/moonlander/campaigns/list/templates/landers_tab_handle.tpl"
  ],
  function(Moonlander, landersStatusTpl) {

    Moonlander.module("CampaignsApp.Campaigns.List.CollectionView.RowView", function(RowView, Moonlander, Backbone, Marionette, $, _) {
      RowView.LanderTabHandle = Marionette.ItemView.extend({
        className: "lander-status-tab-handle",
        tagName: "a",
        attributes: function() {
          return {
            "href": "#landers-tab-id-" + this.model.get("id"),
            "data-toggle": "tab"
          }
        },

        template: landersStatusTpl,

        modelEvents: {
          "change:deployed_landers_count": "render",
          "change:deploy_status": "render",
        },

        events: {
          "click .add-link-plus": "addNewLander"
        },

        addNewLander: function(e) {
          Moonlander.trigger("campaigns:showAddNewLander", this.model);
        },

        onRender: function() {
          var me = this;

          //on render show the plus if tab is active
          if(this.$el.parent().hasClass("active")){
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

          this.$el.on("shown.bs.tab", function(e) {
            me.trigger("reAlignHeader");
          });

        }

      });
    });
    return Moonlander.CampaignsApp.Campaigns.List.CollectionView.RowView.LanderTabHandle;
  });
