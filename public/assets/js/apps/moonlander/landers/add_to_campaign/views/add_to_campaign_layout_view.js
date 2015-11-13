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
            $(".alert span").html("<i class='fa fa-exclamation pr10'></i><strong>Warning:</strong> You must select a domain first.");
            setTimeout(function(){
              $(".alert").removeClass("alert-danger").addClass("alert-primary");
              $(".alert span").html(currentHtml);
            }, 3000);

          } else {
            // var domainId = selectedRow.attr("data-domain-id");
            // var domain = selectedRow.text();
            // this.startDeployingToNewDomain(domainId, domain);
            // //add a row to the deployed domains thats deploying and trigger a start on the deployToDomain job
            // this.$el.modal("hide");
          }       
        },

        // startDeployingToNewDomain: function(domainId, domain){
        //   var attrs = {
        //     domain: domain,
        //     id: domainId,
        //     lander_id: this.model.get("id")
        //   }
        //   // triggers add row to deployed domains and starts job 
        //   Moonlander.trigger("landers:deployLanderToNewDomain", attrs);
        // },

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