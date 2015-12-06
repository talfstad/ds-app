define(["app",
    "tpl!/assets/js/apps/moonlander/landers/list/templates/deploy_status_tab_handle.tpl"
  ],
  function(Moonlander, deployStatusTpl) {

    Moonlander.module("LandersApp.Landers.List", function(List, Moonlander, Backbone, Marionette, $, _) {
      List.DeployStatus = Marionette.ItemView.extend({

        tagName: "a",
        attributes: function() {
          return {
            "href": "#domains-tab-id-" + this.model.get("id"),
            "data-toggle": "tab"
          }
        },
        template: deployStatusTpl,


        modelEvents: {
          "change": "render"
        },
        
        onRender: function() {
          //remove tab capability if deleting
          if (this.model.get("deploy_status") === "deleting") {
            this.$el.removeAttr("data-toggle");

          }

          this.$el.click(function(e){
            e.preventDefault();
          });

        }


      });
    });
    return Moonlander.LandersApp.Landers.List.DeployStatus;
  });
