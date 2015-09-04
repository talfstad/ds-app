define(["app", "/assets/js/apps/moonlander/domains/list/list_controller.js",
  "/assets/js/common/login/common_login.js"], function(Moonlander, ListController, CommonLogin){
  Moonlander.module("DomainsApp", function(DomainsApp, Moonlander, Backbone, Marionette, $, _){
    DomainsApp.startWithParent = false;
  });

  Moonlander.module("Routers.DomainsApp", function(DomainsApp, Moonlander, Backbone, Marionette, $, _){
    DomainsApp.Router = Marionette.AppRouter.extend({
      appRoutes: {
        "domains": "showDomains"
      }
    });

    var loginCheck = function(action, arg){
      CommonLogin.Check(function(login){
        if(login.get("logged_in")){
          //logged in
          action(arg);
        } else {
          //not logged in
          Moonlander.execute("show:login");
        }
      });
    };

    var domainsAppAPI = {
      showDomains: function(d){
        Moonlander.navigate("domains");
        loginCheck(ListController.showDomains);
      }
    };

    Moonlander.on("domains:list", function(){
      domainsAppAPI.showDomains();
    });

    Moonlander.addInitializer(function(){
      new DomainsApp.Router({
        controller: domainsAppAPI
      });
    });
  });

  return Moonlander.DomainsApp;
});
