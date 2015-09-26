define(["app",
        "tpl!/assets/js/apps/moonlander/landers/list/templates/landers_list.tpl",
        "fancytree",
        "bootstrap"
],
function(Moonlander, landersListTpl) {
  Moonlander.module("LandersApp.List", function(List, Moonlander, Backbone, Marionette, $, _) {
    
    List.Layout = Marionette.LayoutView.extend({
      
      template: landersListTpl,
      tagName: "section",
      id: "content_wrapper",

      regions: {
        landersCollectionRegion: "#landers-region",
      },

      onDomRefresh: function(){
        $("body").removeClass("external-page");
          var Body = $("body");

          //fixes search bar at the top on scroll
          $('#topbar').affix({
            offset: {
              top: 60
            }
          });
      }
    });
  });
  return Moonlander.LandersApp.List.Layout;
});