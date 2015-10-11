define(["app", 
        "/assets/js/apps/moonlander/header/list/list_controller.js",
        "/assets/js/common/login/common_login.js"], 
function(Moonlander, ListController, CommonLogin){
  Moonlander.module("HeaderApp", function(Header, Moonlander, Backbone, Marionette, $, _){

    var headerAPI = {
      listHeader: function(){
        CommonLogin.Check(ListController.listHeader);
      },
      setActiveItem: function(item){
        ListController.setActiveItem(item);
      }
    };

    Moonlander.on("header:list", function(){
      headerAPI.listHeader();
    });

    Moonlander.on("header:active", function(item) {
      headerAPI.setActiveItem(item);
    });

  });

  return Moonlander.HeaderApp;
});
