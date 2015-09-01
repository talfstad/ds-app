define(["app", "assets/js/apps/user/login/login_view.js",
		"assets/js/apps/user/login/models/login_model.js",
    "syphon"], 
function(Moonlander, LoginView, LoginModel){
  Moonlander.module("UserApp.Login", function(Login, Moonlander, Backbone, Marionette, $, _){
    Login.Controller = {
      
      showLogin: function(id){
          Moonlander.login = new LoginModel();
          
          var loginView = new LoginView.showLogin({model: Moonlander.login});
          Moonlander.rootRegion.show(loginView);

          loginView.on("login:form:submit", function(){
            var successLoginCallback = function(model, message, other) {
               Moonlander.navigate('domains');
               
            };
            var errorLoginCallback = function(model, message, other) {
              //something happened on submit that is out of our control
              //TODO: growl here or something to let the user know
            };

            var loginFormData = Backbone.Syphon.serialize(this);
            this.model.set(loginFormData);
                  
            if(this.model.isValid(true)) {
              this.model.save({}, {success: successLoginCallback, error: errorLoginCallback});
            }
          });
      }

    }
  });

  return Moonlander.UserApp.Login.Controller;
});