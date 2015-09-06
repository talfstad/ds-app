define(["app", "tpl!/assets/js/apps/moonlander/entry_point/templates/anchor_layout.tpl"],
function(Moonlander, anchorTpl){

  Moonlander.module("EntryApp.AnchorView", function(AnchorView, Moonlander, Backbone, Marionette, $, _){
    AnchorView.Layout = Marionette.LayoutView.extend({
      id: "moonlander-app",
      template: anchorTpl,
      regions: {
        headerRegion: "#top-navbar",
        leftNavRegion: "#left-navbar",
        rightSidebarRegion: "#right-sidebar"
      },
    
      onDomRefresh: function(){
        $("body").removeClass("sb-r-o sb-l-c").addClass("sb-r-c external-page sb-l-o onload-check");
      }
    });

  });

  return Moonlander.EntryApp.AnchorView;
});
