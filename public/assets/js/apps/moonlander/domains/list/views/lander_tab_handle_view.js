define(["app",
    "tpl!/assets/js/apps/moonlander/domains/list/templates/landers_tab_handle.tpl"
  ],
  function(Moonlander, landersStatusTpl) {

    Moonlander.module("DomainsApp.Domains.List", function(List, Moonlander, Backbone, Marionette, $, _) {
      List.DeployStatus = Marionette.ItemView.extend({
        className: "lander-status-tab-handle",
        tagName: "a",
        attributes: function() {
          return {
            "href": "#domains-tab-id-" + this.model.get("id"),
            "data-toggle": "tab"
          }
        },

        template: landersStatusTpl,

        modelEvents: {
          "change:active_landers_count": "render",
          "change:deploy_status": "render",
        },

        onRender: function() {
          var me = this;

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
    return Moonlander.DomainsApp.Domains.List.DeployStatus;
  });
