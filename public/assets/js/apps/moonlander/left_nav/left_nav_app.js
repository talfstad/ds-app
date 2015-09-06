define(["app", "/assets/js/apps/moonlander/left_nav/list/list_controller.js"], function(Moonlander, ListController){
  Moonlander.module("LeftNavApp", function(LeftNavApp, Moonlander, Backbone, Marionette, $, _){
    
    var leftNavAPI = {
      showLeftNav: function(){
        ListController.showLeftNav();
      }
    };

    Moonlander.on("left_nav:list", function() {
      leftNavAPI.showLeftNav();
    });

    Moonlander.commands.setHandler("set:active:leftnav", function(url){
      ListController.setActiveLeftNav(url);
    });

  });

  return Moonlander.LeftNavApp;
});
