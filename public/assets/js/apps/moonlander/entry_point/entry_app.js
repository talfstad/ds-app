define(["app", 
  "/assets/js/apps/moonlander/entry_point/entry_controller.js",
  "/assets/js/common/login/common_login.js"], 

  function(Moonlander, EntryController, LoginCheck){

  Moonlander.module("EntryApp", function(EntryApp, Moonlander, Backbone, Marionette, $, _){
    EntryApp.startWithParent = false;
  });

  Moonlander.module("Routers.EntryApp", function(EntryApp, Moonlander, Backbone, Marionette, $, _){

    var loginCheck = function(cb, arg){
       LoginCheck(function(login){
        if(login.get("logged_in")){
          //logged in
          cb(arg);
        } else{
          //not logged in
          Moonlander.UserApp.app.execute("show:login");
        }
      });
    };

    /*
     * Will load ALL SubApps (ONLY MOONLANDER ONES)! 
     * This initializes all routes and triggers for 
     * the app! IMPORTANT SHIT!
     *
     * Also launches the entry point to the app
     */
    var startMoonlander = function() {
      EntryController.loadAnchorLayout();
      Moonlander.startSubApp("domains")


      Moonlander.trigger("domains:list");
    };

    Moonlander.on("start:moonlander", function(){
      loginCheck(startMoonlander);
    });
  });

  return Moonlander.EntryApp;
});