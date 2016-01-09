define(["app",
    "tpl!/assets/js/apps/moonlander/domains/list/templates/campaign_tab_handle.tpl"
  ],
  function(Moonlander, campaignTabHandleTpl) {

    Moonlander.module("DomainsApp.Domains.List", function(List, Moonlander, Backbone, Marionette, $, _) {
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

        onRender: function() {
          //remove tab capability if deleting
          if (this.model.get("deploy_status") === "deleting") {
            this.$el.removeAttr("data-toggle");
          }

          this.$el.click(function(e) {
            e.preventDefault();
          });

        },

        modelEvents: {
          "change": "render"
        }
      });
    });
    return Moonlander.DomainsApp.Domains.List.DeployStatus;
  });