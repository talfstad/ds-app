define(["app",
    "tpl!assets/js/apps/moonlander/domains/delete_domain/templates/delete_domain_layout.tpl"
  ],
  function(Moonlander, DeleteDomainLayoutTpl) {

    Moonlander.module("DomainsApp.Domains.DeleteDomain", function(DeleteDomain, Moonlander, Backbone, Marionette, $, _) {

      DeleteDomain.Layout = Marionette.LayoutView.extend({


        className: "modal fade",

        attributes: {
          tabindex: "-1",
          role: "dialog",
          "data-backdrop": "static"
        },

        template: DeleteDomainLayoutTpl,

        regions: {
          // "campaignsListRegion": ".campaigns-list-region"
        },

        events: {
          "click .delete-domain-confirm": "confirmedDeleteDomain",
        },

        confirmedDeleteDomain: function() {

          Moonlander.trigger("domains:list:deleteDomain", this.model);
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
    return Moonlander.DomainsApp.Domains.DeleteDomain.Layout;
  });