define(["app",
    "tpl!assets/js/apps/landerds/campaigns/add_new_campaign/templates/add_new_campaign_layout.tpl",
    "bootstrap.fileinput",
    "syphon"
  ],
  function(Landerds, AddNewCampaignLayoutTpl) {

    Landerds.module("CampaignsApp.Campaigns.AddNewCampaign", function(AddNewCampaign, Landerds, Backbone, Marionette, $, _) {

      AddNewCampaign.Layout = Marionette.LayoutView.extend({

        // id: "undeploy-lander-modal",

        className: "modal fade",

        attributes: {
          tabindex: "-1",
          role: "dialog",
          "data-backdrop": "static"
        },

        template: AddNewCampaignLayoutTpl,

        regions: {},

        events: {
          "click .add-new-campaign-confirm": "confirmedAddNewCampaign",
          "keyup input": "ifEnterSubmit"
        },

        ifEnterSubmit: function(e) {
          if (e.keyCode == 13) {
            this.$el.find("button[type='submit']").click();
          }
        },

        modelEvents: {
          "change:alertLoading": "alertLoading",
          "change:campaignInputError": "alertEnterCampaign",
          "change:campaignAlreadyAdded": "alertCampaignAlreadyAdded",
          "change:campaignInvalid": "alertCampaignInvalid",
          "change:alertUnknownError": "alertUnknownError"
        },

        alertLoading: function() {
          if (this.model.get("alertLoading")) {
            this.$el.find("span[data-handle='campaign']").text(this.model.get("name"));
            this.$el.find(".alert-loading").fadeIn();
          } else {
            this.$el.find(".alert-loading").hide();
          }
        },

        alertUnknownError: function() {
          var me = this;

          var unknownError = this.model.get("alertUnknownError");

          if (unknownError) {
            var infoAlert = this.$el.find(".aws-info-alert");
            infoAlert.hide();
            var successAlert = this.$el.find(".aws-success-alert");
            successAlert.hide();
            var defaultAlert = this.$el.find(".aws-default-alert");
            defaultAlert.hide();

            //in child view
            var adminForm = this.$el.find(".admin-form");
            adminForm.addClass("has-error");
            var errorAlert = this.$el.find(".aws-error-alert");
            errorAlert.html("We encountered an error while adding your new campaign. The error code is: " + this.model.get('errorCode') || "Unknown");
            errorAlert.fadeIn();
          }
        },

        alertCampaignInvalid: function() {
          var me = this;

          var campaignInvalid = this.model.get("campaignInvalid");

          if (campaignInvalid) {
            var infoAlert = this.$el.find(".aws-info-alert");
            infoAlert.hide();
            var successAlert = this.$el.find(".aws-success-alert");
            successAlert.hide();
            var defaultAlert = this.$el.find(".aws-default-alert");
            defaultAlert.hide();

            //in child view
            var adminForm = this.$el.find(".admin-form");
            adminForm.addClass("has-error");
            var errorAlert = this.$el.find(".aws-error-alert");
            errorAlert.html("Error: You must enter a valid campaign name.");
            errorAlert.fadeIn();

          }
        },

        alertCampaignAlreadyAdded: function() {
          var me = this;

          var campaignAlreadyAdded = this.model.get("campaignAlreadyAdded");

          if (campaignAlreadyAdded) {
            var infoAlert = this.$el.find(".aws-info-alert");
            infoAlert.hide();
            var successAlert = this.$el.find(".aws-success-alert");
            successAlert.hide();
            var defaultAlert = this.$el.find(".aws-default-alert");
            defaultAlert.hide();

            //in child view
            var adminForm = this.$el.find(".admin-form");
            adminForm.addClass("has-error");
            var errorAlert = this.$el.find(".aws-error-alert");
            errorAlert.html("Error: You have already added this campaign.");
            errorAlert.fadeIn();

          }

        },

        alertEnterCampaign: function() {
          var me = this;

          var campaignInputError = this.model.get("campaignInputError");

          if (campaignInputError) {
            var infoAlert = this.$el.find(".aws-info-alert");
            infoAlert.hide();
            var successAlert = this.$el.find(".aws-success-alert");
            successAlert.hide();
            var defaultAlert = this.$el.find(".aws-default-alert");
            defaultAlert.hide();

            //in child view
            var adminForm = this.$el.find(".admin-form");
            adminForm.addClass("has-error");
            var errorAlert = this.$el.find(".aws-error-alert");
            errorAlert.html("Error: You must enter a campaign name before adding it.");
            errorAlert.fadeIn();

          }

        },

        confirmedAddNewCampaign: function(e) {

          var me = this;

          e.preventDefault();

          if (!this.model.get("alertLoading")) {
            //key fields are valid
            var newCampaignData = Backbone.Syphon.serialize(this);

            //just a very small amount of validation, all really done on server
            if (newCampaignData.campaignName != "") {

              //1. set the new values into the job model
              this.model.set("name", newCampaignData.campaignName);

              this.trigger("confirmAddCampaign", this.model);

            } else {
              this.model.set("campaignInputError", true);
            }
          }

        },

        onRender: function() {
          var me = this;

          this.$el.off('show.bs.modal');
          this.$el.off('shown.bs.modal');

          this.$el.on('show.bs.modal', function(e) {

          });

          this.$el.on('shown.bs.modal', function(e) {
            $(".campaign-name").focus();
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
    return Landerds.CampaignsApp.Campaigns.AddNewCampaign.Layout;
  });
