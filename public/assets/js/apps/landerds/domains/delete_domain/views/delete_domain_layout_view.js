define(["app",
    "tpl!assets/js/apps/landerds/domains/delete_domain/templates/delete_domain_layout.tpl"
  ],
  function(Landerds, DeleteDomainLayoutTpl) {

    Landerds.module("DomainsApp.Domains.DeleteDomain", function(DeleteDomain, Landerds, Backbone, Marionette, $, _) {

      DeleteDomain.Layout = Marionette.LayoutView.extend({


        className: "modal fade",

        attributes: {
          tabindex: "-1",
          role: "dialog",
          "data-backdrop": "static"
        },

        template: DeleteDomainLayoutTpl,

        regions: {
          // "groupsListRegion": ".groups-list-region"
        },

        events: {
          "click .delete-domain-confirm": "confirmedDeleteDomain",
        },

        confirmedDeleteDomain: function() {

          Landerds.trigger("domains:list:deleteDomain", this.model);
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
    return Landerds.DomainsApp.Domains.DeleteDomain.Layout;
  });