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
            this.$el.find(".alert-loading").fadeIn();

          } else {
            this.$el.find(".alert-loading").hide();
          }
        },

        alertDomainInvalid: function() {
          var me = this;

          var domainInvalid = this.model.get("domainInvalid");

          if (domainInvalid) {
            var alert = this.$el.find(".new-domain-info-alert");
            var adminForm = this.$el.find(".admin-form");
            var currentHtml = alert.html();

            adminForm.addClass("has-error");

            alert.addClass("alert-danger");
            alert.removeClass("alert-default");
            alert.html("Error: You must enter a valid domain name.");


            setTimeout(function() {
              adminForm.removeClass("has-error");
              alert.removeClass("alert-danger").addClass("alert-default");
              alert.html(currentHtml);

              me.model.set("domainInvalid", false);

            }, 10000);
          }
        },

        alertDomainAlreadyAdded: function() {
          var me = this;

          var domainAlreadyAdded = this.model.get("domainAlreadyAdded");

          if (domainAlreadyAdded) {
            var alert = this.$el.find(".new-domain-info-alert");
            var adminForm = this.$el.find(".admin-form");
            var currentHtml = alert.html();

            adminForm.addClass("has-error");

            alert.addClass("alert-danger");
            alert.removeClass("alert-default");
            alert.html("Error: You have already added this domain.");


            setTimeout(function() {
              adminForm.removeClass("has-error");
              alert.removeClass("alert-danger").addClass("alert-default");
              alert.html(currentHtml);

              me.model.set("domainAlreadyAdded", false);

            }, 10000);
          }

        },

        alertEnterDomain: function() {
          if (this.model.get("domainInputError")) {
            var alert = this.$el.find(".new-domain-info-alert");
            var adminForm = this.$el.find(".admin-form");
            var currentHtml = alert.html();

            adminForm.addClass("has-error");

            alert.addClass("alert-danger");
            alert.removeClass("alert-default");
            alert.html("Error: You must enter a domain name before adding it.");


            setTimeout(function() {
              adminForm.removeClass("has-error");
              alert.removeClass("alert-danger").addClass("alert-default");
              alert.html(currentHtml);
            }, 10000);
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
