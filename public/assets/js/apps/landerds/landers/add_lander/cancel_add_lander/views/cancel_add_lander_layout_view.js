define(["app",
    "assets/js/apps/landerds/base_classes/landers/cancel_lander/cancel_lander_base_view",
    "tpl!assets/js/apps/landerds/landers/add_lander/cancel_add_lander/templates/cancel_add_lander_layout.tpl",
    "syphon"
  ],
  function(Landerds, CancelLanderBaseView, CancelAddLanderLayoutTpl) {

    Landerds.module("LandersApp.Landers.AddLander.Cancel", function(Cancel, Landerds, Backbone, Marionette, $, _) {

      Cancel.Layout = CancelLanderBaseView.extend({

        id: "cancel-add-lander-modal",

        template: CancelAddLanderLayoutTpl,

        regions: {

        },

        events: {
          "click .cancel-add-lander-confirm": "confirmedCancelAddLander",
          "keyup input": "ifEnterSubmit"
        },

        modelEvents: {

        },

        confirmedCancelAddLander: function(e) {
          e.preventDefault();

          //only submit if not already confirmed
          var data = Backbone.Syphon.serialize(this);
          this.trigger("cancelAddConfirmed", data.addError);
          this.$el.modal('hide');
        },

        onRender: function() {
          CancelLanderBaseView.prototype.initialize.apply(this);
          this.$el.modal('show');
        }

      });
    });
    return Landerds.LandersApp.Landers.AddLander.Cancel.Layout;
  });
