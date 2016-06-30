define(["app",
    "tpl!assets/js/apps/landerds/campaigns/add_new_lander/templates/add_new_lander_layout.tpl"
  ],
  function(Landerds, AddNewLanderLayout) {

    Landerds.module("CampaignsApp.Campaigns.AddNewLander", function(AddNewLander, Landerds, Backbone, Marionette, $, _) {

      AddNewLander.Layout = Marionette.LayoutView.extend({

        // id: "undeploy-lander-modal",

        className: "modal fade",

        attributes: {
          tabindex: "-1",
          role: "dialog",
          "data-backdrop": "static"
        },

        template: AddNewLanderLayout,

        regions: {
          "landersListRegion": ".landers-list-region"
        },

        events: {
          "click .add-campaign-confirm": "confirmedToAddCampaign"
        },

        confirmedToAddCampaign: function() {

          //show error if no lander selected or if more than 1 is somehow selected
          var selectedRow = $("#landers-list-datatable").find("tr.primary");
          if (selectedRow.length <= 0 || selectedRow.length > 1) {
            $(".alert").addClass("alert-danger").removeClass("alert-primary");
            var currentHtml = $(".alert span").html();
            $(".alert span").html("<i class='fa fa-exclamation pr10'></i><strong>Warning:</strong> You must select a lander first.");
            setTimeout(function() {
              $(".alert").removeClass("alert-danger").addClass("alert-primary");
              $(".alert span").html(currentHtml);
            }, 3000);

          } else {
            var landerId = selectedRow.attr("data-lander-id");
            var lander = this.getRegion("landersListRegion").currentView.datatablesCollection.get(landerId)
            this.startDeployingNewLander(lander);
            this.$el.modal("hide");
          }
        },

        startDeployingNewLander: function(lander) {
          this.trigger("addLanderToCampaign", lander.attributes);
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
    return Landerds.CampaignsApp.Campaigns.AddNewLander.Layout;
  });
