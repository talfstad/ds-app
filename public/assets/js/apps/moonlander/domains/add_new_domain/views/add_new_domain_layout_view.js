define(["app",
    "tpl!/assets/js/apps/moonlander/domains/add_new_domain/templates/add_new_domain_layout.tpl",
    "bootstrap.fileinput",
    "syphon"
  ],
  function(Moonlander, AddNewDomainLayoutTpl) {

    Moonlander.module("DomainsApp.Domains.AddNewDomain", function(AddNewDomain, Moonlander, Backbone, Marionette, $, _) {

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
          "click .add-new-domain-confirm": "confirmedAddNewDomain"
        },

        modelEvents: {
          "change:alertLoading": "alertLoading",
          "change:domainInputError": "alertEnterDomain",
          "change:domainAlreadyAdded": "alertDomainAlreadyAdded",
          "change:domainInvalid": "alertDomainInvalid"
        },

        alertLoading: function() {
          if (this.model.get("alertLoading")) {
            this.$el.find("span[data-handle='domain']").text(this.model.get("domain"));
            this.$el.find(".alert-loading").fadeIn();
          } else {
            this.$el.find(".alert-loading").hide();
          }
        },

        showNoErrorInfo: function() {
          this.model.set({
            'alertEnterDomain': false,
            'alertDomainAlreadyAdded': false,
            'alertDomainInvalid': false
          });

          var alert = this.$el.find(".new-domain-error-alert");
          alert.hide();

          var info = this.$el.find(".new-domain-info-alert");
          info.fadeIn();
        },

        alertDomainInvalid: function() {
          var me = this;

          var domainInvalid = this.model.get("domainInvalid");

          if (domainInvalid) {
            var adminForm = this.$el.find(".admin-form");
            adminForm.addClass("has-error");

            var alert = this.$el.find(".new-domain-error-alert");
            alert.html("Error: You must enter a valid domain name.");

            var info = this.$el.find(".new-domain-info-alert");
            info.hide();

            alert.fadeIn();
          }
        },

        alertDomainAlreadyAdded: function() {
          var me = this;

          var domainAlreadyAdded = this.model.get("domainAlreadyAdded");

          if (domainAlreadyAdded) {
            var adminForm = this.$el.find(".admin-form");
            adminForm.addClass("has-error");


            var alert = this.$el.find(".new-domain-error-alert");
            alert.html("Error: You have already added this domain.");

            var info = this.$el.find(".new-domain-info-alert");
            info.hide();

            alert.fadeIn();
          }
        },

        alertEnterDomain: function() {
          var me = this;

          var domainInputError = this.model.get("domainInputError")

          if (domainInputError) {
            var adminForm = this.$el.find(".admin-form");
            adminForm.addClass("has-error");

            var alert = this.$el.find(".new-domain-error-alert");
            alert.html("Error: You must enter a domain name before adding it.");

            var info = this.$el.find(".new-domain-info-alert");
            info.hide();

            alert.fadeIn();
          }
        },

        confirmedAddNewDomain: function(e) {

          var me = this;

          e.preventDefault();

          //key fields are valid
          var newDomainData = Backbone.Syphon.serialize(this);

          //just a very small amount of validation, all really done on server
          if (newDomainData.domainName != "") {

            //1. set the new values into the job model
            this.model.set("domain", newDomainData.domainName);

            this.trigger("confirmAddDomain", this.model);

          } else {
            this.model.set("domainInputError", true);
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
    return Moonlander.DomainsApp.Domains.AddNewDomain.Layout;
  });
