define(["app", 
        "/assets/js/apps/moonlander/left_nav/list/list_controller.js",
        "/assets/js/common/login/common_login.js"], function(Moonlander, ListController, CommonLogin){
  Moonlander.module("LeftNavApp", function(LeftNavApp, Moonlander, Backbone, Marionette, $, _){
    
    var leftNavAPI = {
      showLeftNav: function(){
        ListController.showLeftNav();
      },
      setActiveItem: function(item){
        ListController.setActiveItem(item);
      }
    };

    Moonlander.on("left_nav:list", function() {
      CommonLogin.Check(leftNavAPI.showLeftNav);
    });

    Moonlander.on("left_nav:active", function(item) {
      leftNavAPI.setActiveItem(item);
    });
    
  });

  return Moonlander.LeftNavApp;
});