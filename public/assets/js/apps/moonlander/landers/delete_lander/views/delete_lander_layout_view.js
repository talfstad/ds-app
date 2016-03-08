define(["app",
    "tpl!assets/js/apps/moonlander/landers/delete_lander/templates/delete_lander_layout.tpl"
  ],
  function(Moonlander, DeleteLanderLayoutTpl) {

    Moonlander.module("LandersApp.Landers.DeleteLander", function(DeleteLander, Moonlander, Backbone, Marionette, $, _) {

      DeleteLander.Layout = Marionette.LayoutView.extend({

        // id: "undeploy-lander-modal",

        className: "modal fade",

        attributes: {
          tabindex: "-1",
          role: "dialog",
          "data-backdrop": "static"
        },

        template: DeleteLanderLayoutTpl,

        regions: {
          // "campaignsListRegion": ".campaigns-list-region"
        },

        events: {
          "click .delete-lander-confirm": "confirmedDeleteLander",
        },

        confirmedDeleteLander: function() {

          Moonlander.trigger("landers:list:deleteLander", this.model);
          this.$el.modal("hide");

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
    return Moonlander.LandersApp.Landers.DeleteLander.Layout;
  });
