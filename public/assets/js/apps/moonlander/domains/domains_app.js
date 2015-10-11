define(["app", "/assets/js/apps/moonlander/domains/list/list_controller.js",
  "/assets/js/common/login/common_login.js"
  // "/assets/js/apps/moonlander/left_nav/left_nav_app.js"
  ], 
function(Moonlander, ListController, CommonLogin){
 
  Moonlander.module("DomainsApp", function(DomainsApp, Moonlander, Backbone, Marionette, $, _){

    var domainsAppAPI = {
      showDomains: function(d){
        Moonlander.navigate("domains");

        CommonLogin.Check(function(){
          ListController.showDomains();
          Moonlander.trigger("header:active", "domains");
        });
      }
    };

    Moonlander.on("domains:list", function(){
      domainsAppAPI.showDomains();
    });

  });

  return Moonlander.DomainsApp;
});
