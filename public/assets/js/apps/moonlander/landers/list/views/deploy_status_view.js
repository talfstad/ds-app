define(["app",
    "tpl!/assets/js/apps/moonlander/landers/list/templates/deploy_status.tpl"
  ],
 function(Moonlander, deployStatusTpl) {

  Moonlander.module("LandersApp.Landers.List", function(List, Moonlander, Backbone, Marionette, $, _) {
    List.DeployStatus = Marionette.ItemView.extend({
      tagName: "li",
      template: deployStatusTpl,

      modelEvents: {
      	"change": "render"
      }
    });
  });
  return Moonlander.LandersApp.Landers.List.DeployStatus;
});