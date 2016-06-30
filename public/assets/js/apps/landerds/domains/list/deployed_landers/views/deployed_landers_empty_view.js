define(["app",
    "tpl!assets/js/apps/landerds/domains/list/deployed_landers/templates/empty.tpl"
  ],
  function(Landerds, EmptyTpl) {

    Landerds.module("DomainsApp.Domains.List.Deployed", function(List, Landerds, Backbone, Marionette, $, _) {
      List.EmptyView = Marionette.ItemView.extend({
        template: EmptyTpl,
        tagName: "tr",
        className: "dark"


      });
    });
    return Landerds.DomainsApp.Domains.List.Deployed.EmptyView;
  });
