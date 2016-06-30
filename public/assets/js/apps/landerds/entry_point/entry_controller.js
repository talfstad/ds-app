define(["app", 
  "assets/js/apps/landerds/entry_point/anchor_view"], 
  function(Landerds, AnchorView){
  Landerds.module("EntryApp", function(EntryApp, RipManager, Backbone, Marionette, $, _){
    EntryApp.Controller = {
      loadAnchorLayout: function(criterion){
          var anchorLayout = new AnchorView.Layout();
          anchorLayout.render();
          Landerds.rootRegion.show(anchorLayout);
      }
    }
  });

  return Landerds.EntryApp.Controller;
});