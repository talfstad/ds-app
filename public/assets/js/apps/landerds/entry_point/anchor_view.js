define(["app", 
  "tpl!assets/js/apps/landerds/entry_point/templates/anchor_layout.tpl"],
function(Landerds, anchorTpl){

  Landerds.module("EntryApp.AnchorView", function(AnchorView, Landerds, Backbone, Marionette, $, _){
    AnchorView.Layout = Marionette.LayoutView.extend({
      id: "main",
      template: anchorTpl,
      regions: {
        headerRegion: "#top-navbar",
        leftNavRegion: "#left-navbar",
        mainContentRegion: "#main-content",
        rightSidebarRegion: "#right-sidebar",
        modalRegion: "#modal-region"
      },

      initialize: function(){
        //always update intercom when main region changes
        this.getRegion("mainContentRegion").on("show", function(view){
          Landerds.intercom.update();
        });
      },
    
      onDomRefresh: function(){
        $("body").removeClass("sb-r-o sb-l-c").addClass("sb-r-c external-page sb-l-o onload-check");
      }
    });

  });

  return Landerds.EntryApp.AnchorView;
});
