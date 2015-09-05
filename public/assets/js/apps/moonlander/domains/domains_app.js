define(["app", "/assets/js/apps/moonlander/domains/list/list_controller.js",
  "/assets/js/common/login/common_login.js"], function(Moonlander, ListController, CommonLogin){
 
  Moonlander.module("DomainsApp", function(DomainsApp, Moonlander, Backbone, Marionette, $, _){

    var domainsAppAPI = {
      showDomains: function(d){
        Moonlander.navigate("domains");
        CommonLogin.Check(ListController.showDomains);
      }
    };

    Moonlander.on("domains:list", function(){
      domainsAppAPI.showDomains();
    });

  });

  return Moonlander.DomainsApp;
});
