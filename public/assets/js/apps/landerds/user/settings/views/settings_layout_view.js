define(["app",
    "tpl!assets/js/apps/landerds/user/settings/templates/settings_layout.tpl",
    "syphon"
  ],
  function(Landerds, SettingsLayoutTpl) {

    Landerds.module("UserApp.Settings", function(Settings, Landerds, Backbone, Marionette, $, _) {

      Settings.Layout = Marionette.LayoutView.extend({

        id: "user-settings-modal",

        className: "modal fade",

        attributes: {
          tabindex: "-1",
          role: "dialog",
          "data-backdrop": "static"
        },

        template: SettingsLayoutTpl,

        regions: {
          'awsSettingsRegion': ".aws-settings-region"
        },

        modelEvents: {
          "change:alertLoading": "alertLoading",
          "change:alertKeysInvalid": "alertKeysInvalid",
          "change:alertKeysAlreadyCurrent": "alertKeysAlreadyCurrent",
          "change:alertUpdatedAwsKeys": "alertUpdatedAwsKeys",
          "change:alertUnknownError": "alertUnknownError"
        },

        events: {
          "click .update-aws-access-keys": "confirmUpdateAwsAccessKeys"
        },

        alertLoading: function() {
          if (this.model.get("alertLoading")) {
            this.$el.find(".alert-loading").fadeIn();
          } else {
            this.$el.find(".alert-loading").hide();
          }
        },

        alertUpdatedAwsKeys: function() {
          var me = this;

          var updatedKeysSuccessfully = this.model.get("alertUpdatedAwsKeys");

          if (updatedKeysSuccessfully) {
            var defaultAlert = this.$el.find(".aws-default-alert");
            defaultAlert.hide();
            var infoAlert = this.$el.find(".aws-info-alert");
            infoAlert.hide();
            var errorAlert = this.$el.find(".aws-error-alert");
            errorAlert.hide();
            var adminForm = this.$el.find(".admin-form");
            adminForm.removeClass("has-error");

            var successAlert = this.$el.find(".aws-success-alert");
            successAlert.html("We have successfully migrated you to your new AWS Account. You can now continue working as before.");
            successAlert.fadeIn();
          }
        },

        alertKeysAlreadyCurrent: function() {
          var me = this;

          var keysAlreadyCurrent = this.model.get("alertKeysAlreadyCurrent");

          if (keysAlreadyCurrent) {
            var defaultAlert = this.$el.find(".aws-default-alert");
            defaultAlert.hide();
            var successAlert = this.$el.find(".aws-success-alert");
            successAlert.hide();
            var errorAlert = this.$el.find(".aws-error-alert");
            errorAlert.hide();
            var adminForm = this.$el.find(".admin-form");
            adminForm.removeClass("has-error");

            var infoAlert = this.$el.find(".aws-info-alert");
            infoAlert.html("Good News: We've already got these keys stored for you. <a class='alert-link' href='#'>How do I get new AWS keys?</a>");
            infoAlert.fadeIn();
          }
        },

        alertKeysInvalid: function() {
          var me = this;

          var keysInvalid = this.model.get("alertKeysInvalid");

          if (keysInvalid) {
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
            errorAlert.html("The keys you entered didn't work. Please try to enter them again. <a class='alert-link' href='#'>How do I get new AWS keys?</a>");
            errorAlert.fadeIn();
            
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
            errorAlert.html("We encountered an error while changing your credentials. The error code is: " + this.model.get('errorCode') || "Unknown");
            errorAlert.fadeIn();
            
          }
        },

        confirmUpdateAwsAccessKeys: function(e) {
          var me = this;

          e.preventDefault();

          //key fields are valid
          var accessKeyData = Backbone.Syphon.serialize(this);

          //like a very little bit of validation
          if (accessKeyData.accessKeyId != "" && accessKeyData.secretAccessKey != "") {
            this.trigger("confirmUpdateAwsAccessKeys", accessKeyData);
          } else {
            var alert = this.$el.find(".aws-info-alert");

            var currentHtml = alert.html();

            alert.addClass("alert-danger");
            alert.removeClass("alert-default");
            alert.html("You must enter a valid access key ID &amp; secret access key to update your access keys");

            setTimeout(function() {
              alert.removeClass("alert-danger").addClass("alert-default");
              alert.html(currentHtml);
            }, 5000);

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
    return Landerds.UserApp.Settings.Layout;
  });
