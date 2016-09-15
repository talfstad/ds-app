define(["app",
    "tpl!assets/js/apps/landerds/groups/undeploy_domain/templates/undeploy_domain_layout.tpl"
  ],
  function(Landerds, RemoveDomainLayout) {

    Landerds.module("GroupsApp.Groups.RemoveDomain", function(RemoveDomain, Landerds, Backbone, Marionette, $, _) {

      RemoveDomain.Layout = Marionette.LayoutView.extend({

        className: "modal fade",

        attributes: {
          tabindex: "-1",
          role: "dialog",
          "data-backdrop": "static"
        },

        template: RemoveDomainLayout,

        events: {
          "click .remove-domain-confirm": "confirmedRemoveDomain"
        },

        initialize: function() {
          this.groupModel = this.options.group_model;
          this.domainModel = this.options.domain_model;
        },

        templateHelpers: function() {
          return {
            group_name: this.groupModel.get("name"),
            domain_name: this.domainModel.get("domain")
          }
        },

        confirmedRemoveDomain: function(domain) {
          this.trigger("removeDomainFromGroupsConfirm");
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
    return Landerds.GroupsApp.Groups.RemoveDomain.Layout;
  });
