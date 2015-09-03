define(["app", "/assets/js/apps/moonlander/entry_point/anchor_view.js"], function(Moonlander, AnchorView){
  Moonlander.module("EntryApp", function(EntryApp, RipManager, Backbone, Marionette, $, _){
    EntryApp.Controller = {
      loadAnchorLayout: function(criterion){
          var anchorLayout = new AnchorView.Layout();
          anchorLayout.render();
          Moonlander.rootRegion.show(anchorLayout);
      }
    }
  });

  return Moonlander.EntryApp.Controller;
});