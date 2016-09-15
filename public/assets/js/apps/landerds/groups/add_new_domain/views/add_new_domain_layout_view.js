define(["app",
    "tpl!assets/js/apps/landerds/groups/add_new_domain/templates/add_new_domain_layout.tpl"
  ],
  function(Landerds, DeployToDomainLayout) {

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

        confirmedToDeploy: function() {

          //show error if no domain selected or if more than 1 is somehow selected
          var selectedRow = $("#domains-list-datatable").find("tr.primary");
          if (selectedRow.length <= 0 || selectedRow.length > 1) {
            $(".alert").addClass("alert-danger").removeClass("alert-primary");
            var currentHtml = $(".alert span").html();
            $(".alert span").html("<i class='fa fa-exclamation pr10'></i><strong>Warning:</strong> You must select a domain first.");
            setTimeout(function() {
              $(".alert").removeClass("alert-danger").addClass("alert-primary");
              $(".alert span").html(currentHtml);
            }, 3000);

          } else {
            var domainId = selectedRow.attr("data-domain-id");

            var domain = this.getRegion("domainsListRegion").currentView.datatablesCollection.find(function(m) {
              var id = m.get('domain_id') || m.get('id')
              return id == domainId
            });

            this.startDeployingLandersToNewDomain(domain);
            //add a row to the deployed domains thats deploying and trigger a start on the deployToDomain job
            this.$el.modal("hide");
          }
        },

        startDeployingLandersToNewDomain: function(domain) {
          // triggers add row to deployed domains and starts job 
          this.trigger("addDomainToGroups", domain.attributes);
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
    return Landerds.LandersApp.Landers.DeployToDomain.Layout;
  });
