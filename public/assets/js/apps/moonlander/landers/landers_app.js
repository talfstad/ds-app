define(["app", "/assets/js/apps/moonlander/landers/list/list_controller.js",
  "/assets/js/common/login/common_login.js",
  "/assets/js/apps/moonlander/landers/right_sidebar/sidebar_controller.js",
  "/assets/js/apps/moonlander/landers/edit/edit_controller.js",
  "/assets/js/apps/moonlander/left_nav/left_nav_app.js"], 
function(Moonlander, ListController, CommonLogin, SidemenuController, EditController){
  Moonlander.module("LandersApp", function(LandersApp, Moonlander, Backbone, Marionette, $, _){

    var landersAppAPI = {
      showLanders: function(d){
        Moonlander.landers = {};
        
        Moonlander.navigate("landers");
        CommonLogin.Check(function(){
          ListController.showLanders(); 
          Moonlander.trigger("left_nav:active", "landers");
        });
      },

      showEditLander: function(model){
        EditController.showEditLander(model);
      },
      loadLandersSideMenu: function(d){
        SidemenuController.loadLandersSideMenu();
      },
      openSidebar: function(model){
        SidemenuController.openSidebar(model);
      },
      closeSidebar: function(){
        SidemenuController.closeSidebar();
      }
    };

    Moonlander.on("landers:list", function(){
      landersAppAPI.showLanders();
      landersAppAPI.loadLandersSideMenu();
    });

    Moonlander.on("landers:opensidebar", function(model){
      landersAppAPI.openSidebar(model);
    });

    Moonlander.on("landers:closesidebar", function(){
      landersAppAPI.closeSidebar();
    });

    Moonlander.on("landers:showEdit", function(model){
      landersAppAPI.showEditLander(model);
    });



  });

  return Moonlander.LandersApp;
});