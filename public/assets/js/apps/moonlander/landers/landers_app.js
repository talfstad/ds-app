define(["app", "/assets/js/apps/moonlander/landers/list/list_controller.js",
  "/assets/js/common/login/common_login.js",
  "/assets/js/apps/moonlander/left_nav/left_nav_app.js"], 
function(Moonlander, ListController, CommonLogin){
  Moonlander.module("LandersApp", function(LandersApp, Moonlander, Backbone, Marionette, $, _){

    var landersAppAPI = {
      showLanders: function(d){
        Moonlander.navigate("landers");
        CommonLogin.Check(function(){
          ListController.showLanders(); 
          Moonlander.trigger("left_nav:active", "landers");
        });
      }
    };

    Moonlander.on("landers:list", function(){
      landersAppAPI.showLanders();
    });

  });

  return Moonlander.LandersApp;
});