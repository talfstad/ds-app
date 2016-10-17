define(["app"],
  function(Landerds, Notification, RowBaseView) {
    var CancelLanderBaseView = Marionette.LayoutView.extend({

      className: "modal fade",

      attributes: {
        tabindex: "-1",
        role: "dialog",
        "data-backdrop": "static"
      },

      ifEnterSubmit: function(e) {
        if (e.keyCode == 13) {
          this.$el.find("button[type='submit']").click();
        }
      },

      alertLoading: function() {
        if (this.model.get("alertLoading")) {
          this.$el.find(".alert-loading").fadeIn();
        } else {
          this.$el.find(".alert-loading").hide();
        }
      },

      onBeforeRender: function() {

      },

      onRender: function() {
        var me = this;
        this.$el.off('show.bs.modal');
        this.$el.off('shown.bs.modal');
      },

      onClose: function() {
        this.$el.modal('hide');
      },

      closeModal: function() {
        this.$el.modal('hide');
      }

    });
    return CancelLanderBaseView;
  });
