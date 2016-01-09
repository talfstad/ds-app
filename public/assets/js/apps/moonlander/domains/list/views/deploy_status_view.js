define(["app",
    "tpl!/assets/js/apps/moonlander/domains/list/templates/deploy_status_tab_handle.tpl"
  ],
  function(Moonlander, deployStatusTpl) {

    Moonlander.module("DomainsApp.Domains.List", function(List, Moonlander, Backbone, Marionette, $, _) {
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
          "change:deploy_status": "render"
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
    return Moonlander.DomainsApp.Domains.List.DeployStatus;
  });
