define(["app",
    "tpl!assets/js/apps/landerds/domains/add_new_domain/templates/add_new_domain_layout.tpl",
    "bootstrap.fileinput",
    "syphon"
  ],
  function(Landerds, AddNewDomainLayoutTpl) {

    Landerds.module("DomainsApp.Domains.AddNewDomain", function(AddNewDomain, Landerds, Backbone, Marionette, $, _) {

      AddNewDomain.Layout = Marionette.LayoutView.extend({

        // id: "undeploy-lander-modal",

        className: "modal fade",

        attributes: {
          tabindex: "-1",
          role: "dialog",
          "data-backdrop": "static"
        },

        template: AddNewDomainLayoutTpl,

        regions: {},

        events: {
          "click .add-new-domain-confirm": "confirmedAddNewDomain",
          "keyup input": "ifEnterSubmit"
        },

        ifEnterSubmit: function(e) {
          if (e.keyCode == 13) {
            this.$el.find("button[type='submit']").click();
          }
        },

        modelEvents: {
          "change:alertLoading": "alertLoading",
          "change:domainInputError": "alertEnterDomain",
          "change:domainAlreadyAdded": "alertDomainAlreadyAdded",
          "change:domainInvalid": "alertDomainInvalid",
          "change:alertUnknownError": "alertUnknownError"
        },

        alertLoading: function() {
          if (this.model.get("alertLoading")) {
            this.$el.find("span[data-handle='domain']").text(this.model.get("domain"));
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
            errorAlert.html("We encountered an error while adding your new domain. The error code is: " + this.model.get('errorCode') || "Unknown");
            errorAlert.fadeIn();

          }
        },

        alertDomainInvalid: function() {
          var me = this;

          var domainInvalid = this.model.get("domainInvalid");

          if (domainInvalid) {
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
            errorAlert.html("Error: You must enter a valid domain name.");
            errorAlert.fadeIn();

          }
        },

        alertDomainAlreadyAdded: function() {
          var me = this;

          var domainAlreadyAdded = this.model.get("domainAlreadyAdded");

          if (domainAlreadyAdded) {
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
            errorAlert.html("Error: This domain already exists within AWS.");
            errorAlert.fadeIn();

          }

        },

        alertEnterDomain: function() {
          var me = this;

          var domainInputError = this.model.get("domainInputError");

          if (domainInputError) {
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
            errorAlert.html("Error: You must enter a domain name before adding it.");
            errorAlert.fadeIn();

          }

        },

        confirmedAddNewDomain: function(e) {

          var me = this;

          e.preventDefault();

          if (!this.model.get("alertLoading")) {
            //key fields are valid
            var newDomainData = Backbone.Syphon.serialize(this);

            //just a very small amount of validation, all really done on server
            if (newDomainData.domainName != "") {

              //1. set the new values into the job model
              this.model.set("domain", newDomainData.domainName);
              this.model.set("subdomain", newDomainData.subdomain);

              this.trigger("confirmAddDomain", this.model);

            } else {
              this.model.set("domainInputError", true);
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
            $(".domain-name").focus();
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
    return Landerds.DomainsApp.Domains.AddNewDomain.Layout;
  });
