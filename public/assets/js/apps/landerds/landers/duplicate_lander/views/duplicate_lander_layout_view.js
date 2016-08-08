define(["app",
    "tpl!assets/js/apps/landerds/landers/duplicate_lander/templates/duplicate_lander_layout.tpl",
    "bootstrap.fileinput",
    "syphon"
  ],
  function(Landerds, DuplicateLanderLayoutTpl) {

    Landerds.module("LandersApp.Landers.DuplicateLander", function(DuplicateLander, Landerds, Backbone, Marionette, $, _) {

      DuplicateLander.Layout = Marionette.LayoutView.extend({

        // id: "undeploy-lander-modal",

        className: "modal fade",

        attributes: {
          tabindex: "-1",
          role: "dialog",
          "data-backdrop": "static"
        },

        template: DuplicateLanderLayoutTpl,

        regions: {},

        events: {
          "click .duplicate-lander-confirm": "confirmedDuplicateLander",
          "keyup input": "ifEnterSubmit"
        },

        ifEnterSubmit: function(e) {
          if (e.keyCode == 13) {
            this.$el.find("button[type='submit']").click();
          }
        },

        modelEvents: {
          "change:alertLoading": "alertLoading"
        },

        alertLoading: function() {
          if (this.model.get("alertLoading")) {
            this.$el.find(".alert-loading").fadeIn();
          } else {
            this.$el.find(".alert-loading").hide();
          }
        },

        confirmedDuplicateLander: function(e) {

          var me = this;

          e.preventDefault();

          //key fields are valid
          var newLanderData = Backbone.Syphon.serialize(this);

          //just a very small amount of validation, all really done on server
          if (newLanderData.landerName != "") {

            this.trigger("duplicateLanderConfirm", newLanderData.landerName);

          } else {
            var alert = this.$el.find(".new-lander-info-alert");
            var adminForm = this.$el.find(".admin-form");
            var currentHtml = alert.html();

            adminForm.addClass("has-error");

            alert.addClass("alert-danger");
            alert.removeClass("alert-default");
            alert.html("You must choose a new lander name before duplicating this lander");

            setTimeout(function() {
              adminForm.removeClass("has-error");
              alert.removeClass("alert-danger").addClass("alert-default");
              alert.html(currentHtml);
            }, 10000);

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

        closeModal: function(){
          this.$el.modal('hide');
        },

        onDomRefresh: function() {
        
        }
      });

    });
    return Landerds.LandersApp.Landers.DuplicateLander.Layout;
  });
