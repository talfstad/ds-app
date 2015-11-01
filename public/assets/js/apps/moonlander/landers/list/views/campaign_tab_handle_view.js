define(["app",
    "tpl!/assets/js/apps/moonlander/landers/list/templates/campaign_tab_handle.tpl"
  ],
 function(Moonlander, campaignTabHandleTpl) {

  Moonlander.module("LandersApp.Landers.List", function(List, Moonlander, Backbone, Marionette, $, _) {
    List.DeployStatus = Marionette.ItemView.extend({
      className: "campaign-status-tab-handle",
      tagName: "a",
      attributes: function(){
        return {
          "href":"#campaigns-tab-id-" + this.model.get("id"),
          "data-toggle":"tab"
        }
      },
      template: campaignTabHandleTpl,

      modelEvents: {
      	"change": "render"
      }
    });
  });
  return Moonlander.LandersApp.Landers.List.DeployStatus;
});