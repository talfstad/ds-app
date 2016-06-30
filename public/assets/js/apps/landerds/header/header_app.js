define(["app", 
        "assets/js/apps/landerds/header/list/list_controller",
        "assets/js/common/login/common_login"], 
function(Landerds, ListController, CommonLogin){
  Landerds.module("HeaderApp", function(Header, Landerds, Backbone, Marionette, $, _){

    var headerAPI = {
      listHeader: function(){
        CommonLogin.Check(ListController.listHeader);
      },
      setActiveItem: function(item){
        ListController.setActiveItem(item);
      }
    };

    Landerds.on("header:list", function(){
      headerAPI.listHeader();
    });

    Landerds.on("header:active", function(item) {
      headerAPI.setActiveItem(item);
    });

  });

  return Landerds.HeaderApp;
});
