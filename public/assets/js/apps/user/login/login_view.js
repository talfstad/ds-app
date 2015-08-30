define(["app",
        "tpl!/assets/js/apps/user/login/templates/login_view.tpl",
        "canvasbg",
        "theme-utility",
        "theme-demo",
        "theme-main"],
function(Moonlander, loginViewTpl){
  Moonlander.module("UserApp.Login", function(Login, Moonlander, Backbone, Marionette, $, _){
    
    Login.showLogin = Marionette.ItemView.extend({
      id: "login-container",
      template: loginViewTpl,

      onDomRefresh: function(){
        "use strict";

        // Init Theme Core      
        Core.init();

        // Init Demo JS
        Demo.init();

        // Init CanvasBG and pass target starting location
        CanvasBG.init({
          Loc: {
            x: window.innerWidth / 2,
            y: window.innerHeight / 3.3
          },
        });        

        $("body").addClass("external-page sb-l-c sb-r-c onload-check");

      }



    });
  });

  return Moonlander.UserApp.Login;
});