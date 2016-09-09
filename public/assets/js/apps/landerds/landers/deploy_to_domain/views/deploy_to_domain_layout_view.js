define(["app",
    "tpl!assets/js/apps/landerds/landers/deploy_to_domain/templates/deploy_to_domain_layout.tpl",
    "assets/js/common/notification"
  ],
  function(Landerds, DeployToDomainLayout, Notification) {

    Landerds.module("LandersApp.Landers.DeployToDomain", function(DeployToDomain, Landerds, Backbone, Marionette, $, _) {

      DeployToDomain.Layout = Marionette.LayoutView.extend({

        // id: "undeploy-lander-modal",

        className: "modal fade",

        attributes: {
          tabindex: "-1",
          role: "dialog",
          "data-backdrop": "static"
        },

        template: DeployToDomainLayout,

        regions: {
          "domainsListRegion": ".domains-list-region"
        },

        events: {
          "click .deploy-confirm": "confirmedToDeploy"
        },

        modelEvents: {
          "change:saving_lander": "updateEnabledButton"
        },

        updateEnabledButton: function() {
          if (this.model.get("saving_lander")) {
            this.$el.find(".deploy-confirm").addClass("disabled");
          } else {
            this.$el.find(".deploy-confirm").removeClass("disabled");
          }
        },

        confirmedToDeploy: function() {
          var me = this;

          //show error if no domain selected or if more than 1 is somehow selected
          var selectedRow = me.$el.find("#domains-list-datatable").find("tr.primary");
          if (selectedRow.length <= 0 || selectedRow.length > 1) {
            this.$el.find(".alert").addClass("alert-danger").removeClass("alert-primary");
            var currentHtml = this.$el.find(".alert span").html();
            this.$el.find(".alert span").html("<i class='fa fa-exclamation pr10'></i><strong>Warning:</strong> You must select a domain first.");
            setTimeout(function() {
              me.$el.find(".alert").removeClass("alert-danger").addClass("alert-primary");
              me.$el.find(".alert span").html(currentHtml);
            }, 3000);

          } else {
            // Notification("Deploying Landing Page", "May take up to 20 minutes", "success", "stack_top_right");

            var domainId = selectedRow.attr("data-domain-id");
            var domain = selectedRow.text();
            this.startDeployingToNewDomain(domainId, domain);
            //add a row to the deployed domains thats deploying and trigger a start on the deployToDomain job
            this.$el.modal("hide");
          }
        },

        startDeployingToNewDomain: function(domainId, domain) {
          var domainListToDeploy = [{
            domain: domain,
            domain_id: domainId,
            lander_id: this.model.get("id")
          }];

          // triggers add row to deployed domains and starts job 
          Landerds.trigger("landers:deployLandersToDomain", {
            landerModel: this.model,
            domainListToDeploy: domainListToDeploy
          });
        },

        onRender: function() {
          this.$el.modal('show');
        },

        onClose: function() {
          this.$el.modal('hide');
        }
      });

    });
    return Landerds.LandersApp.Landers.DeployToDomain.Layout;
  });
