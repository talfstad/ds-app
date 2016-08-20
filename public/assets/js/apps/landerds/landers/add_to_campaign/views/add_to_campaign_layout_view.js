define(["app",
    "tpl!assets/js/apps/landerds/landers/add_to_campaign/templates/add_to_campaign_layout.tpl"
  ],
  function(Landerds, AddToCampaignLayoutTpl) {

    Landerds.module("LandersApp.Landers.AddToCampaign", function(AddToCampaign, Landerds, Backbone, Marionette, $, _) {

      AddToCampaign.Layout = Marionette.LayoutView.extend({

        className: "modal fade",

        attributes: {
          tabindex: "-1",
          role: "dialog",
          "data-backdrop": "static"
        },

        template: AddToCampaignLayoutTpl,

        regions: {
          "campaignsListRegion": ".campaigns-list-region"
        },

        modelEvents: {
          "change:saving_lander": "updateEnabledButton"
        },

        events: {
          "click .add-campaign-confirm": "confirmedAddCampaign"
        },

        updateEnabledButton: function() {
          if (this.model.get("saving_lander")) {
            this.$el.find(".add-campaign-confirm").addClass("disabled");
          } else {
            this.$el.find(".add-campaign-confirm").removeClass("disabled");
          }
        },

        confirmedAddCampaign: function() {

          //show error if no domain selected or if more than 1 is somehow selected
          var selectedRow = $("#campaigns-list-datatable").find("tr.primary");

          if (selectedRow.length <= 0 || selectedRow.length > 1) {
            $(".alert").addClass("alert-danger").removeClass("alert-primary");
            var currentHtml = $(".alert span").html();
            $(".alert span").html("<i class='fa fa-exclamation pr10'></i><strong>Warning:</strong> You must select a campaign first.");
            setTimeout(function() {
              $(".alert").removeClass("alert-danger").addClass("alert-primary");
              $(".alert span").html(currentHtml);
            }, 3000);

          } else {

            var campaignId = selectedRow.attr("data-campaign-id");

            var campaignModel = this.getRegion("campaignsListRegion").currentView.datatablesCollection.find(function(m) {
              var id = m.get('campaign_id') || m.get('id')
              return id == campaignId
            });

            this.trigger("addCampaignToLander", campaignModel);
            this.$el.modal("hide");
          }
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
    return Landerds.LandersApp.Landers.AddToCampaign.Layout;
  });
