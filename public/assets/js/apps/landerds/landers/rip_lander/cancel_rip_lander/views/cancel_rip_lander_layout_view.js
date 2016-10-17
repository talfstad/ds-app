define(["app",
    "assets/js/apps/landerds/base_classes/landers/cancel_lander/cancel_lander_base_view",
    "tpl!assets/js/apps/landerds/landers/rip_lander/cancel_rip_lander/templates/cancel_rip_lander_layout.tpl",
    "syphon"
  ],
  function(Landerds, CancelLanderBaseView, CancelRipLanderLayoutTpl) {

    Landerds.module("LandersApp.Landers.RipLander.Cancel", function(Cancel, Landerds, Backbone, Marionette, $, _) {

      Cancel.Layout = CancelLanderBaseView.extend({

        id: "cancel-rip-lander-modal",

        template: CancelRipLanderLayoutTpl,

        regions: {

        },

        events: {
          "click .cancel-rip-lander-confirm": "confirmedCancelRipLander",
          "keyup input": "ifEnterSubmit"
        },

        modelEvents: {

        },

        confirmedCancelRipLander: function(e) {
          e.preventDefault();

          //only submit if not already confirmed
          if (!this.model.get("alertLoading")) {
            this.trigger("cancelRipConfirmed");
          }
        },

        onRender: function() {
          CancelLanderBaseView.prototype.initialize.apply(this);
          this.$el.modal('show');
        }


      });
    });
    return Landerds.LandersApp.Landers.RipLander.Cancel.Layout;
  });
