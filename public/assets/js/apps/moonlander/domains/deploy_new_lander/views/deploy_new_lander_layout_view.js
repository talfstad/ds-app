define(["app",
    "tpl!/assets/js/apps/moonlander/domains/deploy_new_lander/templates/deploy_new_lander_layout.tpl"
  ],
  function(Moonlander, DeployToDomainLayout) {

    Moonlander.module("DomainsApp.Domains.DeployNewLander", function(DeployNewLander, Moonlander, Backbone, Marionette, $, _) {

      DeployNewLander.Layout = Marionette.LayoutView.extend({

        // id: "undeploy-lander-modal",

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

          //show error if no domain selected or if more than 1 is somehow selected
          var selectedRow = $("#landers-list-datatable").find("tr.primary");
          if (selectedRow.length <= 0 || selectedRow.length > 1) {
            $(".alert").addClass("alert-danger").removeClass("alert-primary");
            var currentHtml = $(".alert span").html();
            $(".alert span").html("<i class='fa fa-exclamation pr10'></i><strong>Warning:</strong> You must select a domain first.");
            setTimeout(function() {
              $(".alert").removeClass("alert-danger").addClass("alert-primary");
              $(".alert span").html(currentHtml);
            }, 3000);

          } else {
            var landerId = selectedRow.attr("data-lander-id");
            var lander = this.getRegion("landersListRegion").currentView.datatablesCollection.get(landerId)
            this.startDeployingNewLander(lander);
            //add a row to the deployed domains thats deploying and trigger a start on the deployToDomain job
            this.$el.modal("hide");
          }
        },

        startDeployingNewLander: function(lander) {
          var attrs = {
              landerAttributes: lander.attributes,
              domain_id: this.model.get("id"),
            };
            // triggers add row to deployed domains and starts job 
          Moonlander.trigger("domains:deployNewLander", attrs);
        },

        onRender: function() {
          var me = this;

          this.$el.off('show.bs.modal');
          this.$el.off('shown.bs.modal');

          this.$el.on('show.bs.modal', function(e) {


          });

          this.$el.on('shown.bs.modal', function(e) {


          });

          this.$el.modal('show');

        },

        onClose: function() {
          this.$el.modal('hide');
        },

        onDomRefresh: function() {


        }
      });

    });
    return Moonlander.DomainsApp.Domains.DeployNewLander.Layout;
  });
