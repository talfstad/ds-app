define(["app",
    "tpl!assets/js/apps/landerds/domains/list/templates/landers_tab_handle.tpl"
  ],
  function(Landerds, landersStatusTpl) {

    Landerds.module("DomainsApp.Domains.List", function(List, Landerds, Backbone, Marionette, $, _) {
      List.DeployStatus = Marionette.ItemView.extend({
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
          "change:active_landers_count": "render",
          "change:deploy_status": "render",
        },

        events: {
          "click .add-link-plus": "deployNewLander"
        },

        deployNewLander: function(e) {
          Landerds.trigger("domains:showDeployNewLander", this.model);
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
            me.trigger("reAlignHeader")
          });

        }

      });
    });
    return Landerds.DomainsApp.Domains.List.DeployStatus;
  });
