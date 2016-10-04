define(["app",
    "tpl!assets/js/apps/landerds/landers/rip_new_lander/templates/rip_new_lander_layout.tpl",
    "bootstrap.fileinput",
    "syphon"
  ],
  function(Landerds, RipNewLanderLayoutTpl) {

    Landerds.module("LandersApp.Landers.RipNewLander", function(RipNewLander, Landerds, Backbone, Marionette, $, _) {

      RipNewLander.Layout = Marionette.LayoutView.extend({

        // id: "undeploy-lander-modal",

        className: "modal fade",

        attributes: {
          tabindex: "-1",
          role: "dialog",
          "data-backdrop": "static"
        },

        template: RipNewLanderLayoutTpl,

        regions: {},

        events: {
          "click .rip-new-lander-confirm": "confirmedRipNewLander",
          "click #toggle-advanced-rip-settings": "toggleAdvancedSettings",
          "keyup input": "ifEnterSubmit"
        },

        ifEnterSubmit: function(e) {
          if (e.keyCode == 13) {
            this.$el.find("button[type='submit']").click();
          }
        },

        toggleAdvancedSettings: function(e) {
          if (e) e.preventDefault();

          var ripAdvancedSettings = this.$el.find("#rip-advanced-settings");
          var advancedSettingsText = this.$el.find("#toggle-advanced-rip-settings");

          if (ripAdvancedSettings.css("display") == "none") {
            ripAdvancedSettings.fadeIn("fast");
            advancedSettingsText.html("<i style='position: relative' class='mr5 fa fa-arrow-circle-up'></i> Hide Advanced Settings");
          } else {
            ripAdvancedSettings.fadeOut("fast", function() {
              advancedSettingsText.html("<i style='position: relative' class='mr5 fa fa-arrow-circle-down'></i> Show Advanced Settings");
            });
          }

        },

        modelEvents: {
          "change:alertLoading": "alertLoading",
          "change:alertInvalidInputs": "alertInvalidInputs"
        },

        alertInvalidInputs: function() {
          var alert = this.$el.find(".new-lander-info-alert");
          var adminForm = this.$el.find(".admin-form");
          var currentHtml = alert.html();

          if (this.model.get("alertInvalidInputs")) {
            adminForm.addClass("has-error");

            alert.addClass("alert-danger");
            alert.removeClass("alert-default");
            alert.html("You must add both a new lander name &amp; a valid lander URL to rip a new lander");
          } else {
            adminForm.removeClass("has-error");
            alert.removeClass("alert-danger").addClass("alert-default");
            alert.html(currentHtml);
          }
        },

        alertLoading: function() {
          if (this.model.get("alertLoading")) {
            this.$el.find(".alert-loading").fadeIn();
          } else {
            this.$el.find(".alert-loading").hide();
          }
        },

        confirmedRipNewLander: function(e) {

          var me = this;
          e.preventDefault();

          //only submit if not already confirmed
          if (!this.model.get("alertLoading")) {
            //key fields are valid
            var newLanderData = Backbone.Syphon.serialize(this);

            //just a very small amount of validation, all really done on server
            if (newLanderData.landerName != "" && newLanderData.landerUrl != "" && newLanderData.browser) {

              //1. set the new values into the job model
              this.model.set({
                "name": newLanderData.landerName,
                "lander_url": newLanderData.landerUrl,
                "browser": newLanderData.browser,
                "depth": newLanderData.depth,
                "alertInvalidInputs": false
              });

              me.trigger("ripLanderConfirmed");

            } else {
              this.model.set("alertInvalidInputs", true);
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
            $(".lander-name").focus();
          });

          this.$el.modal('show');

        },

        onClose: function() {
          this.$el.modal('hide');
        },

        closeModal: function() {
          this.$el.modal('hide');
        },

        onDomRefresh: function() {

        }
      });

    });
    return Landerds.LandersApp.Landers.RipNewLander.Layout;
  });
