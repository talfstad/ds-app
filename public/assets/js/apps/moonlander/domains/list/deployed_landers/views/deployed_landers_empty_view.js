define(["app",
    "tpl!/assets/js/apps/moonlander/domains/list/deployed_landers/templates/empty.tpl"
  ],
  function(Moonlander, EmptyTpl) {

    Moonlander.module("DomainsApp.Domains.List.Deployed", function(List, Moonlander, Backbone, Marionette, $, _) {
      List.EmptyView = Marionette.ItemView.extend({
        template: EmptyTpl,
        tagName: "tr",
        className: "dark"


      });
    });
    return Moonlander.DomainsApp.Domains.List.Deployed.EmptyView;
  });
