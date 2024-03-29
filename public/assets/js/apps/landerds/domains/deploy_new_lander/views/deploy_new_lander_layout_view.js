define(["app",
    "tpl!assets/js/apps/landerds/domains/deploy_new_lander/templates/deploy_new_lander_layout.tpl",
    "assets/js/apps/landerds/common/notification"
  ],
  function(Landerds, DeployToDomainLayout, Notification) {

    Landerds.module("DomainsApp.Domains.DeployNewLander", function(DeployNewLander, Landerds, Backbone, Marionette, $, _) {

      DeployNewLander.Layout = Marionette.LayoutView.extend({

        className: "modal fade",

        attributes: {
          tabindex: "-1",
          role: "dialog",
          "data-backdrop": "static"
        },

        template: DeployToDomainLayout,

        regions: {
          "landersListRegion": ".landers-list-region"
        },

        events: {
          "click .deploy-confirm": "confirmedToDeploy"
        },

        confirmedToDeploy: function() {
          var me = this;
         
          //show error if no domain selected or if more than 1 is somehow selected
          var selectedRow = me.$el.find("#landers-list-datatable").find("tr.primary");
          if (selectedRow.length <= 0 || selectedRow.length > 1) {
            me.$el.find(".alert").addClass("alert-danger").removeClass("alert-primary");
            var currentHtml = me.$el.find(".alert span").html();
            me.$el.find(".alert span").html("<i class='fa fa-exclamation pr10'></i><strong>Warning:</strong> You must select a domain first.");
            setTimeout(function() {
              me.$el.find(".alert").removeClass("alert-danger").addClass("alert-primary");
              me.$el.find(".alert span").html(currentHtml);
            }, 3000);

          } else {
             //notification that deployment may take up to 20 minutes
            // Notification("Deploying Landing Page", "May take up to 20 minutes", "success", "stack_top_right");

            var landerId = selectedRow.attr("data-lander-id");
            var lander = this.getRegion("landersListRegion").currentView.datatablesCollection.get(landerId)
            this.trigger("startDeployingNewLander", lander);
            //add a row to the deployed domains thats deploying and trigger a start on the deployToDomain job
            this.$el.modal("hide");
          }
        },


        onRender: function() {
          this.$el.modal('show');
        },

        onClose: function() {
          this.$el.modal('hide');
        }

      });

    });
    return Landerds.DomainsApp.Domains.DeployNewLander.Layout;
  });
