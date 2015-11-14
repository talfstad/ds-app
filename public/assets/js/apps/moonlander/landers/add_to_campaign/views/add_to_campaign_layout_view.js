define(["app",
    "tpl!/assets/js/apps/moonlander/landers/add_to_campaign/templates/add_to_campaign_layout.tpl"
  ],
  function(Moonlander, AddToCampaignLayoutTpl) {

    Moonlander.module("LandersApp.Landers.AddToCampaign", function(AddToCampaign, Moonlander, Backbone, Marionette, $, _) {

      AddToCampaign.Layout = Marionette.LayoutView.extend({

        // id: "undeploy-lander-modal",

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

        events: {
          "click .add-campaign-confirm": "confirmedAddCampaign"
        },

        confirmedAddCampaign: function() {

          //show error if no domain selected or if more than 1 is somehow selected
          var selectedRow = $("#campaigns-list-datatable").find("tr.primary");
          if(selectedRow.length <= 0 || selectedRow.length > 1) {
            $(".alert").addClass("alert-danger").removeClass("alert-primary");
            var currentHtml = $(".alert span").html();
            $(".alert span").html("<i class='fa fa-exclamation pr10'></i><strong>Warning:</strong> You must select a campaign first.");
            setTimeout(function(){
              $(".alert").removeClass("alert-danger").addClass("alert-primary");
              $(".alert span").html(currentHtml);
            }, 3000);

          } else {
            
            var activeCampaignAttributes = {
              campaign_id: selectedRow.attr("data-campaign-id"),
              name: selectedRow.text(),
              lander_id: this.model.get("id"),
            };
            
            Moonlander.trigger("landers:addCampaignToLander", activeCampaignAttributes);
            this.$el.modal("hide");
          }
        },

        onRender: function() {
          var me = this;

          this.$el.off('show.bs.modal');
          this.$el.off('shown.bs.modal');

          this.$el.on('show.bs.modal', function(e){
          
           
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
    return Moonlander.LandersApp.Landers.AddToCampaign.Layout;
  });