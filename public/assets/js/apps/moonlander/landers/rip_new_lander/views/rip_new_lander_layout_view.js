define(["app",
    "tpl!/assets/js/apps/moonlander/landers/rip_new_lander/templates/rip_new_lander_layout.tpl",
    "bootstrap.fileinput",
    "syphon"
  ],
  function(Moonlander, RipNewLanderLayoutTpl) {

    Moonlander.module("LandersApp.Landers.RipNewLander", function(RipNewLander, Moonlander, Backbone, Marionette, $, _) {

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
          "click .rip-new-lander-confirm": "confirmedRipNewLander"
        },

        confirmedRipNewLander: function(e) {

          var me = this;

          e.preventDefault();

          //key fields are valid
          var newLanderData = Backbone.Syphon.serialize(this);

          //just a very small amount of validation, all really done on server
          if (newLanderData.landerName != "" && newLanderData.landerUrl != "") {

            //1. set the new values into the job model
            this.model.set("lander_name", newLanderData.landerName);
            this.model.set("lander_url", newLanderData.landerUrl);

            //2. save the job
            this.model.save({}, {
              success: function(jobModel) {
                me.trigger("ripLanderAddedAndProcessing", jobModel);
              },
              error: function() {}
            });

          } else {
            var alert = this.$el.find(".new-lander-info-alert");
            var adminForm = this.$el.find(".admin-form");
            var currentHtml = alert.html();

            adminForm.addClass("has-error");

            alert.addClass("alert-danger");
            alert.removeClass("alert-default");
            alert.html("You must add both a new lander name &amp; lander URL to rip a new lander");


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

        onDomRefresh: function() {

        }
      });

    });
    return Moonlander.LandersApp.Landers.RipNewLander.Layout;
  });