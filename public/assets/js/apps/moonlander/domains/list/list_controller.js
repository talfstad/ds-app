define(["app",
    "syphon"], 
function(Moonlander){
  Moonlander.module("DomainsApp.List", function(List, Moonlander, Backbone, Marionette, $, _){

    List.Controller = {

      showDomains: function(){
        // var loginView = new LoginView.showLogin({model: Moonlander.loginModel});
        // Moonlander.loginLayout.content.show(loginView);
        
        console.log("showing domains");
      }
    }
  });

  return Moonlander.DomainsApp.List.Controller;
});