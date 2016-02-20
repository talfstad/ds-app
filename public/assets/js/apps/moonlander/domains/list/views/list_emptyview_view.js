define(["app",
    "tpl!/assets/js/apps/moonlander/domains/list/templates/list_domains_empty.tpl"
  ],
  function(Moonlander, landersListEmptyItemsTpl) {

    Moonlander.module("DomainsApp.Domains.List", function(List, Moonlander, Backbone, Marionette, $, _) {
      List.EmptyView = Marionette.ItemView.extend({

        template: landersListEmptyItemsTpl,

        onBeforeRender: function() {
          this.model.set('filterVal', $('.lander-search').val());
        }

      });
    });
    return Moonlander.DomainsApp.Domains.List.EmptyView;
  });
