define(["app", "tpl!/assets/js/apps/moonlander/entry_point/templates/anchor_layout.tpl"],
function(Moonlander, anchorTpl){

  Moonlander.module("EntryApp.AnchorView", function(AnchorView, Moonlander, Backbone, Marionette, $, _){
    AnchorView.Layout = Marionette.LayoutView.extend({
      id: "moonlander-app",
      template: anchorTpl,
      regions: {
        topbar: "#top-navbar",
        leftSidebar: "#left-navbar",
        rightSidebar: "#right-sidebar"
      }
    });

  });

  return Moonlander.EntryApp.AnchorView;
});
