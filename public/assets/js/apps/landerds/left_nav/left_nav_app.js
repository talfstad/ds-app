define(["app", 
        "/assets/js/apps/landerds/left_nav/list/list_controller.js",
        "/assets/js/common/login/common_login.js"], function(Landerds, ListController, CommonLogin){
  Landerds.module("LeftNavApp", function(LeftNavApp, Landerds, Backbone, Marionette, $, _){
    
    var leftNavAPI = {
      showLeftNav: function(){
        ListController.showLeftNav();
      },
      setActiveItem: function(item){
        ListController.setActiveItem(item);
      }
    };

    Landerds.on("left_nav:list", function() {
      CommonLogin.Check(leftNavAPI.showLeftNav);
    });

    Landerds.on("left_nav:active", function(item) {
      leftNavAPI.setActiveItem(item);
    });
    
  });

  return Landerds.LeftNavApp;
});